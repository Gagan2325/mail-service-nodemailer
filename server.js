/**
 * Email Sending Service - Main Server
 * 
 * Production-ready Email Sending Service using Express.js and Nodemailer
 * 
 * Features:
 * - Dynamic SMTP configuration from request
 * - HTML email support
 * - Email validation
 * - CORS support
 * - Rate limiting (100 requests/hour per IP)
 * - Request logging with Morgan
 * - Security with Helmet
 * - Error handling
 * - Environment variable support
 * - SSL/TLS SMTP support
 * - Message ID tracking
 * 
 * Author: Your Name
 * Version: 1.0.0
 * License: MIT
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const { logger, setupMorganLogger } = require('./src/config/logger');
const { errorHandler, asyncHandler } = require('./src/middleware/errorHandler');
const { sendMail } = require('./src/utils/emailService');
const { validateEmailRequest } = require('./src/utils/validation');

// ============================================================================
// CONFIGURATION
// ============================================================================

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Security: Helmet middleware to set various HTTP headers
app.use(helmet());

// Parse incoming request bodies as JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// HTTP request logging with Morgan
app.use(setupMorganLogger(NODE_ENV === 'development' ? 'dev' : 'combined'));

// CORS middleware - Allow cross-origin requests
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
    
    if (allowedOrigins.includes(origin) || process.env.ENABLE_CORS === 'true') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting middleware - 100 requests per hour per IP
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000'), // 1 hour
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // Max 100 requests per windowMs
  message: 'Too many email requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health check endpoint
    return req.path === '/health';
  },
});

// Apply rate limiting to email endpoint
app.use('/send-email', limiter);

// ============================================================================
// ROUTES
// ============================================================================

/**
 * Health Check Endpoint
 * GET /health
 * 
 * Used to verify that the server is running and healthy
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: true,
    message: 'Email Service is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});

/**
 * API Documentation Endpoint
 * GET /
 * 
 * Returns API documentation and usage information
 */
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Email Sending Service',
    version: '1.0.0',
    description: 'Production-ready Email Sending Service using Express.js and Nodemailer',
    endpoints: {
      health: {
        method: 'GET',
        path: '/health',
        description: 'Check if service is running',
      },
      sendEmail: {
        method: 'POST',
        path: '/send-email',
        description: 'Send an email with SMTP configuration',
        rateLimit: '100 requests per hour per IP',
      },
    },
    documentation: {
      github: 'https://github.com/yourusername/mail-service-nodemailer',
      postman: '/docs/postman',
    },
  });
});

/**
 * Main Email Sending Endpoint
 * POST /send-email
 * 
 * Sends an email using the provided SMTP configuration
 * 
 * Request Body:
 * {
 *   "smtp_host": "smtp.example.com",
 *   "smtp_port": 587,
 *   "smtp_user": "user@example.com",
 *   "smtp_pass": "password",
 *   "from_email": "user@example.com",
 *   "from_name": "My Company",
 *   "to_email": "receiver@example.com",
 *   "subject": "Test Subject",
 *   "body": "<h1>Hello World</h1>"
 * }
 * 
 * Response (Success):
 * {
 *   "status": true,
 *   "message": "Email sent successfully",
 *   "messageId": "xxxxx"
 * }
 * 
 * Response (Error):
 * {
 *   "status": false,
 *   "message": "Error description"
 * }
 */
app.post(
  '/send-email',
  asyncHandler(async (req, res) => {
    const startTime = Date.now();
    
    logger.info('POST /send-email request received', {
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });

    // Step 1: Validate request body
    const validation = validateEmailRequest(req.body);
    
    if (!validation.isValid) {
      logger.warn('Email request validation failed', {
        errors: validation.errors,
        ip: req.ip,
      });

      return res.status(400).json({
        status: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    try {
      // Extract request data
      const {
        smtp_host,
        smtp_port,
        smtp_user,
        smtp_pass,
        from_email,
        from_name,
        to_email,
        subject,
        body,
      } = req.body;

      // Step 2: Build SMTP configuration
      const smtpConfig = {
        host: smtp_host,
        port: parseInt(smtp_port, 10),
        user: smtp_user,
        pass: smtp_pass,
        from: from_name ? `${from_name} <${from_email}>` : from_email,
        secure: smtp_port === '465', // Use TLS for port 465
        rejectUnauthorized: process.env.REJECT_UNAUTHORIZED === 'true' || false,
      };

      logger.debug('SMTP configuration prepared', {
        host: smtpConfig.host,
        port: smtpConfig.port,
        user: smtpConfig.user,
        secure: smtpConfig.secure,
      });

      // Step 3: Send email using the reusable sendMail function
      const result = await sendMail(
        smtpConfig,
        to_email,
        subject,
        body, // HTML body
        null, // Optional plain text
        [] // Optional attachments
      );

      // Step 4: Handle send result
      if (result.success) {
        const duration = Date.now() - startTime;

        logger.info('Email sent successfully', {
          to: to_email,
          subject: subject,
          messageId: result.messageId,
          duration: `${duration}ms`,
          ip: req.ip,
        });

        return res.status(200).json({
          status: true,
          message: 'Email sent successfully',
          messageId: result.messageId,
          response: result.response,
        });
      } else {
        // Handle email sending error
        const duration = Date.now() - startTime;

        logger.error('Email sending failed', {
          to: to_email,
          subject: subject,
          error: result.error,
          duration: `${duration}ms`,
          ip: req.ip,
        });

        // Determine appropriate error message and status code
        let statusCode = 500;
        let errorMessage = result.error;

        // Handle specific SMTP errors
        if (result.error.includes('SMTP authentication failed') || 
            result.error.includes('Invalid login') ||
            result.error.includes('535')) {
          statusCode = 401;
          errorMessage = 'SMTP authentication failed. Please verify your credentials.';
        } else if (result.error.includes('ECONNREFUSED') || 
                   result.error.includes('getaddrinfo') ||
                   result.error.includes('EHOSTUNREACH')) {
          statusCode = 503;
          errorMessage = 'Cannot connect to SMTP server. Please verify the host and port.';
        } else if (result.error.includes('invalid email')) {
          statusCode = 400;
          errorMessage = 'Invalid recipient email address';
        }

        return res.status(statusCode).json({
          status: false,
          message: errorMessage,
          error: result.error,
        });
      }
    } catch (error) {
      const duration = Date.now() - startTime;

      logger.error('Unexpected error in /send-email endpoint', {
        error: error.message,
        stack: error.stack,
        duration: `${duration}ms`,
        ip: req.ip,
      });

      return res.status(500).json({
        status: false,
        message: 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  })
);

/**
 * Postman Documentation Endpoint
 * GET /docs/postman
 * 
 * Returns Postman collection example
 */
app.get('/docs/postman', (req, res) => {
  const postmanExample = {
    info: {
      name: 'Email Service API',
      description: 'Email Sending Service - Postman Collection',
    },
    request: {
      method: 'POST',
      url: 'http://localhost:3000/send-email',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        mode: 'raw',
        raw: JSON.stringify(
          {
            smtp_host: 'smtp.gmail.com',
            smtp_port: 587,
            smtp_user: 'your-email@gmail.com',
            smtp_pass: 'your-app-password',
            from_email: 'your-email@gmail.com',
            from_name: 'My Company',
            to_email: 'receiver@example.com',
            subject: 'Welcome to Email Service',
            body: '<h1>Welcome!</h1><p>This is a test email from the Email Sending Service.</p>',
          },
          null,
          2
        ),
      },
    },
  };

  res.status(200).json(postmanExample);
});

// ============================================================================
// 404 Handler
// ============================================================================

/**
 * 404 Not Found Handler
 * Handles all undefined routes
 */
app.use((req, res) => {
  logger.warn('404 - Not Found', {
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  res.status(404).json({
    status: false,
    message: 'Endpoint not found',
    path: req.path,
    method: req.method,
  });
});

// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================

/**
 * Global error handling middleware
 * Must be the last middleware
 */
app.use(errorHandler);

// ============================================================================
// SERVER STARTUP
// ============================================================================

/**
 * Start the Express server
 */
const server = app.listen(PORT, () => {
  logger.info('='.repeat(60));
  logger.info('Email Sending Service Started Successfully');
  logger.info('='.repeat(60));
  logger.info(`
  ┌─────────────────────────────────────────────────────┐
  │  Email Service is running on:                       │
  │                                                      │
  │  🚀 Server: http://localhost:${PORT}                │
  │  📝 Health Check: http://localhost:${PORT}/health    │
  │  📧 Send Email: POST http://localhost:${PORT}/send-email
  │  📚 API Docs: GET http://localhost:${PORT}/          │
  │                                                      │
  │  Environment: ${NODE_ENV}                            │
  │  Rate Limit: ${process.env.RATE_LIMIT_MAX_REQUESTS || '100'} requests/hour per IP
  │                                                      │
  └─────────────────────────────────────────────────────┘
  `);
});

/**
 * Handle server errors
 */
server.on('error', (error) => {
  logger.error('Server error', {
    error: error.message,
    code: error.code,
  });

  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
});

/**
 * Handle process termination
 */
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', {
    promise: promise,
    reason: reason,
  });
});

module.exports = app;
