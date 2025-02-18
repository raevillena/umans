import express from 'express';
const router = express.Router();
import { url , callback, logout, me, regislog } from '../../controllers/googleController.js';
import authenticateToken from '../../middleware/googleAuth.js';

//GET api url
router.get('/url', url);

//GET user info
router.get('/callback', callback);

//POST register of login the user
router.post('/regislog', regislog);

//POST logout
router.post('/logout', authenticateToken, logout);
 
export default router;