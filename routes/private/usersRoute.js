import express from 'express';
const router = express.Router();
import { getUsers, getUserByUsername, updateUser, deleteUser, changePassword } from '../../controllers/usersController.js';
import  authenticateSession from '../../middleware/auth.js';
import { validateChangePassword } from '../../middleware/validation.js';

//GET all users
router.get('/', authenticateSession, getUsers);

//GET user by id/username
router.get('/:username', getUserByUsername);

//Update user by id
router.put('/:id', authenticateSession, updateUser);

//Update user by id
router.post('/passwd-change', validateChangePassword, changePassword);

//Delete user by id/username
router.delete('/:id', authenticateSession, deleteUser);


export default router;