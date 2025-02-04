import express from 'express';
const router = express.Router();
import { login , logout, refresh } from '../../controllers/authController.js';

//POST login
router.post('/login', login);

//POST logout
router.post('/logout', logout);

//POST refresh
router.post('/refresh', refresh);


export default router;