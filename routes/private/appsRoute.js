import express from 'express';
const router = express.Router();
import {getApps, createApp, updateApp, deleteApp } from '../../controllers/appsController.js';


//GET all users
router.get('/', getApps);


//POST new user /create new user
router.post('/', createApp);

//Update user by id
router.put('/:id', updateApp);

//Delete user by id/username
router.delete('/:id', deleteApp);

export default router;