import mongoose from "mongoose";
import Contact from "./contact.model.js";

const tagSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Tag name is required"],
        trim: true,
        minlength: [1, "Tag name must be at least 1 character"],
        maxlength: [50, "Tag name cannot exceed 50 characters"],
        match: [/^[a-zA-Z0-9\s\-_]+$/, "Tag name can only contain letters, numbers, spaces, hyphens, and underscores"]
        // Remove unique: true since we're using compound index
    },
    color: {
        type: String,
        required: [true, "Tag color is required"],
        match: [/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color code (e.g., #FF5733)"],
        default: "#3498db"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Creator is required"]
    },
    usageCount: {
        type: Number,
        default: 0,
        min: [0, "Usage count cannot be negative"]
    }
}, {
    timestamps: true
})

// Create compound index for unique name per user
tagSchema.index({ name: 1, createdBy: 1 }, { unique: true }); // Fix: uncommented this line

// Method to increment usage count
tagSchema.methods.incrementUsage = function () {
    this.usageCount += 1;
    return this.save();
};

// Method to decrement usage count
tagSchema.methods.decrementUsage = function () {
    if (this.usageCount > 0) {
        this.usageCount -= 1;
    }
    return this.save();
};

// Static method to find active tags by user
tagSchema.statics.findActiveByUser = function (userId) {
    return this.find({ createdBy: userId }).sort({ usageCount: -1, createdAt: -1 });
};

// Pre-save middleware to ensure name is unique per user
tagSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('name')) {
        const existingTag = await this.constructor.findOne({
            name: { $regex: new RegExp(`^${this.name}$`, 'i') },
            createdBy: this.createdBy,
            _id: { $ne: this._id }
        });

        if (existingTag) {
            const error = new Error('Tag name already exists for this user');
            error.name = 'ValidationError';
            return next(error);
        }
    }
    next();
});

// Pre-remove middleware to update usage count when tag is deleted
tagSchema.pre('findOneAndDelete', async function (next) {
    try {
        const tag = await this.model.findOne(this.getFilter());
        if (tag) {
            // Remove this tag from all contacts that have it
            await Contact.updateMany(
                { tags: tag._id },
                { $pull: { tags: tag._id } }
            );
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Tags = mongoose.model("Tags", tagSchema);

export default Tags;