import express from 'express';
const router = express.Router();
import { superLogin, login, register, logout, refresh, requestPasswdReset, resetPasswd, isAuthenticated} from '../../controllers/authController.js';
import { validateRegister, validateLogin, validateSuperLogin } from '../../middleware/validation.js';

//POST login
router.post('/login', validateLogin, login);

//POST login
router.post('/superLogin', validateSuperLogin, superLogin);

//GET isAuthenticated
router.get('/isAuthenticated',  isAuthenticated);

//POST new user /create new user
router.post('/register', validateRegister, register);

//POST logout
router.post('/logout', logout);

//POST refresh
router.post('/refresh', refresh);

//POST request password reset, send password reset link
router.post('/request-passwd-reset', requestPasswdReset);

//POST logout
router.post('/reset-passwd', resetPasswd);

export default router;