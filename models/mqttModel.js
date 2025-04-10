import { DataTypes, Model } from '@sequelize/core';
import sequelize from '../config/database.js';
import cryto from 'crypto';
import User from './userModel.js';

class Mqtt extends Model {}

Mqtt.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    clientId: {
        type: DataTypes.STRING,
        value: cryto.randomUUID(),
        unique: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
    tableName: 'mqttusers',
    timestamps: true,
  });

  export default Mqtt;