// Description: All user related routes are defined here
import {User, Apps, GoogleUser} from '../models/index.js';

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
export const getUserByUsername = async (req, res, next) => {
    try{
        const user = await User.findOne({
            where: {
                username: req.params.username,
                isActive: true,
            },
            include: [
                {
                    model: Apps
                },
                {
                    model: GoogleUser
                }
            ],
        });
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

// change password by email
// POST /api/users/:email

export const changePassword = async (req, res, next) => {

  const { email, newPassword } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password (Sequelize hook will hash it automatically)
    await user.update({ password: newPassword });

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// update user by id
// PUT /api/users/:id
export const updatePermissions = async (req, res, next) => {
    try{
        const user = await User.findByPk(req.params.id, {
            include: [
                {
                    model: Apps
                }
            ]
        });
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



// Delete user by id
// PUT /api/users/:id

export const deleteUser = async (req, res, next) => {
    try{
        const user = await User.findByPk(req.params.id);
        if(!user){
            const error = new Error(`User with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }
        await user.destroy();
        res.status(200).json({msg:'User deleted permanently'});
    }catch(error){
        error.status = 400;
        return next(error);
    }
}