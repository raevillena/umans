import express from 'express';
const router = express.Router();
import {getSessions, deleteSession } from '../../controllers/sessionController.js';
import { authenticateAdmin } from '../../middleware/auth.js';

//GET all refrehstokens
router.get('/', authenticateAdmin, getSessions);

//Delete app by id
router.delete('/:id', authenticateAdmin, deleteSession);

export default router;