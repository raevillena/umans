import express from 'express';
const router = express.Router();
import { url , callback, logout, me } from '../../controllers/googleController.js';
import authenticateToken from '../../middleware/googleAuth.js';

//POST login
router.get('/url', url);

//POST logout
router.get('/callback', callback);

//POST logout
router.post('/logout', authenticateToken, logout);

//POST logout
router.get('/me', authenticateToken, me);

export default router;