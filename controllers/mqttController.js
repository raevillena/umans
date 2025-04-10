import {Mqtt} from '../models/index.js'
import { logAction } from '../services/loggerService.js';

// get app list
// GET /api/apps
export const getMqttUsers = async (req, res, next) => {
    try {
        //get all if limit is not defined and show only the active ones
        const sessions = await Mqtt.findAll();
        return res.json(sessions);
    } catch (error) {
        error.status = 400;
        return next(error);
    }
};


// POST /api/apps
export const addMQttAccess = async (req, res, next) => {
    //validate if there is a name 
    if(!req.body.clientId) {
        const error = new Error('Please include a clientId');
        error.status = 400;
        return next(error);
    }

    try {
        const access = await Mqtt.create(req.body);
        res.status(201).json(access);
    } catch (error) {
        //const error2 = new Error('creating a user failed');
        error.status = 400;
        return next(error);
    }
}


// Delete app by id
// PUT /api/apps/:id

export const deleteAccess = async (req, res, next) => {
    try{
        const access = await Mqtt.findByPk(req.params.id);
        const requestorID = req.headers['x-user-id'];
        if(!access){
            const error = new Error(`access with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }
        await access.destroy();

        // Log the action
        await logAction({
            action: 'Delete Mqtt Access',
            details: JSON.stringify(access),
            userId: requestorID,
            targetId: req.params.id,
            targetType: 'MQTT',
            ipAddress: req.ip,
        });

        res.status(200).json({msg: 'access deleted permanently'});
    }catch(error){
        error.status = 400;
        return next(error);
    }

}