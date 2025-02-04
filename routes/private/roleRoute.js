import express from 'express';
const router = express.Router();
import {getRoles, addRole, updateRole, deleteRole } from '../../controllers/rolesController.js';


//GET all roles
router.get('/', getRoles);

//POST role /create role
router.post('/', addRole);

//Update user by id
router.put('/:id', updateRole);

//Delete user by id/username
router.get('/:id', deleteRole);



export default router;