// filepath: KrishiDirect/KrishiDirect/backend/src/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error(err.stack);

    // Set the response status code and message
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Send the error response
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
    });
};

export default errorHandler;