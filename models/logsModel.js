import { DataTypes, Model } from '@sequelize/core';
import sequelize from '../config/database.js';


class ActionLog extends Model {}

ActionLog.init({
    action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      details: {
        type: DataTypes.TEXT,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      targetId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      targetType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
}, {
    sequelize,
    tableName: 'actionLog',
    timestamps: true,
});

export default ActionLog;
  