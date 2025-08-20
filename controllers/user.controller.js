import UserService from '../services/user.service.js';
import { handleServiceError } from '../utils/errorHandler.js';

export const registerUser = async (req, res, next) => {
    try {
        const userData = req.body;
        const user = await UserService.createUser(userData);
        
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });
    } catch (error) {
        next(handleServiceError(error));
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const user = await UserService.authenticateUser(email, password);
        const token = await UserService.generateToken(user);
        
        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            redirectTo: '/dashboard',
            data: {
                user: userResponse,
                token: token
            }
        });
    } catch (error) {
        next(handleServiceError(error));
    }
};

export const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            throw new Error('AUTHENTICATION_REQUIRED');
        }

        await UserService.updateUserPassword(
            userId, 
            currentPassword.trim(), 
            newPassword.trim()
        );

        res.status(200).json({
            success: true,
            message: 'Password updated successfully. Please login again with your new password.',
            redirectTo: "/login"
        });
    } catch (error) {
        next(handleServiceError(error));
    }
};

export const logoutUser = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: "User logged out successfully",
            data: {
                message: "Please remove the token from client storage"
            }
        });
    } catch (error) {
        next(error);
    }
};

