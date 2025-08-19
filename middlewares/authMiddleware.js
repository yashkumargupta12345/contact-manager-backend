export const validateRegister = async (req, res, next) => {
    const { name, email, password } = req.body;

    // Input Validation
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            error: "All fields are required",
            message: "Please provide name, email and password"
        })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            error: "Invalid email format",
            message: "Please provide a valid email address"
        });
    }

    // Password length validation
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            error: "Password too short",
            message: "Password must be at least 6 characters long"
        });
    }

    next();
}


export const validateLogin = async (req, res, next) => {
    const { email, password } = req.body;

    // Input Validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: "All fields are required",
            message: "Please provide email and password"
        })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            error: "Invalid email format",
            message: "Please provide a valid email address"
        });
    }

    next()
}



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

        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
        
        const { default: User } = await import('./models/user.model.js');
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