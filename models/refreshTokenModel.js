import { DataTypes, Model } from '@sequelize/core';
import sequelize from '../config/database.js';
import User from './userModel.js';


class RefreshToken extends Model {}

RefreshToken.init({
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: 'id' }
    },
    appId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false, 
  },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
}, {
    sequelize,
    tableName: 'refreshToken',
    timestamps: true,
});

export default RefreshToken;
  