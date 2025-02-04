import { Sequelize, DataTypes, Model } from '@sequelize/core';
import sequelize from '../config/database.js';

import User from './userModel.js';
import Apps from './appsModel.js';

class Roles extends Model {}

Roles.init({
    appsId: {
        type: DataTypes.INTEGER,
        references: {
          model: Apps,
          key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: 'id',
        },
      },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
}, {
    sequelize,
    tableName: 'roles',
    timestamps: true,
});

export default Roles;
  