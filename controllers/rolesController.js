import {Roles} from '../models/index.js';
import {User, Apps, GoogleUser, UserTypes} from '../models/index.js';

// get app list
// GET /api/apps
export const getRoles = async (req, res, next) => {
    try {
        const role = await Roles.findAll({
            where:{isActive: true},
        });
        return res.json(role);
    } catch (error) {
        error.status = 400;
        return next(error);
    }
};

// create new app registry
// POST /api/roles
export const addRole = async (req, res, next) => {
    console.log(req.body)
    if(!req.body.userId){
        const error = new Error('Please select properly');
        error.status = 400;
        return next(error);
    }

    try {
        const role = await Roles.create(req.body);
        res.status(201).json(role);
    } catch (error) {
        //const error2 = new Error('creating a user failed');
        error.status = 400;
        return next(error);
    }
}

// update role by id
// PUT /api/roles/:id

export const updateRole = async (req, res, next) => {
    try{
        const role = await Roles.findByPk(req.params.id);
        if(!role){
            const error = new Error(`role with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }
        await role.update(req.body);
        res.status(200).json(role);
    }catch(error){
        error.status = 400;
        return next(error);
    }
}

// Delete app by id
// PUT /api/roles/:id
export const deleteRole = async (req, res, next) => {
    try{
        const role = await Roles.findByPk(req.params.id);
        if(!role){
            const error = new Error(`role with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }
        await role.destroy();
        res.status(200).json({msg:'role deleted permanently'});
    }catch(error){
        error.status = 400;
        return next(error);
    }

}
