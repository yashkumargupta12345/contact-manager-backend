import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import router from './routes/contact.route.js'
import favoriteRouter from './routes/favorite.route.js'
import userRouter from './routes/user.route.js'
import tagRouter from './routes/tag.route.js'
import connectToDB from './configs/db.js'
import { specs, swaggerUi, swaggerOptions } from './configs/swagger.js'

const app = express()

// Add JSON middleware
app.use(express.json())
app.use(cors())
// Swagger documentation with custom options
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions))

await connectToDB()
const PORT = process.env.PORT || 4000

// Authentication middleware
const authenticateToken = async (req, res, next) => {
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

// Auth routes (no authentication required)
app.use('/auth', userRouter)

// Protected routes (authentication required)
app.use('/user', authenticateToken, router)
app.use('/user', authenticateToken, favoriteRouter)
app.use('/user', authenticateToken, tagRouter)

// Add a welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Contact Manager API',
        documentation: `http://localhost:${PORT}/api-docs`,
        authenticationRequired: 'Most endpoints require JWT token authentication',
        howToAuthenticate: {
            step1: 'Register at POST /auth/register',
            step2: 'Login at POST /auth/login to get token',
            step3: 'Click "Authorize" button in Swagger UI and enter token',
            step4: 'Use protected endpoints'
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
    console.log(`API Documentation available at: http://localhost:${PORT}/api-docs`)
    console.log(`📝 To authenticate:`)
    console.log(`   1. Register/Login to get JWT token`)
    console.log(`   2. Click 'Authorize' button in Swagger UI`)
    console.log(`   3. Enter token (without 'Bearer' prefix)`)
})

