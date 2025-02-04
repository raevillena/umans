import User from '../models/userModel.js';
import { generateTokens, revokeToken } from '../services/sessionService.js'

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if(!email){
        const error = new Error('Please provide Email');
        error.status = 400;
        return next(error);
    }
    if(!password){
        const error = new Error('Please provide Password');
        error.status = 400;
        return next(error);
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            const error = new Error('Invalid Credentials');
            error.status = 401;
            return next(error);
        }

        // Validate password
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            const error = new Error('Validation Failed //dev mode change to real one');
            error.status = 401;
            return next(error);
        }

        const { accessToken, refreshToken } = await generateTokens(user.id);
        // Remove password from response
        const userResponse = user.toJSON();
        delete userResponse.password;

        res.status(201).json({
            msg: 'Login Successfull',
            user: userResponse,
            token: {accessToken, refreshToken}
        });
    } catch (error) {
        //const error2 = new Error('creating a user failed');
        error.status = 400;
        return next(error);
    }
}

export const logout = async (req, res, next) => {
    const { access_token, refresh_token } = req.body;
    if (access_token) await revokeToken(access_token, 'access');
    if (refresh_token) await revokeToken(refresh_token, 'refresh');
    res.json({ message: 'Logged out successfully' });
}