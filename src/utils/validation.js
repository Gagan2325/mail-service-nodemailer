/**
 * Validation Utilities
 * Custom validation functions for email service
 */

/**
 * Validate email format using regex
 *
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format, false otherwise
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate SMTP host
 *
 * @param {string} host - SMTP host to validate
 * @returns {boolean} - True if valid host format
 */
const isValidHost = (host) => {
  // Check if host is a valid domain or IP address
  const hostRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$|^(\d{1,3}\.){3}\d{1,3}$/;
  return hostRegex.test(host);
};

/**
 * Validate SMTP port
 *
 * @param {number} port - Port number to validate
 * @returns {boolean} - True if valid port number
 */
const isValidPort = (port) => {
  const portNum = parseInt(port, 10);
  return portNum > 0 && portNum <= 65535 && !Number.isNaN(portNum);
};

/**
 * Validate request body for email sending
 *
 * @param {Object} body - Request body
 * @returns {Object} - { isValid: boolean, errors: Array<string> }
 */
const validateEmailRequest = (body) => {
  const errors = [];

  // Validate SMTP configuration
  if (!body.smtp_host) {
    errors.push('smtp_host is required');
  } else if (!isValidHost(body.smtp_host)) {
    errors.push('smtp_host format is invalid');
  }

  if (!body.smtp_port) {
    errors.push('smtp_port is required');
  } else if (!isValidPort(body.smtp_port)) {
    errors.push('smtp_port must be a valid port number (1-65535)');
  }

  if (!body.smtp_user) {
    errors.push('smtp_user is required');
  }

  if (!body.smtp_pass) {
    errors.push('smtp_pass is required');
  }

  if (!body.from_email) {
    errors.push('from_email is required');
  } else if (!isValidEmail(body.from_email)) {
    errors.push('from_email format is invalid');
  }

  if (!body.to_email) {
    errors.push('to_email is required');
  } else if (!isValidEmail(body.to_email)) {
    errors.push('to_email format is invalid');
  }

  if (!body.subject || body.subject.trim() === '') {
    errors.push('subject is required');
  }

  if (!body.body || body.body.trim() === '') {
    errors.push('body is required');
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

module.exports = {
  isValidEmail,
  isValidHost,
  isValidPort,
  validateEmailRequest,
};
