// Description: All user related routes are defined here
import User from '../models/user.js';

// get all users
// GET /api/users
export const getUsers = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit)
        if(isNaN(limit)) {
            const users = await User.findAll({where:{isActive: true}});
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

// get user by username
// GET /api/users/:username
export const getUserById = async (req, res, next) => {
    try{
        const user = await User.findOne({where: {username: req.params.username, isActive: true}});
        if(!user){
            const error = new Error(`User with id ${req.params.username} not found`);
            error.status = 404;
            return next(error);
        }
        res.status(200).json(user);
    }catch(error){
        error.status = 400;
        return next(error);
    }
};

// create new user
// POST /api/users
export const createUser = async (req, res, next) => {
    if(!req.body.username){
        const error = new Error('Please include a name');
        error.status = 400;
        return next(error);
    }

    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        //const error2 = new Error('creating a user failed');
        error.status = 400;
        return next(error);
    }
}
// update user by id
// PUT /api/users/:id

export const updateUser = async (req, res, next) => {
    try{
        const user = await User.findByPk(req.params.id);
        if(!user){
            const error = new Error(`User with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }
        await user.update(req.body);
        res.status(200).json(user);
    }catch(error){
        error.status = 400;
        return next(error);
    }

}
