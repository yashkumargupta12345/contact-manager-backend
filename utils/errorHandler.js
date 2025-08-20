import { ERROR_MESSAGES, ERROR_CODES } from '../constants/errors.js';

export class AppError extends Error {
    constructor(message, statusCode, errorCode = null) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const handleServiceError = (error) => {
    switch (error.message) {
        case ERROR_CODES.USER_ALREADY_EXISTS:
            return new AppError(ERROR_MESSAGES.USER_ALREADY_EXISTS, 409, ERROR_CODES.USER_ALREADY_EXISTS);
        case ERROR_CODES.INVALID_CREDENTIALS:
            return new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401, ERROR_CODES.INVALID_CREDENTIALS);
        case ERROR_CODES.USER_NOT_FOUND:
            return new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404, ERROR_CODES.USER_NOT_FOUND);
        case ERROR_CODES.WRONG_CURRENT_PASSWORD:
            return new AppError(ERROR_MESSAGES.WRONG_CURRENT_PASSWORD, 401, ERROR_CODES.WRONG_CURRENT_PASSWORD);
        case ERROR_CODES.SAME_PASSWORD:
            return new AppError(ERROR_MESSAGES.SAME_PASSWORD, 400, ERROR_CODES.SAME_PASSWORD);
        default:
            return new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
    }
};

export const globalErrorHandler = (error, req, res, next) => {
    let { statusCode = 500, message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR, errorCode } = error;

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        message = validationErrors.join(', ');
        statusCode = 400;
        errorCode = 'VALIDATION_ERROR';
    }

    // Handle duplicate key error
    if (error.code === 11000) {
        message = ERROR_MESSAGES.USER_ALREADY_EXISTS;
        statusCode = 409;
        errorCode = ERROR_CODES.USER_ALREADY_EXISTS;
    }

    // Log error for debugging
    console.error('Error:', {
        message: error.message,
        stack: error.stack,
        statusCode,
        errorCode,
        url: req.url,
        method: req.method
    });

    res.status(statusCode).json({
        success: false,
        error: errorCode || 'UNKNOWN_ERROR',
        message: message
    });
};

