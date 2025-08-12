import express from 'express'
import 'dotenv/config'
import router from './routes/contact.route.js'
import connectToDB from './configs/db.js'
import { specs, swaggerUi } from './configs/swagger.js'

const app = express()

// Add JSON middleware
app.use(express.json())

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

await connectToDB()
const PORT = process.env.PORT || 4000


app.use('/user', router)


// Add a welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Contact Manager API',
        documentation: `http://localhost:${PORT}/api-docs`
    })
})

app.listen(PORT, ()=> {
    console.log(`Server is running on PORT ${PORT}`)
})