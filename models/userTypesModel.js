import { DataTypes, Model } from '@sequelize/core';
import sequelize from '../config/database.js';

class userTypes extends Model {}

userTypes.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userType: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
}, {
    sequelize,
    tableName: 'usertypes',
    timestamps: true,
});

export default userTypes;
  