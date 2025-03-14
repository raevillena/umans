import express from 'express';
const router = express.Router();
import {getUserTypes, addUserType, deleteUserType } from '../../controllers/userTypeController.js';
import { authenticateAdmin } from '../../middleware/auth.js';

//GET all users
router.get('/', authenticateAdmin, getUserTypes);

//POST new user /create new user
router.post('/', authenticateAdmin, addUserType);

//Delete user by id/email
router.delete('/:id', authenticateAdmin, deleteUserType);

export default router;