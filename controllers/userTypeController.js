import {UserTypes} from '../models/index.js';
import { logAction } from '../services/loggerService.js';

// get user types list
// GET /api/UserTypes
export const getUserTypes = async (req, res, next) => {
    try {
        //get all user types
        const type = await UserTypes.findAll({where:{isActive: true}});
        return res.json(type);
    } catch (error) {
        error.status = 400;
        return next(error);
    }
};

// create new app registry
// POST /api/apps
export const addUserType = async (req, res, next) => {
    //validate if there is a name 
    if(!req.body.userType){
        const error = new Error('Please include the user type');
        error.status = 400;
        return next(error);
    }

    try {
        const type = await UserTypes.create(req.body);
        res.status(201).json(type);
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// update app by id
// PUT /api/apps/:id

export const updateType = async (req, res, next) => {
    try{
        const requestorID = req.headers['x-user-id'];
        const type = await UserTypes.findByPk(req.params.id);
        if(!type){
            const error = new Error(`Type with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }
        await type.update(req.body);

        // Log the action
        await logAction({
            action: 'Update User Type',
            details: JSON.stringify(type),
            userId: requestorID,
            targetId: req.params.id,
            targetType: 'User Type',
            ipAddress: req.ip,
        });

        // Send the response
        res.status(200).json(type);
    }catch(error){
        error.status = 400;
        return next(error);
    }

}


// Delete app by id
// PUT /api/apps/:id

export const deleteUserType = async (req, res, next) => {
    try{
        const type = await UserTypes.findByPk(req.params.id);
        const requestorID = req.headers['x-user-id'];
        if(!type){
            const error = new Error(`User type with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }
        await type.destroy();

        // Log the action
        await logAction({
            action: 'Delete User Type',
            details: JSON.stringify(type),
            userId: requestorID,
            targetId: req.params.id,
            targetType: 'User Type',
            ipAddress: req.ip,
        });

        res.status(200).json({msg: 'User type deleted permanently'});
    }catch(error){
        error.status = 400;
        return next(error);
    }

}
