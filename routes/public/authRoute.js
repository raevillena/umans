import express from 'express';
const router = express.Router();
import { login, register, logout, refresh, requestPasswdReset, resetPasswd} from '../../controllers/authController.js';
import { validateRegister, validateLogin, validateRefreshToken } from '../../middleware/validation.js';

//POST login
router.post('/login', validateLogin, login);

//POST new user /create new user
router.post('/register', validateRegister, register);

//POST logout
router.post('/logout', logout);

//POST refresh
router.post('/refresh', validateRefreshToken, refresh);

//POST request password reset, send password reset link
router.post('/request-passwd-reset', requestPasswdReset);

//POST logout
router.post('/reset-passwd', resetPasswd);

export default router;