import sequelize from '../config/database.js';

import User from './userModel.js';
import Apps from './appsModel.js';
import Roles from './rolesModel.js';
import RefreshToken from './refreshTokenModel.js';
 
Apps.belongsToMany(User, {
    through: Roles,
    name: 'permissions'
})


export const initDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export {
    User, Apps, Roles, RefreshToken
}