import express from 'express';
import { initDB } from './models/index.js';
import path from 'path';
import {fileURLToPath} from 'url'
import users from './routes/users.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/error.js';
import notFound from './middleware/notFound.js';


//Initialize database
initDB();

//Get env from .env file
const port = process.env.PORT || 3000;

//Setup directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Setup express instance
const app = express();

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Logger middleware using winston
app.use(logger);

//setup static and folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/api/users', users);

//error handler middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});