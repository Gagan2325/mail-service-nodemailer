# Email Sending Service - Node.js & Nodemailer

A production-ready Email Sending Service built with Node.js, Express.js, and Nodemailer. This service provides a REST API endpoint for sending emails with dynamic SMTP configuration.

## 📋 Features

✅ **Express.js Framework** - Fast and minimalist web framework  
✅ **Nodemailer Integration** - Reliable email sending via SMTP  
✅ **Dynamic SMTP Configuration** - Configure SMTP per request  
✅ **HTML Email Support** - Send richly formatted HTML emails  
✅ **Email Validation** - Validate email formats and SMTP settings  
✅ **CORS Support** - Cross-origin resource sharing enabled  
✅ **Request Logging** - HTTP request logging with Morgan  
✅ **Rate Limiting** - 100 requests per hour per IP  
✅ **Security Middleware** - Helmet for secure HTTP headers  
✅ **Environment Variables** - Configuration via .env file  
✅ **SSL/TLS Support** - Secure SMTP connections  
✅ **Error Handling** - Graceful error handling with proper HTTP status codes  
✅ **Message ID Tracking** - Track sent emails with message IDs  
✅ **Async/Await** - Modern async programming patterns  
✅ **Production Ready** - Best practices and error handling  

## 📁 Project Structure

```
mail-service-nodemailer/
├── server.js                  # Main Express server and routes
├── package.json              # Project dependencies
├── .env.example              # Environment variables example
├── .gitignore               # Git ignore file
├── README.md                # This file
└── src/
    ├── config/
    │   └── logger.js        # Logging configuration
    ├── middleware/
    │   └── errorHandler.js  # Global error handler
    └── utils/
        ├── emailService.js  # Reusable email sending function
        └── validation.js    # Input validation utilities
```

## 🚀 Quick Start

### 1. Installation

**Prerequisites:**
- Node.js (v14 or higher)
- npm (v6 or higher)

**Steps:**

```bash
# Clone or navigate to the project directory
cd mail-service-nodemailer

# Install dependencies
npm install
```

### 2. Configuration

**Create .env file from example:**

```bash
# Copy the example file
cp .env.example .env

# Edit .env file with your configuration
# nano .env  (or use your preferred editor)
```

**Example .env configuration:**

```env
PORT=3000
NODE_ENV=development

# Optional: Default SMTP (can be overridden per request)
DEFAULT_SMTP_HOST=smtp.gmail.com
DEFAULT_SMTP_PORT=587
DEFAULT_SMTP_USER=your-email@gmail.com
DEFAULT_SMTP_PASSWORD=your-app-password

DEFAULT_FROM_EMAIL=noreply@yourcompany.com
DEFAULT_FROM_NAME=Your Company Name

RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=100

ENABLE_CORS=true
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

REJECT_UNAUTHORIZED=false
```

### 3. Start the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

**Expected output:**

```
============================================================
Email Sending Service Started Successfully
============================================================

  ┌─────────────────────────────────────────────────────┐
  │  Email Service is running on:                       │
  │                                                      │
  │  🚀 Server: http://localhost:3000                   │
  │  📝 Health Check: http://localhost:3000/health      │
  │  📧 Send Email: POST http://localhost:3000/send-email
  │  📚 API Docs: GET http://localhost:3000/            │
  │                                                      │
  │  Environment: development                           │
  │  Rate Limit: 100 requests/hour per IP               │
  │                                                      │
  └─────────────────────────────────────────────────────┘
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000
```

### Health Check Endpoint

**Check if the service is running**

```http
GET /health
```

**Response:**

```json
{
  "status": true,
  "message": "Email Service is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 124.567,
  "environment": "development"
}
```

### API Documentation Endpoint

**Get API information and endpoints**

```http
GET /
```

**Response:**

```json
{
  "name": "Email Sending Service",
  "version": "1.0.0",
  "description": "Production-ready Email Sending Service using Express.js and Nodemailer",
  "endpoints": {
    "health": {
      "method": "GET",
      "path": "/health",
      "description": "Check if service is running"
    },
    "sendEmail": {
      "method": "POST",
      "path": "/send-email",
      "description": "Send an email with SMTP configuration",
      "rateLimit": "100 requests per hour per IP"
    }
  }
}
```

### Send Email Endpoint

**Send an email via SMTP**

```http
POST /send-email
Content-Type: application/json
```

**Request Body:**

```json
{
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_user": "your-email@gmail.com",
  "smtp_pass": "your-app-password",
  "from_email": "your-email@gmail.com",
  "from_name": "My Company",
  "to_email": "receiver@example.com",
  "subject": "Welcome to Email Service",
  "body": "<h1>Hello World</h1><p>This is a test email.</p>"
}
```

**Response (Success - HTTP 200):**

```json
{
  "status": true,
  "message": "Email sent successfully",
  "messageId": "<message-id@gmail.com>",
  "response": "250 2.0.0 OK..."
}
```

**Response (Error - HTTP 400/401/503/500):**

```json
{
  "status": false,
  "message": "SMTP authentication failed. Please verify your credentials.",
  "error": "Invalid login: 535-5.7.8 Username and password not accepted"
}
```

## 📝 Usage Examples

### cURL Example

**Basic email sending:**

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_user": "your-email@gmail.com",
    "smtp_pass": "your-app-password",
    "from_email": "your-email@gmail.com",
    "from_name": "My Company",
    "to_email": "receiver@example.com",
    "subject": "Test Email",
    "body": "<h1>Hello!</h1><p>This is a test email.</p>"
  }'
```

**With formatted output:**

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_user": "your-email@gmail.com",
    "smtp_pass": "your-app-password",
    "from_email": "your-email@gmail.com",
    "from_name": "My Company",
    "to_email": "receiver@example.com",
    "subject": "Test Email",
    "body": "<h1>Hello!</h1><p>This is a test email.</p>"
  }' | python -m json.tool
```

### JavaScript/Fetch Example

```javascript
// Using Fetch API
async function sendEmail() {
  try {
    const response = await fetch('http://localhost:3000/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        smtp_host: 'smtp.gmail.com',
        smtp_port: 587,
        smtp_user: 'your-email@gmail.com',
        smtp_pass: 'your-app-password',
        from_email: 'your-email@gmail.com',
        from_name: 'My Company',
        to_email: 'receiver@example.com',
        subject: 'Test Email',
        body: '<h1>Hello World!</h1>',
      }),
    });

    const data = await response.json();
    console.log(data);

    if (data.status) {
      console.log('Email sent! Message ID:', data.messageId);
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

sendEmail();
```

### Node.js Example (Using axios)

```javascript
const axios = require('axios');

async function sendEmail() {
  try {
    const response = await axios.post('http://localhost:3000/send-email', {
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_user: 'your-email@gmail.com',
      smtp_pass: 'your-app-password',
      from_email: 'your-email@gmail.com',
      from_name: 'My Company',
      to_email: 'receiver@example.com',
      subject: 'Welcome!',
      body: '<h1>Welcome to our service!</h1>',
    });

    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

sendEmail();
```

### Python Example (Using requests)

```python
import requests
import json

url = 'http://localhost:3000/send-email'

payload = {
    'smtp_host': 'smtp.gmail.com',
    'smtp_port': 587,
    'smtp_user': 'your-email@gmail.com',
    'smtp_pass': 'your-app-password',
    'from_email': 'your-email@gmail.com',
    'from_name': 'My Company',
    'to_email': 'receiver@example.com',
    'subject': 'Test Email',
    'body': '<h1>Hello World!</h1>'
}

headers = {
    'Content-Type': 'application/json'
}

try:
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(response.json())
except requests.exceptions.RequestException as e:
    print(f'Error: {e}')
```

## 🔌 Postman Collection

### Import into Postman

1. Open Postman
2. Click "Import" button
3. Select "Raw text"
4. Paste the following JSON

```json
{
  "info": {
    "name": "Email Service API",
    "description": "Email Sending Service Collection"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/health"
      }
    },
    {
      "name": "Send Email",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": "http://localhost:3000/send-email",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"smtp_host\": \"smtp.gmail.com\",\n  \"smtp_port\": 587,\n  \"smtp_user\": \"your-email@gmail.com\",\n  \"smtp_pass\": \"your-app-password\",\n  \"from_email\": \"your-email@gmail.com\",\n  \"from_name\": \"My Company\",\n  \"to_email\": \"receiver@example.com\",\n  \"subject\": \"Welcome to Email Service\",\n  \"body\": \"<h1>Welcome!</h1><p>This is a test email.</p>\"\n}"
        }
      }
    }
  ]
}
```

## 🔒 Security Considerations

### SMTP Password Security

⚠️ **IMPORTANT:** Never commit `.env` file to version control!

**Best Practices:**
- Store SMTP passwords in `.env` file (included in `.gitignore`)
- Use environment-specific credentials
- Rotate passwords regularly
- Use app passwords for Gmail (not your main password)
- Consider using OAuth2 for production

### Gmail Setup (App Password)

1. Enable 2-Factor Authentication on your Google Account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Use this password in SMTP configuration

### Rate Limiting

The service includes built-in rate limiting:
- **Default:** 100 requests per hour per IP
- **Configure:** Edit `RATE_LIMIT_MAX_REQUESTS` in `.env`

### CORS Configuration

Control which origins can access the API:

```env
# Allow specific origins
ALLOWED_ORIGINS=http://localhost:3000,https://example.com

# Or allow all (not recommended for production)
ENABLE_CORS=true
```

## 🐛 Error Handling

### Common Errors and Solutions

**Error: "SMTP authentication failed"**
- Verify SMTP credentials
- Check if 2FA is enabled (use app password for Gmail)
- Ensure SMTP host and port are correct

**Error: "Cannot connect to SMTP server"**
- Check SMTP host and port
- Verify firewall allows outbound connection
- Test connectivity: `telnet smtp.example.com 587`

**Error: "Rate limit exceeded"**
- Wait before sending more emails
- Check `X-RateLimit-Retry-After` header
- Increase rate limit in `.env` for more requests

**Error: "Invalid email format"**
- Check recipient email address format
- Ensure email contains `@` and domain

## 📊 Logging

Logs are printed to console and include:
- Request details (IP, timestamp)
- Email sending status
- Error information
- Performance metrics (duration)

**Log Levels:**
- `[INFO]` - General information
- `[ERROR]` - Error messages
- `[WARN]` - Warning messages
- `[DEBUG]` - Debug information (development only)

## 🎯 Performance Tips

1. **Connection Pooling:** The service uses Nodemailer's connection pooling for better performance
2. **Rate Limiting:** Adjust based on your SMTP server limits
3. **Timeout:** Increase timeout for slow SMTP servers
4. **SSL/TLS:** Use secure connections (port 465 or 587 with STARTTLS)

## 📦 Reusable Email Function

The `sendMail()` function can be imported and used anywhere:

```javascript
const { sendMail } = require('./src/utils/emailService');

// Use in your code
const result = await sendMail(
  {
    host: 'smtp.example.com',
    port: 587,
    user: 'email@example.com',
    pass: 'password',
    from: 'noreply@example.com',
    secure: false,
    rejectUnauthorized: false,
  },
  'recipient@example.com',
  'Email Subject',
  '<h1>HTML Content</h1>'
);

console.log(result);
// { success: true, messageId: '...', response: '...', error: null }
```

## 🧪 Testing

### Test Health Check

```bash
curl http://localhost:3000/health
```

### Test Email Sending

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_user": "your-email@gmail.com",
    "smtp_pass": "your-app-password",
    "from_email": "your-email@gmail.com",
    "from_name": "Test",
    "to_email": "your-email@gmail.com",
    "subject": "Test Email",
    "body": "<h1>Test</h1>"
  }'
```

## 📋 Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | Environment mode |
| `RATE_LIMIT_WINDOW_MS` | 3600000 | Rate limit window (ms) |
| `RATE_LIMIT_MAX_REQUESTS` | 100 | Max requests per window |
| `ENABLE_CORS` | true | Enable CORS |
| `ALLOWED_ORIGINS` | localhost:3000 | Comma-separated allowed origins |
| `REJECT_UNAUTHORIZED` | false | Reject unauthorized TLS certs |

## 🚀 Deployment

### Heroku

```bash
# Create Procfile
echo "web: npm start" > Procfile

# Deploy
git push heroku main
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Environment Variables in Production

Set environment variables before starting:

```bash
export NODE_ENV=production
export PORT=3000
export RATE_LIMIT_MAX_REQUESTS=50

npm start
```

## 📞 Support

For issues and feature requests, please open an issue on GitHub.

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/)
- [Nodemailer](https://nodemailer.com/)
- [Morgan](https://github.com/expressjs/morgan)
- [Helmet](https://helmetjs.github.io/)
- [express-rate-limit](https://github.com/nfriedly/express-rate-limit)

---

**Made with ❤️ for developers**
