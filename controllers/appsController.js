import {Apps, User, Roles, GoogleUser} from '../models/index.js';
import { logAction } from '../services/loggerService.js';

// get app list
// GET /api/apps
export const getApps = async (req, res, next) => {
    try {
        //get all if limit is not defined and show only the active ones
        const limit = parseInt(req.query.limit)
        if(isNaN(limit)) {
            const apps = await Apps.findAll({where:{isActive: true}});
            return res.json(apps);
        }

        //get all with limits
        if(!isNaN(limit) && limit > 0) {
            const apps = await Apps.findAll({where:{isActive: true}, limit: limit});
            return res.json(apps);
        }

        //if limit is defined but lower that 0 then send invalid result
        res.status(400).send('Invalid limit');
    } catch (error) {
        error.status = 400;
        return next(error);
    }
};

// get app by id
// GET /api/apps
export const getAppById = async (req, res, next) => {
    try{
        const app = await Apps.findOne({
            where: {
                id: req.params.id,
                isActive: true,
            },
            attributes: ['id', 'name', 'ownerOffice', 'email', 'mobileNumber'],
            include: [
                {
                    model: User,
                    attributes: ['email', 'role', 'office','mobileNo'],
                    through:{
                        model:Roles,
                        attributes: ['userType']
                    },
                    include:[
                        {
                            model: GoogleUser,
                            attributes: ['googleId']
                        },
                    ],
                },
            ],
        });
        if(!app){
            const error = new Error(`App with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }
        res.status(200).json(app);
    }catch(error){
        error.status = 400;
        return next(error);
    }
};

// create new app registry
// POST /api/apps
export const createApp = async (req, res, next) => {
    //validate if there is a name 
    if(!req.body.name){
        const error = new Error('Please include a name');
        error.status = 400;
        return next(error);
    }

    try {
        const requestorID = req.headers['x-user-id'];
        const app = await Apps.create(req.body);

        // Log the action
        await logAction({
            action: 'Create App',
            details: JSON.stringify(app),
            userId: requestorID, //needs to be existing user id in the users table
            targetId: app.id,
            targetType: 'App',
            ipAddress: req.ip,
        });
        
        res.status(201).json(app);
    } catch (error) {
        //const error2 = new Error('creating a user failed');
        error.status = 400;
        return next(error);
    }
}

// update app by id
// PUT /api/apps/:id

export const updateApp = async (req, res, next) => {
    try{
        const requestorID = req.headers['x-user-id'];
        const app = await Apps.findByPk(req.params.id);
        if(!app){
            const error = new Error(`app with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }
        await app.update(req.body);

        // Log the action
        await logAction({
            action: 'Update App',
            details: JSON.stringify(req.body),
            userId: requestorID,
            targetId: req.params.id,
            targetType: 'App',
            ipAddress: req.ip,
        });

        // Send the response
        res.status(200).json(app);
    }catch(error){
        error.status = 400;
        return next(error);
    }

}

// Delete app by id
// PUT /api/apps/:id

export const deleteApp = async (req, res, next) => {
    try{
        const app = await Apps.findByPk(req.params.id);
        const requestorID = req.headers['x-user-id'];
        if(!app){
            const error = new Error(`app with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }
        await app.destroy();
        // Log the action
        await logAction({
            action: 'Delete App',
            details: JSON.stringify(app),
            userId: requestorID,
            targetId: req.params.id,
            targetType: 'App',
            ipAddress: req.ip,
        });
        res.status(200).json({msg: 'App deleted permanently'});
    }catch(error){
        error.status = 400;
        return next(error);
    }

}
