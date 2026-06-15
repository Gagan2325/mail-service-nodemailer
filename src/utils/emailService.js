/**
 * Email Service Utility
 * Reusable function for sending emails via Nodemailer
 * Can be used anywhere in the application
 */

const nodemailer = require('nodemailer');
const { logger } = require('../config/logger');

/**
 * Send email using provided SMTP configuration
 *
 * @param {Object} smtpConfig - SMTP configuration object
 * @param {string} smtpConfig.host - SMTP server host
 * @param {number} smtpConfig.port - SMTP server port
 * @param {string} smtpConfig.user - SMTP authentication user
 * @param {string} smtpConfig.pass - SMTP authentication password
 * @param {boolean} [smtpConfig.secure] - Use TLS (true for port 465, false for other ports)
 * @param {boolean} [smtpConfig.rejectUnauthorized] - Reject self-signed certificates
 * @param {string} from - Sender email address (format: "email@example.com" or "Name <email@example.com>")
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlBody - Email body in HTML format
 * @param {string} [textBody] - Optional plain text version of email body
 * @param {Array} [attachments] - Optional array of attachment objects for Nodemailer
 *
 * @returns {Promise<Object>} - Object containing { success: boolean, messageId: string, error: string }
 *
 * @example
 * const smtpConfig = {
 *   host: 'smtp.gmail.com',
 *   port: 587,
 *   user: 'your-email@gmail.com',
 *   pass: 'your-app-password',
 *   secure: false,
 *   rejectUnauthorized: false
 * };
 *
 * const result = await sendMail(
 *   smtpConfig,
 *   'receiver@example.com',
 *   'Test Subject',
 *   '<h1>Hello World</h1>'
 * );
 *
 * if (result.success) {
 *   console.log('Email sent:', result.messageId);
 * } else {
 *   console.error('Email failed:', result.error);
 * }
 */
async function sendMail(smtpConfig, to, subject, htmlBody, textBody = null, attachments = []) {
  let transporter = null;

  try {
    // Validate required parameters
    if (!smtpConfig || typeof smtpConfig !== 'object') {
      throw new Error('Invalid SMTP configuration');
    }

    if (!smtpConfig.host || !smtpConfig.port || !smtpConfig.user || !smtpConfig.pass) {
      throw new Error('Missing required SMTP credentials');
    }

    if (!to || !subject || !htmlBody) {
      throw new Error('Missing required email parameters (to, subject, htmlBody)');
    }

    // Determine if connection should use TLS
    const secure = smtpConfig.secure || smtpConfig.port === 465;

    // Create Nodemailer transporter with SMTP configuration
    transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: secure,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
      // TLS configuration
      tls: {
        rejectUnauthorized: smtpConfig.rejectUnauthorized !== undefined ? smtpConfig.rejectUnauthorized : false,
      },
      // Connection pooling for better performance
      pool: {
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 4000,
        rateLimit: 14,
      },
      // Connection timeout
      connectionTimeout: 5000,
      socketTimeout: 5000,
    });

    logger.debug('Nodemailer transporter created', {
      host: smtpConfig.host,
      port: smtpConfig.port,
      user: smtpConfig.user,
    });

    // Prepare mail options
    const mailOptions = {
      from: smtpConfig.from || smtpConfig.user,
      to: to,
      subject: subject,
      html: htmlBody,
    };

    // Add text body if provided
    if (textBody) {
      mailOptions.text = textBody;
    }

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments;
    }

    logger.info(`Attempting to send email to: ${to}`);

    // Send email
    const info = await transporter.sendMail(mailOptions);

    logger.info(`Email sent successfully to: ${to}`, {
      messageId: info.messageId,
      response: info.response,
    });

    // Return success response
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      error: null,
    };
  } catch (error) {
    // Log error details
    logger.error('Email sending failed', {
      error: error.message,
      code: error.code,
      command: error.command,
    });

    // Return error response
    return {
      success: false,
      messageId: null,
      response: null,
      error: error.message || 'Failed to send email',
    };
  } finally {
    // Close transporter connection
    if (transporter) {
      transporter.close();
      logger.debug('Transporter connection closed');
    }
  }
}

module.exports = { sendMail };
