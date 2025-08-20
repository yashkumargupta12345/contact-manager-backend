import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import router from './routes/contact.route.js'
import favoriteRouter from './routes/favorite.route.js'
import userRouter from './routes/user.route.js'
import tagRouter from './routes/tag.route.js'
import connectToDB from './configs/db.js'
import { specs, swaggerUi, swaggerOptions } from './configs/swagger.js'
import { authenticateToken } from './middlewares/authMiddleware.js'
import { globalErrorHandler } from './utils/errorHandler.js' // Add this import

const app = express()

// Add JSON middleware
app.use(express.json())
app.use(cors())

// Swagger documentation with custom options
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions))

await connectToDB()
const PORT = process.env.PORT || 4000

// Auth routes (no authentication required for register/login)
app.use('/auth', (req, res, next) => {
    // Only protect update-password route
    if (req.path === '/update-password') {
        return authenticateToken(req, res, next);
    }
    next();
}, userRouter);

// Protected routes (authentication required)
app.use('/user', authenticateToken, router)
app.use('/user', authenticateToken, favoriteRouter)
app.use('/user', authenticateToken, tagRouter)

// Welcome route
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

// Add global error handler (must be last middleware)
app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
    console.log(`API Documentation available at: http://localhost:${PORT}/api-docs`)
    console.log(`📝 To authenticate:`)
    console.log(`   1. Register/Login to get JWT token`)
    console.log(`   2. Click 'Authorize' button in Swagger UI`)
    console.log(`   3. Enter token (without 'Bearer' prefix)`)
})
