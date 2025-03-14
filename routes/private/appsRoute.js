import express from 'express';
const router = express.Router();
import {getApps, createApp, updateApp, deleteApp, getAppById } from '../../controllers/appsController.js';
import { authenticateAdmin } from '../../middleware/auth.js';

//GET all apps
router.get('/', authenticateAdmin, getApps);

//GET app by id/appname
router.get('/:id', authenticateAdmin, getAppById);

//POST new app /create new app
router.post('/', authenticateAdmin, createApp);

//Update app by id
router.put('/:id', authenticateAdmin, updateApp);

//Delete app by id
router.delete('/:id', authenticateAdmin, deleteApp);

export default router;