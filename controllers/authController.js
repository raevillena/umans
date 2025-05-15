//some libraries for generation
import crypto from 'crypto';
import { Op } from '@sequelize/core';

import { User, Apps, Roles } from '../models/index.js';
import { generateTokens, revokeToken, verifyToken, reGenerateAccessToken } from '../services/sessionService.js'
import sendEmail from '../services/emailService.js';
import { logAction } from '../services/loggerService.js';

const envResetTokenExpiry = Number(process.env.PASSWD_RESET_TOKEN_EXPIRY) || 3600000;
const apiUrl = process.env.API_URL || 'localhost:3001';
const domainUrl = process.env.DOMAIN_URL || 'localhost:3001';

export const login = async (req, res, next) => {
    const { email, password, appId } = req.body;
    try {
        const user = await User.findOne({ 
            where: {
                email: email,
                isActive: true
            },
            attributes: ['id', 'email', 'password', 'role','mobileNo', 'firstName', 'lastName', 'avatar'],
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
    const requestorID = req.headers['x-user-id'] || req.body.id || 1; // Default to 1 if not provided
    try {
        const user = await User.findOne({ 
            where: {
                email: email,
                isActive: true
            },
            attributes: ['id', 'email', 'password', 'role', 'mobileNo', 'firstName', 'lastName', 'avatar'],
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
            try{
                const user = await User.findOne({ 
                    where: {
                        email: email,
                        isActive: true
                    },
                    attributes: ['email']                    
                });
                if (user) {
                    const error = new Error('User has been created but not assigned to any app, please contact administator.');
                    error.status = 400;
                    return next(error);
                }
            }catch(error){
                error.status = 400;
                return next(error);
            }
            const error = new Error('Invalid Credentials');
            error.status = 400;
            return next(error);
        }

        if (user.role !== 'admin') {
            // Log the action
            await logAction({
                action: 'Login Attempt Failed',
                details: JSON.stringify(req.body),
                userId: requestorID, //requestor id needs to be existing user id in the users table
                targetId: 0,
                targetType: 'User',
                ipAddress: req.ip,
            });
            const error = new Error('Sneaky Bastard, you are not an admin.');
            error.status = 400;
            return next(error);
        }

        // Validate password, check password if matched when unhashed
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            const error = new Error('Wrong password //change this later');
            error.status = 400;
            return next(error);
        }

     
        const { accessToken, refreshToken } = await generateTokens(user.id, user.role, 0);
        
        // Remove password from response
        const userResponse = user.toJSON();
        delete userResponse.password;

        //put the refresh token in the cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,  // Prevent JavaScript access
            secure: true, //process.env.NODE_ENV === "production", // Use HTTPS in production
            sameSite: "None", //Strict to same site
            path: "/api/auth",  // Restrict cookie to auth routes
        });

        // Log the action
        await logAction({
            action: 'Super Login',
            details: JSON.stringify(userResponse),
            userId: user.id, //requestor id needs to be existing user id in the users table
            targetId: userResponse.id,
            targetType: 'User',
            ipAddress: req.ip,
        });

        res.status(200).json({
            msg: 'Login Successfull',
            user: userResponse,
            token: {accessToken, refreshToken}
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// create new user
// POST /api/users
export const register = async (req, res, next) => {
    console.log(req.body)
    if(!req.body.email){
        const error = new Error('Please include email');
        error.status = 400;
        return next(error);
    }

    try {
        const user = await User.create(req.body);
        const userResponse = user.toJSON();
        delete userResponse.password;

        // Log the action
        await logAction({
            action: 'Create User',
            details: JSON.stringify(userResponse),
            userId: userResponse.id, //needs to be existing user id in the users table
            targetId: userResponse.id,
            targetType: 'User',
            ipAddress: req.ip,
        });

        res.status(201).json(userResponse);
    } catch (error) {
        //const error2 = new Error('creating a user failed');
        error.status = 402;
        console.log(error.errors);
        return next(error);
    }
}

// logout user
// POST /api/auth/logout
export const logout = async (req, res, next) => {
    try{
        const accessToken = req.headers.authorization?.split(' ')[1];
        const refreshToken  = req.cookies?.refreshToken;

        if (accessToken) await revokeToken(accessToken, 'access');
        if (refreshToken) await revokeToken(refreshToken, 'refresh');
        res.status(200).json({ message: 'Logged out successfully' });
    }catch (error){
        error.status = 500;
        return next(error);
    }
}

// reissue refresh token
// POST /api/auth/refresh
export const refresh = async (req, res, next) => {
    try{
        //get and check if refresh token is present, if not then return with error
        const refreshToken  = req.cookies?.refreshToken || undefined;
        const { id, role } = req.body
        if (!refreshToken){
            const error = new Error('No refresh token provided');
            error.status = 400;
            return next(error);
        }
        if (!id){
            const error = new Error('No user defined');
            error.status = 400;
            return next(error);
        }
        //get token from sql database, verified if present
        const storedToken = await verifyToken(refreshToken, 'refresh');
        //check if token is existing and not expired
        if (!storedToken || storedToken.expiresAt < new Date()) {
            const error = new Error('Invalid or expired refresh token');
            error.status = 401;
            return next(error);
        }
        // Generate new access token
        const { accessToken } = await reGenerateAccessToken(id, role, 0);
        res.status(200).json({ accessToken: accessToken });
    }catch(error){
        const error2 = new Error('error inside refresh route');
        error2.status = 500;
        return next(error2);
    }

}

// validate tokens at app refresh
// POST /api/auth/isAuthenticated
export const isAuthenticated = async (req, res, next) => {

    try{
        //get and check if refresh token is present, if not then return with error
        const accessToken = req.headers.authorization?.split(' ')[1];
        const refreshToken  = req.cookies?.refreshToken;

        if (!refreshToken || !accessToken){
            const error = new Error('No token provided');
            error.status = 401;
            return next(error);
        }
        //get token from sql database, verified if present
        const storedToken = await verifyToken(accessToken, 'access');
        //check if token is existing and not expired
        if (!storedToken) {
            const error = new Error('Session Expired');
            error.status = 401;
            return next(error);
        }
        // Generate new access token
        res.status(200).json({ msg: "Session Valid." });
    }catch(error){
        const error2 = new Error('error inside isAuthenticated route');
        error2.status = 500;
        return next(error2);
    }

}



// password reset initiation
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
      const resetLink = `${domainUrl}/reset-password/${resetToken}`; //send page of password reset instead this one is direct to the api 
      await sendEmail(user.email, 'Password Reset Request', `Click this link to reset your password: ${resetLink}`);

      return res.status(200).json({ email: user.email, token: resetToken });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};

//actual password reset after token verification
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

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    // Log the action
    await logAction({
        action: 'Password Reset',
        details: JSON.stringify(userResponse),
        userId: 1, //needs to be existing user id in the users table
        targetId: user.id,
        targetType: 'User',
        ipAddress: req.ip,
    });

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}