import express from 'express'
import { loginUser, registerUser, logoutUser, updatePassword } from '../controllers/user.controller.js'
import { validateRegister, validateLogin, validateUpdatePassword } from '../middlewares/authMiddleware.js'

const userRouter = express.Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or missing fields
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
userRouter.post('/register', validateRegister, registerUser) // Add validation

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and get JWT token with redirect URL
 *     tags: [Authentication]
 *     description: Login to get JWT token and redirect URL. Copy the token from response and use it in 'Authorize' button above.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful - Copy the token from response data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Validation error or missing fields
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
userRouter.post('/login', validateLogin, loginUser) // Add validation

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Server error
 */
userRouter.post('/logout', logoutUser) // Remove security requirement

/**
 * @swagger
 * /auth/update-password:
 *   put:
 *     summary: Update user password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     description: Update the password for the authenticated user. Requires current password verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "password123"
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Validation error or same password
 *       401:
 *         description: Wrong current password or unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userRouter.put('/update-password', validateUpdatePassword, updatePassword) // Add validation

export default userRouter