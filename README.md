# UMANS - User Management & Authentication System

A comprehensive Node.js-based user management and authentication system built with Express.js, Sequelize ORM, and MariaDB. This system provides robust user authentication, role-based access control, multi-application support, and comprehensive logging capabilities.

## 🚀 Features

### Core Authentication
- **JWT-based Authentication** with access and refresh tokens
- **Password Security** with bcrypt hashing and salt rounds
- **Password Reset** functionality with secure token generation
- **Google OAuth Integration** for social login
- **Session Management** with Redis for token storage
- **Multi-factor Authentication** support

### User Management
- **User Registration & Login** with email validation
- **Role-based Access Control** (Admin/User roles)
- **User Profile Management** with avatar support
- **Account Activation/Deactivation**
- **Comprehensive User Search** and filtering

### Multi-Application Support
- **Application Registration** and management
- **User-Application Role Mapping** with custom user types
- **Application-specific Authentication** scoping
- **Office-based Application Organization**

### Security & Monitoring
- **Comprehensive Action Logging** for audit trails
- **IP Address Tracking** for security monitoring
- **CORS Configuration** with environment-specific origins
- **Input Validation** with express-validator
- **Error Handling** with centralized error management

### Additional Features
- **MQTT User Management** for IoT integrations
- **Email Service** integration for notifications
- **Swagger API Documentation** with OpenAPI 3.0
- **Docker Support** for containerized deployment
- **Redis Integration** for caching and session management

## 🏗️ Architecture

### Project Structure
```
umans/
├── config/                 # Configuration files
│   ├── config.json        # Database configuration
│   ├── database.js        # Sequelize database connection
│   ├── google.js          # Google OAuth configuration
│   └── redis.js           # Redis client configuration
├── controllers/           # Business logic controllers
│   ├── authController.js  # Authentication logic
│   ├── usersController.js # User management
│   ├── googleController.js # Google OAuth
│   └── ...
├── middleware/            # Custom middleware
│   ├── auth.js           # Authentication middleware
│   ├── validation.js     # Input validation
│   └── logger.js         # Request logging
├── models/               # Database models
│   ├── userModel.js      # User schema
│   ├── appsModel.js      # Application schema
│   ├── rolesModel.js     # Role mapping schema
│   └── ...
├── routes/               # API routes
│   ├── public/           # Public routes (auth, google)
│   └── private/          # Protected routes
├── services/             # Business services
│   ├── sessionService.js # Token management
│   ├── emailService.js   # Email functionality
│   └── loggerService.js  # Action logging
└── server.js             # Application entry point
```

### Database Schema

#### Core Models
- **Users**: Primary user information with authentication data
- **Apps**: Registered applications in the system
- **Roles**: Many-to-many relationship between users and apps
- **RefreshTokens**: JWT refresh token storage
- **GoogleUsers**: Google OAuth user data
- **UserTypes**: Custom user type definitions
- **MqttUsers**: MQTT client management
- **ActionLog**: Comprehensive audit logging

#### Key Relationships
- Users ↔ Apps (Many-to-Many through Roles)
- Users ↔ GoogleUsers (One-to-One)
- Users ↔ MqttUsers (One-to-One)
- Users → ActionLog (One-to-Many)

## 🛠️ Technology Stack

### Backend
- **Node.js** (v22+) - Runtime environment
- **Express.js** (v4.21.2) - Web framework
- **Sequelize** (v7.0.0) - ORM with MariaDB dialect
- **MariaDB** - Primary database
- **Redis** (v4.7.0) - Caching and session storage

### Authentication & Security
- **bcrypt** (v5.1.1) - Password hashing
- **google-auth-library** (v9.15.1) - Google OAuth
- **express-validator** (v7.2.1) - Input validation
- **cors** (v2.8.5) - Cross-origin resource sharing

### Additional Tools
- **nodemailer** (v6.10.0) - Email service
- **swagger-jsdoc** (v6.2.8) - API documentation
- **cookie-parser** (v1.4.7) - Cookie handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v22 or higher)
- MariaDB/MySQL database
- Redis server
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd umans
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_USER=root
   DB_PASS=your_password
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=umans_db

   # Server Configuration
   PORT=3001
   API_URL=localhost
   DEBUG=true

   # CORS Configuration
   ALLOWED_ORIGINS_DEV=http://localhost:3000
   ALLOWED_ORIGINS_PROD=https://yourdomain.com

   # JWT Configuration
   JWT_SECRET=your_jwt_secret
   PASSWD_RESET_TOKEN_EXPIRY=3600000

   # Email Configuration
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   ```

4. **Database Setup**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE umans_db;
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t umans-api .
   ```

2. **Run with Docker Compose** (create docker-compose.yml)
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3001:3001"
       environment:
         - DB_HOST=mariadb
         - REDIS_HOST=redis
       depends_on:
         - mariadb
         - redis
     
     mariadb:
       image: mariadb:latest
       environment:
         MYSQL_ROOT_PASSWORD: rootpassword
         MYSQL_DATABASE: umans_db
       ports:
         - "3306:3306"
     
     redis:
       image: redis:alpine
       ports:
         - "6379:6379"
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### Public Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/superLogin` - Admin login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/isAuthenticated` - Validate session
- `POST /api/auth/request-passwd-reset` - Request password reset
- `POST /api/auth/reset-passwd` - Reset password

#### Google OAuth Routes
- `GET /api/auth/google/url` - Get Google OAuth URL
- `GET /api/auth/google/callback` - OAuth callback
- `POST /api/auth/google/regislog` - Register/Login with Google
- `POST /api/auth/google/logout` - Google logout

### Protected Routes

#### User Management (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:email` - Get user by email
- `PUT /api/users/:id` - Update user
- `PUT /api/users/passwd-change/:id` - Change password
- `DELETE /api/users/:id` - Delete user

#### Application Management
- `GET /api/apps` - Get all applications
- `POST /api/apps` - Create application
- `PUT /api/apps/:id` - Update application
- `DELETE /api/apps/:id` - Delete application

#### Role Management
- `GET /api/roles` - Get all roles
- `POST /api/roles` - Assign role to user
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Remove role

### API Documentation
Interactive API documentation is available at:
```
http://localhost:3001/api-docs
```

## 🔐 Security Features

### Authentication Flow
1. **Login**: User provides credentials → System validates → Returns JWT tokens
2. **Token Refresh**: Access token expires → Use refresh token → Get new access token
3. **Logout**: Revoke both access and refresh tokens
4. **Password Reset**: Generate secure token → Send email → Reset password

### Security Measures
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Short-lived access tokens (15 min) + long-lived refresh tokens (7 days)
- **CORS Protection**: Environment-specific origin validation
- **Input Validation**: Comprehensive request validation
- **Audit Logging**: All actions logged with IP tracking
- **Session Management**: Redis-based token storage

## 🧪 Testing

### Redis Testing
```bash
node testing/redis_test.js
```

### Manual Testing
Use the provided Swagger documentation at `/api-docs` or tools like Postman to test endpoints.

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_USER` | Database username | `root` |
| `DB_PASS` | Database password | `password` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `3306` |
| `DB_NAME` | Database name | `db_users` |
| `PORT` | Server port | `3000` |
| `API_URL` | API base URL | `localhost:3001` |
| `DEBUG` | Debug mode | `true` |
| `ALLOWED_ORIGINS_DEV` | Development CORS origins | - |
| `ALLOWED_ORIGINS_PROD` | Production CORS origins | - |
| `EMAIL_USER` | Email service username | - |
| `EMAIL_PASS` | Email service password | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | - |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [package.json](package.json) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api-docs`
- Review the logs for debugging information

## 🔄 Version History

- **v1.0.0** - Initial release with core authentication and user management features

---

**Note**: This system is designed for production use with proper security configurations. Ensure all environment variables are properly set and the database is secured before deployment.
