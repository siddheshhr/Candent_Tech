/**
 * Error Handler Utility
 * Creates a custom error object with a status code and message.
 * Can be used in controllers to pass standardized errors to Express error middleware.
 */
export const errorHandler = (statusCode , message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
};