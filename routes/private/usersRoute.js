import express from 'express';
const router = express.Router();
import { getUsers, getUserByEmail, updateUser, deleteUser, changePassword } from '../../controllers/usersController.js';
import { authenticateAdmin } from '../../middleware/auth.js';
import { validateChangePassword } from '../../middleware/validation.js';

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Limit the number of users returned
 *         example: 10
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [admin, user]
 *                   office:
 *                     type: string
 *                   mobileNo:
 *                     type: string
 *                   avatar:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Invalid limit parameter
 *       401:
 *         description: Unauthorized - Admin access required
 */
router.get('/', authenticateAdmin, getUsers);

/**
 * @openapi
 * /api/users/{email}:
 *   get:
 *     summary: Get a user by email
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: User email address
 *         example: user@example.com
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [admin, user]
 *                 office:
 *                   type: string
 *                 mobileNo:
 *                   type: string
 *                 Apps:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       Roles:
 *                         type: object
 *                         properties:
 *                           userType:
 *                             type: string
 *                 GoogleUser:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     googleId:
 *                       type: string
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized - Admin access required
 */
router.get('/:email', authenticateAdmin, getUserByEmail);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user making the request
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               office:
 *                 type: string
 *                 example: IT Department
 *               mobileNo:
 *                 type: string
 *                 example: +1234567890
 *               avatar:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                 office:
 *                   type: string
 *                 mobileNo:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized - Admin access required
 *       400:
 *         description: Validation error
 */
router.put('/:id', authenticateAdmin, updateUser);

/**
 * @openapi
 * /api/users/passwd-change/{id}:
 *   put:
 *     summary: Change user password
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user making the request
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: OldPassword123
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$'
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: ok
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid current password or validation error
 *       401:
 *         description: Unauthorized - Admin access required
 *       500:
 *         description: Internal server error
 */
router.put('/passwd-change/:id', [authenticateAdmin, validateChangePassword], changePassword);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user making the request
 *         example: 1
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: User deleted permanently
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized - Admin access required
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authenticateAdmin, deleteUser);

export default router;