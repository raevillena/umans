import express from 'express';
const router = express.Router();
import {getUserTypes, addUserType, deleteUserType, updateType } from '../../controllers/userTypeController.js';
import { authenticateAdmin } from '../../middleware/auth.js';

/**
 * @openapi
 * /api/type:
 *   get:
 *     summary: Get all user types
 *     tags: [User Type Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user types retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userType:
 *                     type: string
 *                     description: Name of the user type
 *                     example: editor
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
router.get('/', authenticateAdmin, getUserTypes);

/**
 * @openapi
 * /api/type:
 *   post:
 *     summary: Create a new user type
 *     tags: [User Type Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userType
 *             properties:
 *               userType:
 *                 type: string
 *                 description: Name of the user type
 *                 example: editor
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 description: Whether the user type is active
 *     responses:
 *       201:
 *         description: User type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userType:
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
router.post('/', authenticateAdmin, addUserType);

/**
 * @openapi
 * /api/type/{id}:
 *   put:
 *     summary: Update user type by ID
 *     tags: [User Type Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User type ID
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
 *               userType:
 *                 type: string
 *                 description: Name of the user type
 *                 example: admin
 *               isActive:
 *                 type: boolean
 *                 description: Whether the user type is active
 *                 example: true
 *     responses:
 *       200:
 *         description: User type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userType:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: User type not found
 *       401:
 *         description: Unauthorized - Admin access required
 *       400:
 *         description: Validation error
 */
router.put('/:id', authenticateAdmin, updateType);

/**
 * @openapi
 * /api/type/{id}:
 *   delete:
 *     summary: Delete user type by ID
 *     tags: [User Type Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User type ID
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
 *         description: User type deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: User type deleted permanently
 *       404:
 *         description: User type not found
 *       401:
 *         description: Unauthorized - Admin access required
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authenticateAdmin, deleteUserType);

export default router;