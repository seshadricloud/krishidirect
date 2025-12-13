// logger.ts
import { createLogger, format, transports } from 'winston';

// Create a logger instance with specific settings
const logger = createLogger({
    level: 'info', // Set the default logging level
    format: format.combine(
        format.timestamp(), // Add a timestamp to each log
        format.json() // Format logs as JSON
    ),
    transports: [
        new transports.Console(), // Log to the console
        new transports.File({ filename: 'error.log', level: 'error' }), // Log errors to a file
        new transports.File({ filename: 'combined.log' }) // Log all messages to a file
    ],
});

// Export the logger instance for use in other parts of the application
export default logger;