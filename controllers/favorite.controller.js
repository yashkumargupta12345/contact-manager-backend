import Contact from "../models/contact.model.js";



export const getFavorites = async(req, res) => {
    try {
        const userId = req.user.id;

            const favoriteContacts = await Contact.find(
                { 
                    isFavorite: true,
                    createdBy: userId
                }
            ).populate('tags', 'name color')

        if (!favoriteContacts || favoriteContacts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No favorite Contacts found"
            })
        }

        res.status(200).json({
            success: true,
            count: favoriteContacts.length,
            data: favoriteContacts
        })
    } 
    catch (error) {
        console.error("Error fetching favorite contacts:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch favorite contacts",
            message: error.message
        });
    }
}


export const addFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const favoriteContact = await Contact.findByIdAndUpdate(
            {_id: id, createdBy: userId}, { isFavorite: true }, { new: true, runValidators: true }).populate('tags', 'name color');

        // Check if contact exists
        if (!favoriteContact) {
            return res.status(404).json({
                success: false,
                error: "Contact not found",
                message: "The contact with the specified ID does not exist"
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact added to favorites successfully",
            data: favoriteContact
        });
    }
    catch (error) {
        console.error("Error adding contact to favorites:", error);

        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: "Invalid contact ID",
                message: "The provided ID is not valid"
            });
        }

        res.status(500).json({
            success: false,
            error: "Failed to add contact to favorites",
            message: error.message
        });
    }
}





export const removeFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const contact = await Contact.findOneAndUpdate({ _id: id, createdBy: userId }, { isFavorite: false }, { new: true, runValidators: true }).populate('tags', 'name color');

        // Check if contact exists
        if (!contact) {
            return res.status(404).json({
                success: false,
                error: "Contact not found",
                message: "The contact with the specified ID does not exist"
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact removed from favorites successfully",
            data: contact
        });
    }
    catch (error) {
        console.error("Error adding contact to favorites:", error);

        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: "Invalid contact ID",
                message: "The provided ID is not valid"
            });
        }

        res.status(500).json({
            success: false,
            error: "Failed to remove contact from favorites",
            message: error.message
        });
    }
}
