// Description: All user related routes are defined here
import {User, Apps, GoogleUser, Roles, UserTypes} from '../models/index.js';
import { logAction } from '../services/loggerService.js';


// get all users
// GET /api/users
export const getUsers = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit)
        if(isNaN(limit)) {
            const users = await User.findAll();
            return res.send(users);
        }
        if(!isNaN(limit) && limit > 0) {
            const users = await User.findAll({where:{isActive: true}, limit: limit});
            return res.send(users);
        }
        res.status(400).send('Invalid limit');
    } catch (error) {
        error.status = 400;
        return next(error);
    }
};

// get user by email
// GET /api/users/:email
export const getUserByEmail = async (req, res, next) => {
    try{
        const user = await User.findOne({
            where: {
                email: req.params.email,
                isActive: true,
            },
            attributes: ['id', 'email', 'role', 'office','mobileNo'],
            include: [
                {
                    model: Apps,
                    attributes: ['name'],
                    through:{
                        model:Roles,
                        attributes: ['userType']
                    }
                },
                {
                    model: GoogleUser,
                    attributes: ['email', 'googleId']
                },
            ],
        });
        if(!user){
            const error = new Error(`User with id ${req.params.email} not found`);
            error.status = 404;
            return next(error);
        }
        res.status(200).json(user);
    }catch(error){
        error.status = 400;
        return next(error);
    }
};


// update user by id
// PUT /api/users/:id

export const updateUser = async (req, res, next) => {
    try{
        
        const requestorID = req.headers['x-user-id'];
        const user = await User.findByPk(req.params.id);
        if(!user){
            const error = new Error(`User with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }
        await user.update(req.body);

        // Log the action
        await logAction({
            action: 'Update User',
            details: JSON.stringify(req.body),
            userId: requestorID,
            targetId: req.params.id,
            targetType: 'User',
            ipAddress: req.ip,
        });

        res.status(200).json(user);
    }catch(error){
        error.status = 400;
        return next(error);
    }
}

// change password by email
// POST /api/users/:email

export const changePassword = async (req, res, next) => {

    const { email, password, newPassword } = req.body;
    const requestorID = req.headers['x-user-id'];
    try {
        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        // Validate password, check password if matched when unhashed
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            const error = new Error('Wrong password //change this later');
            error.status = 400;
            return next(error);
        }

        // Update password (Sequelize hook will hash it automatically)
        await user.update({ password: newPassword });

        // Log the action
        await logAction({
            action: 'Change Password',
            details: JSON.stringify(email),
            userId: requestorID,
            targetId: req.params.id,
            targetType: 'User',
            ipAddress: req.ip,
        });

        return res.status(200).json({success:"ok"});
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}



// Delete user by id
// PUT /api/users/:id

export const deleteUser = async (req, res, next) => {
    try{
        const requestorID = req.headers['x-user-id'];
        const user = await User.findByPk(req.params.id);
        if(!user){
            const error = new Error(`User with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }
        await user.destroy();

        // Log the action
        await logAction({
            action: 'Delete User',
            details: JSON.stringify(user),
            userId: requestorID,
            targetId: req.params.id,
            targetType: 'User',
            ipAddress: req.ip,
          });

        res.status(200).json({msg:'User deleted permanently'});
    }catch(error){
        error.status = 400;
        return next(error);
    }
}