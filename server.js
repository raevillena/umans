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
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


//Get env from .env file
const port = process.env.PORT || 3000;
const api_url = process.env.API_URL
const debug = process.env.DEBUG === 'true'
const allowedOrigins = debug
  ? process.env.ALLOWED_ORIGINS_DEV
  : process.env.ALLOWED_ORIGINS_PROD?.split(',').map(origin => origin.trim())
  
//Setup directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Setup express instance
const app = express();

//peek the allowed origins
console.log(allowedOrigins)

//handle cors
app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
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

// Swagger definition
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UMANS API',
      version: '1.0.0',
      description: 'User Management & Authentication System API - A comprehensive Node.js-based user management and authentication system with role-based access control, multi-application support, and comprehensive logging capabilities.',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login endpoint',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            firstName: {
              type: 'string',
              description: 'User first name',
            },
            lastName: {
              type: 'string',
              description: 'User last name',
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: 'User role',
            },
            office: {
              type: 'string',
              description: 'User office/department',
            },
            mobileNo: {
              type: 'string',
              description: 'User mobile number',
            },
            avatar: {
              type: 'string',
              format: 'uri',
              description: 'User avatar URL',
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the user account is active',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Application: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Application ID',
            },
            name: {
              type: 'string',
              description: 'Application name',
            },
            url: {
              type: 'string',
              format: 'uri',
              description: 'Application URL',
            },
            ownerOffice: {
              type: 'string',
              description: 'Office that owns the application',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Application contact email',
            },
            mobileNumber: {
              type: 'string',
              description: 'Application contact mobile number',
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the application is active',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Application creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Role: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Role assignment ID',
            },
            appsId: {
              type: 'integer',
              description: 'Application ID',
            },
            userId: {
              type: 'integer',
              description: 'User ID',
            },
            userType: {
              type: 'string',
              description: 'Type of user role within the application',
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the role assignment is active',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Role assignment creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
            status: {
              type: 'integer',
              description: 'HTTP status code',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: {
                    type: 'string',
                  },
                  param: {
                    type: 'string',
                  },
                  location: {
                    type: 'string',
                  },
                },
              },
              description: 'Validation errors (if applicable)',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'Google OAuth',
        description: 'Google OAuth integration endpoints',
      },
      {
        name: 'User Management',
        description: 'User CRUD operations and management',
      },
      {
        name: 'Application Management',
        description: 'Application registration and management',
      },
      {
        name: 'Role Management',
        description: 'User-application role assignments',
      },
      {
        name: 'Session Management',
        description: 'User session and token management',
      },
      {
        name: 'MQTT Management',
        description: 'MQTT user access management',
      },
      {
        name: 'Log Management',
        description: 'System action logs and audit trails',
      },
      {
        name: 'User Type Management',
        description: 'Custom user type definitions',
      },
    ],
  },
  apis: ['./routes/**/*.js'], // JSDoc annotated files
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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
    console.log(`Swagger docs at ${api_url}:${port}/api-docs`);
});