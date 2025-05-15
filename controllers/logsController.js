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

//PAGINATED

// get app list
// GET /api/apps
export const getLogsPaginated = async (req, res, next) => {
    try {
        //get all if limit is not defined and show only the active ones
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        console.log(page, limit, offset)

        //get all with limits
        if(!isNaN(limit) && limit > 0) {
            const { count, rows } = await ActionLog.findAndCountAll({
                offset: offset,
                limit: limit,
                order: [['createdAt', 'DESC']],
              });
            return res.json({
                logs: rows,
                total: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });
        }

        //if limit is defined but lower that 0 then send invalid result
        res.status(400).send('Invalid limit');
    } catch (error) {
        error.status = 400;
        return next(error);
    }
};

