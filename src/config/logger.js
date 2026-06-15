/**
 * Logger Configuration
 * Centralizes logging setup for the application
 */

const morgan = require('morgan');

/**
 * Configure Morgan HTTP request logger
 * @param {string} format - Morgan format (tiny, short, common, combined, dev)
 * @returns {Function} Morgan middleware
 */
const setupMorganLogger = (format = 'dev') => {
  return morgan(format);
};

/**
 * Simple console logger utility
 */
const logger = {
  /**
   * Log info level messages
   */
  info: (message, data = '') => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
  },

  /**
   * Log error level messages
   */
  error: (message, error = '') => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  },

  /**
   * Log warning level messages
   */
  warn: (message, data = '') => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data);
  },

  /**
   * Log debug level messages
   */
  debug: (message, data = '') => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, data);
    }
  },
};

module.exports = {
  setupMorganLogger,
  logger,
};
