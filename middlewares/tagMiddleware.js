export const validateTag = (req, res, next) => {
    const { name, color } = req.body;

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
        return res.status(401).json({
            success: false,
            error: "Authentication required",
            message: "User must be authenticated to create tags"
        });
    }

    // Input validation
    if (!name) {
        return res.status(400).json({
            success: false,
            error: "Tag name is required"
        });
    }

    if (name.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: "Tag name cannot be empty"
        });
    }

    if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
        return res.status(400).json({
            success: false,
            error: "Invalid color format",
            message: "Color must be a valid hex color code (e.g., #FF5733)"
        });
    }

    next()
}

export const validateUpdateTag = (req, res, next) => {
    const { name, color } = req.body;

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
        return res.status(401).json({
            success: false,
            error: "Authentication required"
        });
    }

    if (!name && !color) {
        return res.status(400).json({
            success: false,
            error: "At least one field is required for update"
        });
    }

    if (name && name.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: "Tag name cannot be empty"
        });
    }

    if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
        return res.status(400).json({
            success: false,
            error: "Invalid color format",
            message: "Color must be a valid hex color code (e.g., #FF5733)"
        });
    }

    next();
}