import express from 'express';
const router = express.Router();
import { login , logout } from '../controllers/authController.js';

//POST login
router.post('/login', login);

//POST logout
router.post('/logout', logout);


export default router;