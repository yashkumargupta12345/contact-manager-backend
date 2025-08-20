import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler.js';
import { ERROR_MESSAGES } from '../constants/errors.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const validateRegister = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z ]+$/)
        .withMessage('Name can only contain letters and spaces'),
    
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            throw new AppError(errorMessages.join(', '), 400, 'VALIDATION_ERROR');
        }
        next();
    }
];

export const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            throw new AppError(errorMessages.join(', '), 400, 'VALIDATION_ERROR');
        }
        next();
    }
];

export const validateUpdatePassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            throw new AppError(errorMessages.join(', '), 400, 'VALIDATION_ERROR');
        }
        
        const { currentPassword, newPassword } = req.body;
        if (currentPassword.trim() === newPassword.trim()) {
            throw new AppError(ERROR_MESSAGES.SAME_PASSWORD, 400, 'SAME_PASSWORD');
        }
        next();
    }
];

// Authentication middleware
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Access denied",
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Invalid token",
                message: "User not found"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(403).json({
            success: false,
            error: "Invalid token",
            message: "Token verification failed"
        });
    }
};