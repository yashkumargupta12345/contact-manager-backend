import mongoose from 'mongoose';

const connectToDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/contact-manager';
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Connected to MongoDB successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectToDB;