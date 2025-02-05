import express from 'express';
const router = express.Router();
import {getUserTypes, addUserType, deleteUserType } from '../../controllers/userTypeController.js';


//GET all users
router.get('/', getUserTypes);

//POST new user /create new user
router.post('/', addUserType);

//Delete user by id/username
router.delete('/:id', deleteUserType);

export default router;