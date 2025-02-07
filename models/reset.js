import sequelize from '../config/database.js';

import './userModel.js';
import './appsModel.js';
import './rolesModel.js';
import './refreshTokenModel.js';
import './googleModel.js';
import './userTypesModel.js';

const resetDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // ⚠️ Destroys and recreates tables
    console.log('✅ Database reset successful');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
};

resetDatabase();