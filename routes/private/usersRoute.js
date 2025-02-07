import express from 'express';
const router = express.Router();
import { getUsers, getUserByUsername, updateUser, deleteUser, changePassword } from '../../controllers/usersController.js';
import { authenticateAdmin } from '../../middleware/auth.js';
import { validateChangePassword } from '../../middleware/validation.js';

//GET all users
router.get('/', authenticateAdmin, getUsers);

//GET user by id/username
router.get('/:username', authenticateAdmin, getUserByUsername);

//Update user by id
router.put('/:id', authenticateAdmin, updateUser);

//Update user by id
router.post('/passwd-change', [authenticateAdmin, validateChangePassword], changePassword);

//Delete user by id/username
router.delete('/:id', authenticateAdmin, deleteUser);


export default router;