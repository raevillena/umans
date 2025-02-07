import { User, Apps, Roles } from '../models/index.js';
import { generateTokens, revokeToken } from '../services/sessionService.js'
import sendEmail from '../services/emailService.js';

const envResetTokenExpiry = process.env.PASSWD_RESET_TOKEN_EXPIRY || 3600000;
const apiUrl = process.env.API_URL || 'localhost:3001';

export const login = async (req, res, next) => {
    const { email, password, appId } = req.body;
    console.log(req.body);
    try {
        const user = await User.findOne({ 
            where: {
                email: email,
                isActive: true
            },
            attributes: ['id', 'email', 'password', 'role'],
            include: [  
                {
                    model: Apps,
                    where: {
                        id: appId,
                        isActive: true
                    },
                    attributes: ['name'],
                    through:{
                        model:Roles,
                        attributes: ['userType']
                    }
                }
            ]
        });
        if (!user) {
            const error = new Error('user not found change this to Invalid Credentials');
            error.status = 401;
            return next(error);
        }

        // Validate password, check password if matched when unhashed
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            const error = new Error('Invalid Password, change this error message');
            error.status = 401;
            return next(error);
        }
        const { accessToken, refreshToken } = await generateTokens(user.id, user.role, user.role==='admin'? 0 :appId);
        
        // Remove password from response
        const userResponse = user.toJSON();
        delete userResponse.password;

        res.status(200).json({
            msg: 'Login Successfull',
            user: userResponse,
            token: {accessToken, refreshToken}
        });
    } catch (error) {
        error.status = 401;
        return next(error);
    }
}

//super Login route
export const superLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ 
            where: {
                email: email,
                isActive: true
            },
            attributes: ['id', 'email', 'password', 'role'],
            include: [  
                {
                    model: Apps,
                    where: {
                        isActive: true
                    },
                    attributes: ['name'],
                    through:{
                        model:Roles,
                        attributes: ['userType']
                    }
                }
            ]
            
        });

        if (!user) {
            const error = new Error('Invalid Credentials');
            error.status = 401;
            return next(error);
        }

        if (user.role !== 'admin') {
            const error = new Error('Sneaky Bastard, you are not an admin.');
            error.status = 401;
            return next(error);
        }

        // Validate password, check password if matched when unhashed
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            const error = new Error('Validation Failed //dev mode change to real one');
            error.status = 401;
            return next(error);
        }

     
        const { accessToken, refreshToken } = await generateTokens(user.id, user.role, 0);
        
        // Remove password from response
        const userResponse = user.toJSON();
        delete userResponse.password;

        res.status(200).json({
            msg: 'Login Successfull',
            user: userResponse,
            token: {accessToken, refreshToken}
        });
    } catch (error) {
        error.status = 401;
        return next(error);
    }
}


// create new user
// POST /api/users
export const register = async (req, res, next) => {
    if(!req.body.username){
        const error = new Error('Please include a name');
        error.status = 400;
        return next(error);
    }

    try {
        const user = await User.create(req.body);
        const userResponse = user.toJSON();
        delete userResponse.password;
        res.status(201).json(userResponse);
    } catch (error) {
        //const error2 = new Error('creating a user failed');
        error.status = 400;
        return next(error);
    }
}

// logout user
// POST /api/auth/logout
export const logout = async (req, res, next) => {
    try{
        const { access_token, refresh_token } = req.body;
        if (access_token) await revokeToken(access_token, 'access');
        if (refresh_token) await revokeToken(refresh_token, 'refresh');
        res.status(200).json({ message: 'Logged out successfully' });
    }catch (error){
        error.status = 500;
        return next(error);
    }
}

// reissue refresh token
// POST /api/auth/refresh
export const refresh = async (req, res, next) => {
    //get and check if refresh token is present, if not then return with error
    const { refresh_token } = req.body;
    if (!refresh_token){
        const error = new Error('No refresh token provided');
        error.status = 400;
        return next(error);
    }
    //get token from sql database, verified if present
    const storedToken = await verifyToken(refresh_token, 'refresh');
    //check if token is existing and not expired
    if (!storedToken || storedToken.expiresAt < new Date()) {
        const error = new Error('Invalid or expired refresh token');
        error.status = 401;
        return next(error);
    }
    // Generate new access token
    const { accessToken } = await generateTokens(storedToken.userId);
    res.status(200).json({ access_token: accessToken });
}

export const requestPasswdReset = async (req, res) => {
    //get email from body
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      // Generate a secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + envResetTokenExpiry; // Token valid for 1 hour

      // Save token in database
      await user.update({ resetToken, resetTokenExpiry });

      // Send the reset email
      const resetLink = `${apiUrl}/reset-password/${resetToken}`; //send page of password reset instead this one is direct to the api 
      await sendEmail(user.email, 'Password Reset Request', `Click this link to reset your password: ${resetLink}`);

      return res.status(200).json({ message: 'Password reset link sent to email' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};



export const resetPasswd = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({ 
      where: { resetToken: token, resetTokenExpiry: { [Op.gt]: Date.now() } }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update password and clear reset token
    await user.update({
      password: newPassword, // Sequelize hooks will hash it
      resetToken: null,
      resetTokenExpiry: null
    });

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}