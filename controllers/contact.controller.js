import Contact from "../models/contact.model.js";


export const getContact = async (req, res) => {
    try {
        const contacts = await Contact.find({})

        if (!contacts || contacts.length === 0) {
            return res.status(404).json({ message: "No contacts found" })
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
        if (!newContact || Object.keys(newContact).length === 0) {
            return res.status(400).json({
                success: false,
                error: "Request body is required"
            })
        }
        const contact = new Contact(newContact)
        const savedContact = await contact.save()

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

        // Validate request body
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                error: "Request body is required"
            })
        }


        // Fix: Correct syntax for findByIdAndUpdate
        const updatedContact = await Contact.findByIdAndUpdate(id,
            updateData,
            { new: true, runValidators: true })

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
        const id = req.params.id

        // Check if contact exists before deleting
        const deletedContact = await Contact.findByIdAndDelete(id)

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