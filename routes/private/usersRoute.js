import express from 'express';
const router = express.Router();
import { getUsers, getUserByUsername, createUser, updateUser, deleteUser } from '../../controllers/usersController.js';


//GET all users
router.get('/', getUsers);

//GET user by id/username
router.get('/:username', getUserByUsername);

//POST new user /create new user
router.post('/register', createUser);

//Update user by id
router.put('/:id', updateUser);

//Delete user by id/username
router.get('/:id', deleteUser);


export default router;