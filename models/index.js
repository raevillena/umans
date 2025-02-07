import sequelize from '../config/database.js';

import User from './userModel.js';
import Apps from './appsModel.js';
import Roles from './rolesModel.js';
import RefreshToken from './refreshTokenModel.js';
import GoogleUser from './googleModel.js';
import UserTypes from './userTypesModel.js';



//working with user query
/*
Apps.belongsToMany(User, { through: Roles, foreignKey: 'appsId', as: 'users' });
Roles.belongsTo(Apps, { foreignKey: 'appsId', as: 'roles' });
Roles.belongsTo(UserTypes, { foreignKey: 'userTypeId' })
*/

//Apps.belongsToMany(User, { through: Roles, name:'permissions' });

//Roles.belongsTo(User, { foreignKey: 'usersId', as: 'user' });
//Roles.belongsTo(UserTypes, {
//    foreignKey: 'userTypeId'
//})


//Apps.belongsToMany(User, { as: 'userId', through: Roles, inverse: { as: 'appId' } });
Apps.belongsToMany(User, { through: Roles });
User.belongsToMany(Apps, { through: Roles});
//Roles.belongsTo(User, { foreignKey: 'userId', as: 'user' });




User.hasOne(GoogleUser, {
    foreignKey: 'email',
    sourceKey: 'email'
});
GoogleUser.belongsTo(User, {
    foreignKey: 'email',
    targetKey: 'email'
});

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
    User, Apps, Roles, RefreshToken, GoogleUser, UserTypes
}