import mongoose from 'mongoose'

const connectToDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log("Connected to MongoDB Databse")
    } catch (error) {
        console.error("Connection to MongoDB Database Failed:", error.message) // Fix: use console.error instead of res.error
        process.exit(1)
    }
}

export default connectToDB