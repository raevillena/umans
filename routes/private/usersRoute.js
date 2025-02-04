import express from 'express';
const router = express.Router();
import { getUsers, getUserByUsername, createUser, updateUser, deleteUser } from '../../controllers/usersController.js';
import  authenticateSession from '../../middleware/auth.js'


//GET all users
router.get('/', authenticateSession, getUsers);

//GET user by id/username
router.get('/:username', authenticateSession, getUserByUsername);

//POST new user /create new user
router.post('/register', createUser);

//Update user by id
router.put('/:id', authenticateSession, updateUser);

//Delete user by id/username
router.delete('/:id', authenticateSession, deleteUser);


export default router;