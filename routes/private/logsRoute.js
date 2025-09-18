import express from 'express';
const router = express.Router();
import {getLogs, getLogsPaginated } from '../../controllers/logsController.js';
import { authenticateAdmin } from '../../middleware/auth.js';

/**
 * @openapi
 * /api/logs:
 *   get:
 *     summary: Get all action logs
 *     tags: [Log Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Limit the number of logs returned
 *         example: 50
 *     responses:
 *       200:
 *         description: List of logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   action:
 *                     type: string
 *                     description: Action performed
 *                     example: Create User
 *                   details:
 *                     type: string
 *                     description: Additional details about the action
 *                     example: {"email": "user@example.com", "role": "user"}
 *                   userId:
 *                     type: integer
 *                     description: ID of the user who performed the action
 *                   targetId:
 *                     type: integer
 *                     description: ID of the target object
 *                   targetType:
 *                     type: string
 *                     description: Type of the target object
 *                     example: User
 *                   ipAddress:
 *                     type: string
 *                     description: IP address of the request
 *                     example: 192.168.1.1
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
router.get('/', authenticateAdmin, getLogs);

/**
 * @openapi
 * /api/logs/paginated:
 *   get:
 *     summary: Get paginated action logs
 *     tags: [Log Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of logs per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Paginated logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       action:
 *                         type: string
 *                         description: Action performed
 *                         example: Create User
 *                       details:
 *                         type: string
 *                         description: Additional details about the action
 *                         example: {"email": "user@example.com", "role": "user"}
 *                       userId:
 *                         type: integer
 *                         description: ID of the user who performed the action
 *                       targetId:
 *                         type: integer
 *                         description: ID of the target object
 *                       targetType:
 *                         type: string
 *                         description: Type of the target object
 *                         example: User
 *                       ipAddress:
 *                         type: string
 *                         description: IP address of the request
 *                         example: 192.168.1.1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                   description: Total number of logs
 *                   example: 150
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                   example: 15
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                   example: 1
 *       400:
 *         description: Invalid pagination parameters
 *       401:
 *         description: Unauthorized - Admin access required
 */
router.get('/paginated/', authenticateAdmin, getLogsPaginated);

export default router;