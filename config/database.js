import {Sequelize} from '@sequelize/core';
import { MariaDbDialect } from '@sequelize/mariadb';

//Get env from .env file
//database connection settings
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASS || 'password';
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 3306;
const database = process.env.DB_NAME || 'db_users';

//instantiate sequelize
const sequelize = new Sequelize({
    dialect: MariaDbDialect,
    database: database,
    user: user,
    password: password,
    host: host,
    port: port,
    showWarnings: true,
    connectTimeout: 1000,
  });

export default sequelize;