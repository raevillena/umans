import express from 'express';
const router = express.Router();
import {getApps, createApp, updateApp, deleteApp, getAppById } from '../../controllers/appsController.js';
import { authenticateAdmin } from '../../middleware/auth.js';

/**
 * @openapi
 * /api/apps:
 *   get:
 *     summary: Get all applications
 *     tags: [Application Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Limit the number of applications returned
 *         example: 10
 *     responses:
 *       200:
 *         description: List of applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   url:
 *                     type: string
 *                   ownerOffice:
 *                     type: string
 *                   email:
 *                     type: string
 *                   mobileNumber:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Invalid limit parameter
 *       401:
 *         description: Unauthorized - Admin access required
 */
router.get('/', authenticateAdmin, getApps);

/**
 * @openapi
 * /api/apps/{id}:
 *   get:
 *     summary: Get application by ID
 *     tags: [Application Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Application retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 ownerOffice:
 *                   type: string
 *                 email:
 *                   type: string
 *                 mobileNumber:
 *                   type: string
 *                 Users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       office:
 *                         type: string
 *                       mobileNo:
 *                         type: string
 *                       Roles:
 *                         type: object
 *                         properties:
 *                           userType:
 *                             type: string
 *                       GoogleUser:
 *                         type: object
 *                         properties:
 *                           googleId:
 *                             type: string
 *       404:
 *         description: Application not found
 *       401:
 *         description: Unauthorized - Admin access required
 */
router.get('/:id', authenticateAdmin, getAppById);

/**
 * @openapi
 * /api/apps:
 *   post:
 *     summary: Create a new application
 *     tags: [Application Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user making the request
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - url
 *               - ownerOffice
 *               - email
 *               - mobileNumber
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Application
 *               url:
 *                 type: string
 *                 example: https://myapp.example.com
 *               ownerOffice:
 *                 type: string
 *                 example: IT Department
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               mobileNumber:
 *                 type: string
 *                 example: +1234567890
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 url:
 *                   type: string
 *                 ownerOffice:
 *                   type: string
 *                 email:
 *                   type: string
 *                 mobileNumber:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error or missing required fields
 *       401:
 *         description: Unauthorized - Admin access required
 */
router.post('/', authenticateAdmin, createApp);

/**
 * @openapi
 * /api/apps/{id}:
 *   put:
 *     summary: Update application by ID
 *     tags: [Application Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
 *         example: 1
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user making the request
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Application Name
 *               url:
 *                 type: string
 *                 example: https://updated-app.example.com
 *               ownerOffice:
 *                 type: string
 *                 example: Updated Department
 *               email:
 *                 type: string
 *                 format: email
 *                 example: updated@example.com
 *               mobileNumber:
 *                 type: string
 *                 example: +9876543210
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Application updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 url:
 *                   type: string
 *                 ownerOffice:
 *                   type: string
 *                 email:
 *                   type: string
 *                 mobileNumber:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Application not found
 *       401:
 *         description: Unauthorized - Admin access required
 *       400:
 *         description: Validation error
 */
router.put('/:id', authenticateAdmin, updateApp);

/**
 * @openapi
 * /api/apps/{id}:
 *   delete:
 *     summary: Delete application by ID
 *     tags: [Application Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
 *         example: 1
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user making the request
 *         example: 1
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: App deleted permanently
 *       404:
 *         description: Application not found
 *       401:
 *         description: Unauthorized - Admin access required
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authenticateAdmin, deleteApp);

export default router;