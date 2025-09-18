import express from 'express';
const router = express.Router();
import {getMqttUsers, addMQttAccess, deleteAccess } from '../../controllers/mqttController.js';
import { authenticateAdmin } from '../../middleware/auth.js';

/**
 * @openapi
 * /api/mqtt:
 *   get:
 *     summary: Get all MQTT users
 *     tags: [MQTT Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of MQTT users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                     format: email
 *                   clientId:
 *                     type: string
 *                     description: MQTT client ID
 *                   isActive:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized - Admin access required
 *       400:
 *         description: Bad request
 */
router.get('/', authenticateAdmin, getMqttUsers);

/**
 * @openapi
 * /api/mqtt:
 *   post:
 *     summary: Add MQTT access for a user
 *     tags: [MQTT Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - clientId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *                 example: user@example.com
 *               clientId:
 *                 type: string
 *                 description: MQTT client ID
 *                 example: mqtt_client_123
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 description: Whether the MQTT access is active
 *     responses:
 *       201:
 *         description: MQTT access created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                   format: email
 *                 clientId:
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
router.post('/', authenticateAdmin, addMQttAccess);

/**
 * @openapi
 * /api/mqtt/{id}:
 *   delete:
 *     summary: Delete MQTT access by ID
 *     tags: [MQTT Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: MQTT access ID
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
 *         description: MQTT access deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: access deleted permanently
 *       404:
 *         description: MQTT access not found
 *       401:
 *         description: Unauthorized - Admin access required
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authenticateAdmin, deleteAccess);

export default router;