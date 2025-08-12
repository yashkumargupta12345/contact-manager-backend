import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: "User already exists",
                message: "A user with this email already exists"
            });
        }

        const user = new User({
            name,
            email,
            password
        })

        const savedUser = await user.save()

        // Remove password from response
        const userResponse = savedUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: userResponse
        });

    } catch (error) {
        console.error("Error registering user:", error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: "Validation failed",
                message: error.message
            });
        }

        // Handle duplicate key error (if email has unique constraint)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                error: "User already exists",
                message: "A user with this email already exists"
            });
        }

        res.status(500).json({
            success: false,
            error: "Failed to register user",
            message: "Internal server error"
        });
    }
}



const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Invalid credentials",
                message: "Invalid email or password"
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: "Invalid credentials",
                message: "Invalid email or password"
            });
        }

        const payload = { id: user._id, email: user.email, name: user.name }

        // Generate JWT token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })

        // Remove password from user object
        const userResponse = user.toObject();
        delete userResponse.password;

        // 4️⃣ Send token to client
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                token: token
            }
        });

    } catch (error) {
        console.error("Error logging in user:", error); // Fix: use 'error' instead of 'err'

        res.status(500).json({
            success: false,
            error: "Failed to login",
            message: "Internal server error"
        });
    }
}



export const logoutUser = async(req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User logged out successfully",
            data: {
                message: "Please remove the token from client storage"
            }
        });
    } catch (error) {
        console.error("Error logging out user:", error);
        
        res.status(500).json({
            success: false,
            error: "Failed to logout",
            message: "Internal server error"
        });
    }
}