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
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get('/', authenticateAdmin, getUsers);

/**
 * @openapi
 * /api/users/{email}:
 *   get:
 *     summary: Get a user by Email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single user
 */
router.get('/:email', authenticateAdmin, getUserByEmail);

//Update user by id
router.put('/:id', authenticateAdmin, updateUser);

//Update user by id
router.put('/passwd-change/:id', [authenticateAdmin, validateChangePassword], changePassword);

//Delete user by id/email
router.delete('/:id', authenticateAdmin, deleteUser);


export default router;