import {ActionLog} from '../models/index.js';

// get app list
// GET /api/apps
export const getLogs = async (req, res, next) => {
    try {
        //get all if limit is not defined and show only the active ones
        const limit = parseInt(req.query.limit)
        if(isNaN(limit)) {
            const logs = await ActionLog.findAll({
                order: [['createdAt', 'DESC']],
            });
            return res.json(logs);
        }

        //get all with limits
        if(!isNaN(limit) && limit > 0) {
            const logs = await ActionLog.findAll({
                order: [['createdAt', 'DESC']],
                limit: limit
            });
            return res.json(logs);
        }

        //if limit is defined but lower that 0 then send invalid result
        res.status(400).send('Invalid limit');
    } catch (error) {
        error.status = 400;
        return next(error);
    }
};

