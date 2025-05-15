import express from 'express';
const router = express.Router();
import {getLogs, getLogsPaginated } from '../../controllers/logsController.js';
import { authenticateAdmin } from '../../middleware/auth.js';

//GET all logs
router.get('/', authenticateAdmin, getLogs);

//GET paginated logs
router.get('/paginated/', authenticateAdmin, getLogsPaginated);

export default router;