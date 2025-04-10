import express from 'express';
const router = express.Router();
import {getLogs } from '../../controllers/logsController.js';
import { authenticateAdmin } from '../../middleware/auth.js';

//GET all apps
router.get('/', authenticateAdmin, getLogs);

export default router;