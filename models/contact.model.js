import mongoose from 'mongoose'
import Tags from './tag.model.js'
import User from './user.model.js'


const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tags'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Creator is required"]
    }
})

const Contact = mongoose.model('Contact', contactSchema)
export default Contact