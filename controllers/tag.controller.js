import mongoose from "mongoose";
import Tags from "../models/tag.model.js";
import Contact from "../models/contact.model.js";


// Get Tags
export const getTags = async (req, res) => {
    try {
        const userId = req.user.id;

        const tags = await Tags.findActiveByUser(userId);

        if (!tags || tags.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No tags found"
            });
        }

        res.status(200).json({
            success: true,
            count: tags.length,
            data: tags
        });
    } catch (error) {
        console.error("Error fetching tags:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch tags",
            message: error.message
        });
    }
}


// Create Tag
export const createTag = async (req, res) => {
    try {
        const { name, color } = req.body;
        const userId = req.user.id;

        const tag = new Tags({
            name,
            color: color || "#3498db",
            createdBy: userId
        });

        const savedTag = await tag.save();

        res.status(201).json({
            success: true,
            message: "Tag created successfully",
            data: savedTag
        });
    } catch (error) {
        console.error("Error creating tag:", error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: "Tag name already exists",
                message: "A tag with this name already exists for this user"
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: "Validation failed",
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            error: "Failed to create tag",
            message: error.message
        });
    }
}



// Update Tag
export const updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color } = req.body;
        const userId = req.user.id;

        const updatedTag = await Tags.findOneAndUpdate(
            { _id: id, createdBy: userId },
            { name, color },
            { new: true, runValidators: true }
        );

        if (!updatedTag) {
            return res.status(404).json({
                success: false,
                error: "Tag not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Tag updated successfully",
            data: updatedTag
        });
    } catch (error) {
        console.error("Error updating tag:", error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: "Validation failed",
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            error: "Failed to update tag",
            message: error.message
        });
    }
}




// Delete Tag
export const deleteTag = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deletedTag = await Tags.findOneAndDelete({ _id: id, createdBy: userId })

        if (!deletedTag) {
            return res.status(404).json({
                success: false,
                error: "Tag not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Tag deleted successfully",
            data: deletedTag
        });
    } catch (error) {
        console.error("Error deleting tag:", error);

        res.status(500).json({
            success: false,
            error: "Failed to delete tag",
            message: error.message
        });
    }
}




// Get contacts assosciated with the tag
export const getContactsByTag = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // First verify the tag exists and belongs to the user
        const tag = await Tags.findOne({ _id: id, createdBy: userId });

        if (!tag) {
            return res.status(404).json({
                success: false,
                error: "Tag not found",
                message: "The tag with the specified ID does not exist"
            });
        }

        // Find all contacts that have this tag
        const contacts = await Contact.find({
            tags: id,
            createdBy: userId
        }).populate('tags', 'name color');

        if (!contacts || contacts.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No contacts found with tag "${tag.name}"`
            });
        }

        res.status(200).json({
            success: true,
            message: `Contacts with tag "${tag.name}"`,
            tag: {
                id: tag._id,
                name: tag.name,
                color: tag.color,
                usageCount: tag.usageCount
            },
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error("Error fetching contacts by tag:", error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: "Invalid tag ID",
                message: "The provided ID is not valid"
            });
        }

        res.status(500).json({
            success: false,
            error: "Failed to fetch contacts by tag",
            message: error.message
        });
    }
}



// Add contact to tag
export const addContactToTag = async (req, res) => {
    try {
        const { tagId } = req.params;
        const { contactId } = req.body;
        const userId = req.user.id;

        // Debug logging
        console.log("Debug Info:");
        console.log("- Tag ID:", tagId);
        console.log("- Contact ID:", contactId);
        console.log("- User ID:", userId);
        console.log("- User object:", req.user);

        // Input validation
        if (!contactId) {
            return res.status(400).json({
                success: false,
                error: "Contact ID is required",
                message: "Please provide a contact ID in the request body"
            });
        }

        // Validate MongoDB ObjectIds
        if (!mongoose.Types.ObjectId.isValid(tagId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid tag ID",
                message: "The provided tag ID is not a valid MongoDB ObjectId"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid contact ID",
                message: "The provided contact ID is not a valid MongoDB ObjectId"
            });
        }

        // Verify tag exists and belong to user
        const tag = await Tags.findOne({ _id: tagId, createdBy: userId });
        if (!tag) {
            return res.status(404).json({
                success: false,
                error: "Tag not found",
                message: "The tag with the specific id doesn't exist"
            })
        }

        // Verify contact exists
        const contact = await Contact.findOne({_id: contactId,
            createdBy: userId
        });
        if (!contact) {
            return res.status(404).json({
                success: false,
                error: "Contact not found",
                message: "The contact with the specific id does not exist"
            })
        }

        // Check if this contact is already assosciated with this tag
        if (contact.tags.includes(tagId)) {
            return res.status(400).json({
                success: false,
                error: "Tag already assigned",
                message: "This contact already has this tag"
            })
        }

        // Add contact to tag
        contact.tags.push(tagId)
        await contact.save()

        // Increment tag usage count
        await tag.incrementUsage();

        // Get updated contact with populated tags
        const updatedContact = await Contact.findById(contactId).populate('tags', 'name color');

        res.status(200).json({
            success: true,
            message: `Tag "${tag.name}" added to contact successfully`,
            data: {
                contact: updatedContact,
                tag: tag
            }
        });
    }
    catch (error) {
        console.error("Error adding contact to tag:", error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: "Invalid ID",
                message: "The provided ID is not valid"
            });
        }

        res.status(500).json({
            success: false,
            error: "Failed to add contact to tag",
            message: error.message
        });
    }
}



// Remove contact from a tag
export const removeContactFromTag = async (req, res) => {
    try {
        const { tagId, contactId } = req.params;
        const userId = req.user.id;

        // Verify tag exists and belong to the user
        const tag = await Tags.findOne({ _id: tagId, createdBy: userId });
        if (!tag) {
            return res.status(404).json({
                success: false,
                error: "Tag not found",
                message: "The tag with the specific Id does not exist"
            })
        }

        // Verify contact exists and has this tag
        const contact = await Contact.findOne({_id: contactId,
            createdBy: userId
        });
        if (!contact) {
            return res.status(404).json({
                success: false,
                error: "Contact not found",
                message: "The contact with the specified ID does not exist"
            });
        }

        if (!contact.tags.includes(tagId)) {
            return res.status(400).json({
                success: false,
                error: "Tag not assigned",
                message: "This contact doesn't have this tag"
            });
        }

        // Remove tag from contact
        contact.tags = contact.tags.filter(tag => tag.toString() !== tagId);
        await contact.save();

        // Decrement tag usage count
        await tag.decrementUsage();

        // Get updated contact with populated tags
        const updatedContact = await Contact.findById(contactId).populate('tags', 'name color');

        res.status(200).json({
            success: true,
            message: `Tag "${tag.name}" removed from contact successfully`,
            data: {
                contact: updatedContact,
                tag: tag
            }
        });
    } catch (error) {
        console.error("Error removing contact from tag:", error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: "Invalid ID",
                message: "The provided ID is not valid"
            });
        }

        res.status(500).json({
            success: false,
            error: "Failed to remove contact from tag",
            message: error.message
        });
    }
}




// Add multiple contacts to a tag
export const addMultipleContactsToTag = async (req, res) => {
    try {
        const { tagId } = req.params;
        const { contactIds } = req.body; // Array of contact IDs
        const userId = req.user.id;

        if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Invalid input",
                message: "Please provide an array of contact IDs"
            });
        }

        // Verify tag exists and belongs to user
        const tag = await Tags.findOne({ _id: tagId, createdBy: userId });
        if (!tag) {
            return res.status(404).json({
                success: false,
                error: "Tag not found",
                message: "The tag with the specified ID does not exist or doesn't belong to you"
            });
        }
        // Get all contacts that exist
        const contacts = await Contact.find({ _id: { $in: contactIds },
        createdBy: userId });

        if (contacts.length === 0) {
            return res.status(404).json({
                success: false,
                error: "No contacts found",
                message: "None of the provided contact IDs exist"
            });
        }

        let addedCount = 0;
        const results = [];

        for (const contact of contacts) {
            if (!contact.tags.includes(tagId)) {
                contact.tags.push(tagId);
                await contact.save();
                addedCount++;
                results.push({
                    contactId: contact._id,
                    name: contact.name,
                    status: 'added'
                });
            } else {
                results.push({
                    contactId: contact._id,
                    name: contact.name,
                    status: 'already_has_tag'
                });
            }
        }

        // Update tag usage count
        if (addedCount > 0) {
            tag.usageCount += addedCount;
            await tag.save();
        }
        res.status(200).json({
            success: true,
            message: `Tag "${tag.name}" processing completed`,
            data: {
                tag: tag,
                totalProcessed: contacts.length,
                addedCount: addedCount,
                results: results
            }
        });
    } catch (error) {
        console.error("Error adding multiple contacts to tag:", error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: "Invalid ID",
                message: "One or more provided IDs are not valid"
            });
        }

        res.status(500).json({
            success: false,
            error: "Failed to add contacts to tag",
            message: error.message
        });
    }
};



// Get all contacts that don't have a specific tag (for selection)
export const getContactsNotInTag = async (req, res) => {
    try {
        const { tagId } = req.params;
        const userId = req.user.id;

        // Verify tag exists and belongs to user
        const tag = await Tags.findOne({ _id: tagId, createdBy: userId });
        if (!tag) {
            return res.status(404).json({
                success: false,
                error: "Tag not found",
                message: "The tag with the specified ID does not exist or doesn't belong to you"
            });
        }

        // Find contacts that don't have this tag
        const contacts = await Contact.find({
            tags: { $ne: tagId }
        }).select('name email phone');

        res.status(200).json({
            success: true,
            message: `Contacts not in tag "${tag.name}"`,
            tag: {
                id: tag._id,
                name: tag.name,
                color: tag.color
            },
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error("Error fetching contacts not in tag:", error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: "Invalid tag ID",
                message: "The provided ID is not valid"
            });
        }

        res.status(500).json({
            success: false,
            error: "Failed to fetch contacts",
            message: error.message
        });
    }
};
