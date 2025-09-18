import express from 'express';
const router = express.Router();
import {getRoles, addRole, updateRole, deleteRole } from '../../controllers/rolesController.js';
import { authenticateAdmin } from '../../middleware/auth.js';

/**
 * @openapi
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Role Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   appsId:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   userType:
 *                     type: string
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
 */
router.get('/', authenticateAdmin, getRoles);

/**
 * @openapi
 * /api/roles:
 *   post:
 *     summary: Create a new role assignment
 *     tags: [Role Management]
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
 *               - userId
 *               - appsId
 *               - userType
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user to assign the role to
 *                 example: 1
 *               appsId:
 *                 type: integer
 *                 description: ID of the application
 *                 example: 1
 *               userType:
 *                 type: string
 *                 description: Type of user role within the application
 *                 example: editor
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 description: Whether the role assignment is active
 *     responses:
 *       201:
 *         description: Role assignment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 appsId:
 *                   type: integer
 *                 userId:
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
router.post('/', authenticateAdmin, addRole);

/**
 * @openapi
 * /api/roles/{id}:
 *   put:
 *     summary: Update role assignment by ID
 *     tags: [Role Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role assignment ID
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
 *               userId:
 *                 type: integer
 *                 description: ID of the user
 *                 example: 1
 *               appsId:
 *                 type: integer
 *                 description: ID of the application
 *                 example: 1
 *               userType:
 *                 type: string
 *                 description: Type of user role within the application
 *                 example: admin
 *               isActive:
 *                 type: boolean
 *                 description: Whether the role assignment is active
 *                 example: true
 *     responses:
 *       200:
 *         description: Role assignment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 appsId:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 userType:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Role assignment not found
 *       401:
 *         description: Unauthorized - Admin access required
 *       400:
 *         description: Validation error
 */
router.put('/:id', authenticateAdmin, updateRole);

/**
 * @openapi
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete role assignment by ID
 *     tags: [Role Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role assignment ID
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
 *         description: Role assignment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: role deleted permanently
 *       404:
 *         description: Role assignment not found
 *       401:
 *         description: Unauthorized - Admin access required
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authenticateAdmin, deleteRole);

export default router;