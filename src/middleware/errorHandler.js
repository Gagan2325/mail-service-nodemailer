/**
 * Global Error Handler Middleware
 * Catches and handles errors from all routes and middlewares
 */

const { logger } = require('../config/logger');

/**
 * Global error handling middleware
 * Should be used as the last middleware in Express app
 *
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error('Unhandled Error', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Send error response
  res.status(statusCode).json({
    status: false,
    message: message,
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors and pass them to error handler
 *
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler,
};
