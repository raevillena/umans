import express from 'express';
const router = express.Router();
import { url , callback, logout, me, regislog } from '../../controllers/googleController.js';
import authenticateToken from '../../middleware/googleAuth.js';

/**
 * @openapi
 * /api/auth/google/url:
 *   get:
 *     summary: Get Google OAuth authorization URL
 *     tags: [Google OAuth]
 *     responses:
 *       200:
 *         description: Google OAuth URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   format: uri
 *                   example: https://accounts.google.com/oauth/authorize?client_id=...
 *       500:
 *         description: Internal server error
 */
router.get('/url', url);

/**
 * @openapi
 * /api/auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth callback
 *     tags: [Google OAuth]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *         example: 4/0AX4XfWh...
 *     responses:
 *       200:
 *         description: OAuth callback processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userInfo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 123456789
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: user@gmail.com
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     picture:
 *                       type: string
 *                       format: uri
 *                       example: https://lh3.googleusercontent.com/...
 *                     verified_email:
 *                       type: boolean
 *                       example: true
 *       500:
 *         description: Internal server error
 */
router.get('/callback', callback);

/**
 * @openapi
 * /api/auth/google/regislog:
 *   post:
 *     summary: Register or login user with Google OAuth
 *     tags: [Google OAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userInfo
 *             properties:
 *               userInfo:
 *                 type: object
 *                 required:
 *                   - id
 *                   - email
 *                   - name
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Google user ID
 *                     example: 123456789
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: Google user email
 *                     example: user@gmail.com
 *                   name:
 *                     type: string
 *                     description: Google user display name
 *                     example: John Doe
 *                   picture:
 *                     type: string
 *                     format: uri
 *                     description: Google user profile picture URL
 *                     example: https://lh3.googleusercontent.com/...
 *     responses:
 *       200:
 *         description: User registered/logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Session token for the user
 *                   example: session_token_here
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Internal user ID
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: user@gmail.com
 *                     picture:
 *                       type: string
 *                       format: uri
 *                       example: https://lh3.googleusercontent.com/...
 *       500:
 *         description: Internal server error
 */
router.post('/regislog', regislog);

/**
 * @openapi
 * /api/auth/google/logout:
 *   post:
 *     summary: Logout Google OAuth user
 *     tags: [Google OAuth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
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
router.post('/logout', authenticateToken, logout);

export default router;