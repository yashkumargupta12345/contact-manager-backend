import Contact from "../models/contact.model.js";


export const getContact = async (req, res) => {
    try {

        const userId = req.user.id;

        const contacts = await Contact.find({createdBy: userId}).populate('tags', 'name color')

        if (!contacts || contacts.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "No contacts found" 
            })
        }

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        })
    }
    catch (error) {
        console.error("Error fetching contacts:", error)
        res.status(500).json({
            success: false,
            error: "Failed to fetch contacts",
            message: error.message
        })
    }
}


export const createContact = async (req, res) => {
    try {
        const newContact = req.body;
        const userId = req.user.id;

        if (!newContact || Object.keys(newContact).length === 0) {
            return res.status(400).json({
                success: false,
                error: "Request body is required"
            })
        }

        // Add userId to contact Data
        const contactData = {
            ...newContact,
            createdBy: userId
        }

        const contact = new Contact(contactData)
        const savedContact = await contact.save()

        await savedContact.populate('tags', 'name color');

        res.status(201).json({
            success: true,
            message: "Contact Created Successfully",
            data: savedContact
        })
    }
    catch (error) {
        console.error("Error creating contact:", error)

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: "Validation failed",
                message: error.message
            })
        }

        res.status(500).json({
            success: false,
            error: "Failed to create contact",
            message: error.message
        })
    }
}


export const updateContact = async (req, res) => {
    try {
        const id = req.params.id
        const updateData = req.body;
        const userId = req.user.id;

        // Validate request body
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                error: "Request body is required"
            })
        }

        // Removed createdBy from updateData to prevent modification
        delete updateData.createdBy;


        // Fix: Correct syntax for findByIdAndUpdate
        const updatedContact = await Contact.findOneAndUpdate({ _id: id, createdBy: userId },
            updateData,
            { new: true, runValidators: true }).populate('tags', 'name color');
        
        if (!updatedContact) {
            return res.status(404).json({
                success: false,
                error: "Contact not found",
                message: "Contact not found or you don't have permission to update it"
            })
        }


        res.status(200).json({
            success: true,
            message: "Contact updated Successfully",
            data: updatedContact
        })
    } catch (error) {
        console.error("Error updating contact:", error)

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: "Validation failed",
                message: error.message
            })
        }

        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: "Invalid contact ID",
                message: "The provided ID is not valid"
            })
        }

        res.status(500).json({
            success: false,
            error: "Failed to update contact",
            message: error.message
        })
    }
}


export const deleteContact = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        // Check if contact exists before deleting
        const deletedContact = await Contact.findOneAndDelete({ _id: id, createdBy: userId });

        if (!deletedContact) {
            return res.status(404).json({
                success: false,
                error: "Contact not found",
                message: "The contact with the specified ID does not exist"
            })
        }

        res.status(200).json({
            success: true,
            message: "Contact deleted successfully",
            data: deletedContact
        })
    } catch (error) {
        console.error("Error deleting contact:", error)

        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: "Invalid contact ID",
                message: "The provided ID is not valid"
            })
        }

        res.status(500).json({
            success: false,
            error: "Failed to delete contact",
            message: error.message
        })
    }
}