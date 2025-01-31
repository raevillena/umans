import express from 'express';
const router = express.Router();
import { getUsers, getUserById, createUser, updateUser } from '../controllers/usersController.js';


//GET all users
router.get('/', getUsers);

//GET user by id/username
router.get('/:username', getUserById);

//POST new user /create new user
router.post('/', createUser);

//Update user by id
router.put('/:id', updateUser);


export default router;