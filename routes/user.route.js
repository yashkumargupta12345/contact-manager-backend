import express from 'express'
import { loginUser, registerUser, logoutUser } from '../controllers/user.controller.js'

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
userRouter.post('/register', registerUser)

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
userRouter.post('/login', loginUser)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: No token provided or invalid token
 *       500:
 *         description: Server error
 */
userRouter.post('/logout', logoutUser)

export default userRouter

