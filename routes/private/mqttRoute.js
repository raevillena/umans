import express from 'express';
const router = express.Router();
import {getMqttUsers, addMQttAccess, deleteAccess } from '../../controllers/mqttController.js';
import { authenticateAdmin } from '../../middleware/auth.js';

//GET all refrehstokens
router.get('/', authenticateAdmin, getMqttUsers);

//Delete app by id
router.post('/', authenticateAdmin, addMQttAccess);

//Delete app by id
router.delete('/:id', authenticateAdmin, deleteAccess);

export default router;