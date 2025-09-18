import express from 'express';
const router = express.Router();
import { superLogin, login, register, logout, refresh, requestPasswdReset, resetPasswd, isAuthenticated} from '../../controllers/authController.js';
import { validateRegister, validateLogin, validateSuperLogin } from '../../middleware/validation.js';

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: User login with application context
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - appId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               appId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Login Successfull
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [admin, user]
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     mobileNo:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     Apps:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           Roles:
 *                             type: object
 *                             properties:
 *                               userType:
 *                                 type: string
 *                 token:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Validation error
 */
router.post('/login', validateLogin, login);

/**
 * @openapi
 * /api/auth/superLogin:
 *   post:
 *     summary: Admin super login (bypasses app restrictions)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: AdminPassword123
 *     responses:
 *       200:
 *         description: Super login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Login Successfull
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [admin]
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     mobileNo:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                 token:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Invalid credentials or insufficient permissions
 *       400:
 *         description: Validation error
 */
router.post('/superLogin', validateSuperLogin, superLogin);

/**
 * @openapi
 * /api/auth/isAuthenticated:
 *   get:
 *     summary: Validate current session
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Session is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Session Valid.
 *       401:
 *         description: Invalid or expired session
 */
router.get('/isAuthenticated',  isAuthenticated);

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - mobileNo
 *               - office
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$'
 *                 example: Password123
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               mobileNo:
 *                 type: string
 *                 example: +1234567890
 *               office:
 *                 type: string
 *                 example: IT Department
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 default: user
 *               avatar:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 role:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error or user already exists
 *       402:
 *         description: User creation failed
 */
router.post('/register', validateRegister, register);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and revoke tokens
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       500:
 *         description: Internal server error
 */
router.post('/logout', logout);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: new_access_token_here
 *       400:
 *         description: No refresh token provided or invalid user
 *       401:
 *         description: Invalid or expired refresh token
 *       500:
 *         description: Internal server error
 */
router.post('/refresh', refresh);

/**
 * @openapi
 * /api/auth/request-passwd-reset:
 *   post:
 *     summary: Request password reset email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 token:
 *                   type: string
 *                   example: reset_token_here
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/request-passwd-reset', requestPasswdReset);

/**
 * @openapi
 * /api/auth/reset-passwd:
 *   post:
 *     summary: Reset password using reset token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: reset_token_from_email
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$'
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal server error
 */
router.post('/reset-passwd', resetPasswd);

export default router;