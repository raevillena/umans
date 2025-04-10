import sequelize from '../config/database.js';

import User from './userModel.js';
import Apps from './appsModel.js';
import Roles from './rolesModel.js';
import RefreshToken from './refreshTokenModel.js';
import GoogleUser from './googleModel.js';
import UserTypes from './userTypesModel.js';
import Mqtt from './mqttModel.js';
import ActionLog from './logsModel.js';

Apps.belongsToMany(User, { through: Roles });
User.belongsToMany(Apps, { through: Roles});

User.hasOne(GoogleUser, {
    foreignKey: 'email',
    sourceKey: 'email'
});
GoogleUser.belongsTo(User, {
    foreignKey: 'email',
    targetKey: 'email'
});

User.hasOne(Mqtt, {
    foreignKey: 'email',
    sourceKey: 'email'
});
Mqtt.belongsTo(User, {
    foreignKey: 'email',
    targetKey: 'email'
});

ActionLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });


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
    User, Apps, Roles, RefreshToken, GoogleUser, UserTypes, Mqtt, ActionLog
}