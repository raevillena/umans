import express from 'express';
const router = express.Router();
import {getSessions, deleteSession } from '../../controllers/sessionController.js';
import { authenticateAdmin } from '../../middleware/auth.js';

/**
 * @openapi
 * /api/sessions:
 *   get:
 *     summary: Get all active sessions (refresh tokens)
 *     tags: [Session Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   token:
 *                     type: string
 *                     description: Refresh token
 *                   userId:
 *                     type: integer
 *                   appId:
 *                     type: integer
 *                   expiresAt:
 *                     type: string
 *                     format: date-time
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
router.get('/', authenticateAdmin, getSessions);

/**
 * @openapi
 * /api/sessions/{id}:
 *   delete:
 *     summary: Delete session by ID
 *     tags: [Session Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Session ID
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
 *         description: Session deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: session deleted permanently
 *       404:
 *         description: Session not found
 *       401:
 *         description: Unauthorized - Admin access required
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authenticateAdmin, deleteSession);

export default router;