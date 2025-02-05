import {userTypes} from '../models/index.js';


// get user types list
// GET /api/userTypes
export const getUserTypes = async (req, res, next) => {
    try {
        //get all user types
        const type = await userTypes.findAll({where:{isActive: true}});
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
    if(!req.body.type){
        const error = new Error('Please include the user type');
        error.status = 400;
        return next(error);
    }

    try {
        const type = await userTypes.create(req.body);
        res.status(201).json(type);
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// Delete app by id
// PUT /api/apps/:id

export const deleteUserType = async (req, res, next) => {
    try{
        const type = await userTypes.findByPk(req.params.id);
        if(!type){
            const error = new Error(`User type with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }
        await type.destroy();
        res.status(200).json({msg: 'User type deleted permanently'});
    }catch(error){
        error.status = 400;
        return next(error);
    }

}
