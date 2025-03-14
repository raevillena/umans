import express from 'express';
const router = express.Router();
import {getRoles, addRole, updateRole, deleteRole } from '../../controllers/rolesController.js';
import { authenticateAdmin } from '../../middleware/auth.js';

//GET all roles
router.get('/', authenticateAdmin, getRoles);

//POST role /create role
router.post('/', authenticateAdmin, addRole);

//Update user by id
router.put('/:id', authenticateAdmin, updateRole);

//Delete user by id
router.delete('/:id', authenticateAdmin, deleteRole);



export default router;