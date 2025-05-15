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
    body('office').trim().notEmpty().withMessage('Office is required'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('mobileNo').trim().notEmpty().withMessage('Mobile number is required'),
    validateRequest
];
  
// Validation rules for login
export const validateLogin = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
    body('appId').isDecimal().withMessage('Which app are you trying to login for?'),
    validateRequest
];

// Validation rules for login
export const validateSuperLogin = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest
];

export const validateChangePassword = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
    body('newPassword')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Password must have at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must have at least one lowercase letter')
        .matches(/\d/).withMessage('Password must have at least one number'),
    validateRequest
]
