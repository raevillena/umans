import express from 'express';
import { initDB } from './models/index.js';
import path from 'path';
import {fileURLToPath} from 'url'
import { usersRoute, appsRoute, roleRoute, authRoute, googleRoute, userTypesRoute, sessionsRoute, mqttRoute, logsRoute } from './routes/index.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/error.js';
import notFound from './middleware/notFound.js';
import cors from 'cors'
import cookieParser from 'cookie-parser'

//Get env from .env file
const port = process.env.PORT || 3000;

//Setup directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Setup express instance
const app = express();

//handle cors
app.use(cors({
    origin: 'http://localhost:5173',  // your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  }));

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

//Logger middleware using winston
app.use(logger);

//setup static and folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/api/users', usersRoute);
app.use('/api/apps', appsRoute);
app.use('/api/roles', roleRoute);
app.use('/api/auth', authRoute);
app.use('/api/auth/google', googleRoute);
app.use('/api/type', userTypesRoute);
app.use('/api/sessions', sessionsRoute);
app.use('/api/mqtt', mqttRoute);
app.use('/api/logs', logsRoute);

//error handler middleware
app.use(notFound);
app.use(errorHandler);




//Initialize database
initDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});