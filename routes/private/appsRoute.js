import express from 'express';
const router = express.Router();
import {getApps, createApp, updateApp, deleteApp, getAppById } from '../../controllers/appsController.js';
import { authenticateAdmin } from '../../middleware/auth.js';

//GET all users
router.get('/', authenticateAdmin, getApps);

//GET user by id/username
router.get('/:id', authenticateAdmin, getAppById);

//POST new user /create new user
router.post('/', authenticateAdmin, createApp);

//Update user by id
router.put('/:id', authenticateAdmin, updateApp);

//Delete user by id/username
router.delete('/:id', authenticateAdmin, deleteApp);

export default router;