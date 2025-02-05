import { body, validationResult } from 'express-validator';

// Middleware to handle validation errors
export function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
}


// Validation rules for registration
export const validateRegister = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Password must have at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must have at least one lowercase letter')
        .matches(/\d/).withMessage('Password must have at least one number'),
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('firstName').trim().notEmpty().withMessage('Firstname is required'),
    body('lastName').trim().notEmpty().withMessage('Lastname is required'),
    validateRequest
];
  
// Validation rules for login
export const validateLogin = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest
];
  
// Validation rules for refresh token
export const validateRefreshToken = [
    body('refresh_token').notEmpty().withMessage('Refresh token is required'),
    validateRequest
];

export const validateChangePassword = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('newPassword')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Password must have at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must have at least one lowercase letter')
        .matches(/\d/).withMessage('Password must have at least one number'),
    validateRequest
]
