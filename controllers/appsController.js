import {Apps} from '../models/index.js';


// get app list
// GET /api/apps
export const getApps = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit)
        if(isNaN(limit)) {
            const apps = await Apps.findAll({where:{isActive: true}});
            return res.json(apps);
        }
        if(!isNaN(limit) && limit > 0) {
            const apps = await Apps.findAll({where:{isActive: true}, limit: limit});
            return res.json(apps);
        }
        res.status(400).send('Invalid limit');
    } catch (error) {
        error.status = 400;
        return next(error);
    }
};

// create new app registry
// POST /api/apps
export const createApp = async (req, res, next) => {
    if(!req.body.name){
        const error = new Error('Please include a name');
        error.status = 400;
        return next(error);
    }

    try {
        const app = await Apps.create(req.body);
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
        const app = await Apps.findByPk(req.params.id);
        if(!app){
            const error = new Error(`app with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }
        await app.update(req.body);
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
        if(!app){
            const error = new Error(`app with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }
        await app.destroy();
        res.status(200).json({msg: 'App deleted permanently'});
    }catch(error){
        error.status = 400;
        return next(error);
    }

}
