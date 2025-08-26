import mongoose from 'mongoose';
import 'dotenv/config';
import Contact from './models/contact.model.js';
import User from './models/user.model.js';

const migrateContacts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for migration');

        // Get the first user to assign orphaned contacts to (or create a default user)
        let defaultUser = await User.findOne();
        
        if (!defaultUser) {
            console.log('No users found. Creating a default user...');
            defaultUser = new User({
                name: 'Default User',
                email: 'default@example.com',
                password: 'defaultpassword123'
            });
            await defaultUser.save();
            console.log('Default user created');
        }

        // Update all contacts without createdBy field
        const result = await Contact.updateMany(
            { createdBy: { $exists: false } },
            { $set: { createdBy: defaultUser._id } }
        );

        console.log(`Migration completed: ${result.modifiedCount} contacts updated`);
        
        // Alternatively, if you want to delete orphaned contacts instead:
        // const result = await Contact.deleteMany({ createdBy: { $exists: false } });
        // console.log(`Migration completed: ${result.deletedCount} orphaned contacts deleted`);

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateContacts();