import { DataTypes, Model } from '@sequelize/core';
import sequelize from '../config/database.js';

import User from './userModel.js';

class GoogleUser extends Model {}

GoogleUser.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
        references: {
            model: User,
            key: 'email',
          },
    },
    googleId: {
        type: DataTypes.STRING,
        unique: true
    },
    profilePic: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
    tableName: 'googleusers',
    timestamps: true,
  });

  export default GoogleUser;