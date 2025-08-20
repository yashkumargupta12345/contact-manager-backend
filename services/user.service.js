import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants/auth.js';

class UserService {
    async createUser(userData) {
        const { name, email, password } = userData;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('USER_ALREADY_EXISTS');
        }

        const user = new User({ name, email, password });
        const savedUser = await user.save();
        
        // Remove password from response
        const userResponse = savedUser.toObject();
        delete userResponse.password;
        
        return userResponse;
    }

    async authenticateUser(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('INVALID_CREDENTIALS');
        }

        return user;
    }

    async generateToken(user) {
        const payload = { 
            id: user._id, 
            email: user.email, 
            name: user.name 
        };
        
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    }

    async updateUserPassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }

        const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordCorrect) {
            throw new Error('WRONG_CURRENT_PASSWORD');
        }

        const isSamePassword = await user.comparePassword(newPassword);
        if (isSamePassword) {
            throw new Error('SAME_PASSWORD');
        }

        user.password = newPassword;
        await user.save();
        
        return user;
    }
}

export default new UserService();