# Installation & Setup Guide

Complete step-by-step guide for installing and configuring the Email Sending Service.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (v6 or higher) - Usually comes with Node.js
- **Git** (optional) - [Download](https://git-scm.com/)

### Verify Installation

```bash
# Check Node.js version
node --version
# Expected output: v14.0.0 or higher

# Check npm version
npm --version
# Expected output: 6.0.0 or higher
```

---

## Installation Steps

### Step 1: Clone or Download Project

**Option A: Clone from GitHub**
```bash
git clone <repository-url>
cd mail-service-nodemailer
```

**Option B: Use existing directory**
```bash
cd mail-service-nodemailer
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install
```

**Expected output:**
```
added XX packages in X.XXs
```

**Installed packages:**
- `express` - Web framework
- `nodemailer` - Email sending library
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `express-rate-limit` - Rate limiting middleware
- `helmet` - Security middleware
- `morgan` - HTTP logging
- `express-validator` - Input validation

### Step 3: Configuration

#### Create .env File

```bash
# Copy the example file
cp .env.example .env

# On Windows PowerShell:
# Copy-Item .env.example .env
```

#### Edit .env File

Open `.env` in your text editor and configure:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# SMTP Configuration (defaults)
DEFAULT_SMTP_HOST=smtp.gmail.com
DEFAULT_SMTP_PORT=587
DEFAULT_SMTP_USER=your-email@gmail.com
DEFAULT_SMTP_PASSWORD=your-app-password

# Email Configuration
DEFAULT_FROM_EMAIL=noreply@yourcompany.com
DEFAULT_FROM_NAME=Your Company Name

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# Security
ENABLE_CORS=true
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Nodemailer TLS Rejection
REJECT_UNAUTHORIZED=false
```

---

## Gmail Setup (Recommended for Testing)

Gmail is ideal for testing and small-scale operations.

### Step 1: Enable 2-Factor Authentication

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click "Security" on the left sidebar
3. Scroll down and enable "2-Step Verification"
4. Follow the on-screen instructions

### Step 2: Generate App Password

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - If you don't see this option, enable 2-Step Verification first
2. Select "Mail" and "Windows Computer" (or your device)
3. Click "Generate"
4. Copy the 16-character app password

### Step 3: Configure .env

```env
DEFAULT_SMTP_HOST=smtp.gmail.com
DEFAULT_SMTP_PORT=587
DEFAULT_SMTP_USER=your-email@gmail.com
DEFAULT_SMTP_PASSWORD=<16-character-app-password>
DEFAULT_FROM_EMAIL=your-email@gmail.com
DEFAULT_FROM_NAME=Your Name
```

---

## Other SMTP Providers Setup

### Outlook/Hotmail

```env
DEFAULT_SMTP_HOST=smtp.office365.com
DEFAULT_SMTP_PORT=587
DEFAULT_SMTP_USER=your-email@outlook.com
DEFAULT_SMTP_PASSWORD=your-password
```

### SendGrid

```env
DEFAULT_SMTP_HOST=smtp.sendgrid.net
DEFAULT_SMTP_PORT=587
DEFAULT_SMTP_USER=apikey
DEFAULT_SMTP_PASSWORD=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### AWS SES

```env
DEFAULT_SMTP_HOST=email-smtp.us-east-1.amazonaws.com
DEFAULT_SMTP_PORT=587
DEFAULT_SMTP_USER=your-username
DEFAULT_SMTP_PASSWORD=your-password
```

### Custom SMTP Server

```env
DEFAULT_SMTP_HOST=mail.yourcompany.com
DEFAULT_SMTP_PORT=587
DEFAULT_SMTP_USER=admin@yourcompany.com
DEFAULT_SMTP_PASSWORD=your-password
```

---

## Starting the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

**Requirements:**
- Nodemon must be installed (included in devDependencies)

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

### Production Mode

```bash
npm start
```

---

## Verification

### Test 1: Health Check

```bash
curl http://localhost:3000/health
```

**Expected response:**
```json
{
  "status": true,
  "message": "Email Service is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 45.123,
  "environment": "development"
}
```

### Test 2: API Documentation

```bash
curl http://localhost:3000/
```

### Test 3: Send Test Email

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

**Expected response:**
```json
{
  "status": true,
  "message": "Email sent successfully",
  "messageId": "<message-id@gmail.com>",
  "response": "250 2.0.0 OK..."
}
```

---

## Troubleshooting

### Issue: "Port 3000 is already in use"

**Solution:**
```bash
# Option 1: Change port in .env
PORT=3001

# Option 2: Find and kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :3000
kill -9 <PID>
```

### Issue: "npm: command not found"

**Solution:**
- Reinstall Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: "SMTP authentication failed"

**Solutions:**
1. Verify SMTP credentials are correct
2. For Gmail, use app password instead of account password
3. Check if account uses 2-Factor Authentication
4. Verify SMTP host and port are correct
5. Check if your SMTP account allows less secure apps

### Issue: "Cannot connect to SMTP server"

**Solutions:**
1. Verify SMTP host is reachable
2. Check firewall settings
3. Test connectivity:
   ```bash
   # Windows:
   Test-NetConnection smtp.gmail.com -Port 587
   
   # Linux/Mac:
   telnet smtp.gmail.com 587
   ```

### Issue: "Certificate validation failed"

**Solution:**
```env
# In .env, set:
REJECT_UNAUTHORIZED=false
```

### Issue: "Rate limit exceeded"

**Solution:**
- Wait before sending more emails
- Increase rate limit in .env:
  ```env
  RATE_LIMIT_MAX_REQUESTS=200
  ```

### Issue: Emails not being received

**Solutions:**
1. Check spam/junk folder
2. Verify recipient email address
3. Check email logs in terminal
4. Test with your own email address
5. Try another SMTP provider
6. Check email body encoding

---

## Development Configuration

### Enable Detailed Logging

```env
NODE_ENV=development
LOG_LEVEL=debug
```

### Configure CORS for Multiple Origins

```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://example.com
```

### Increase Rate Limit

```env
RATE_LIMIT_MAX_REQUESTS=500
RATE_LIMIT_WINDOW_MS=3600000
```

---

## Production Deployment

### Environment Variables

```bash
export NODE_ENV=production
export PORT=8080
export RATE_LIMIT_MAX_REQUESTS=100
```

### Using PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start server with PM2
pm2 start server.js --name "email-service"

# View logs
pm2 logs email-service

# Restart on reboot
pm2 startup
pm2 save
```

### Using Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

**Build and run:**
```bash
docker build -t email-service .
docker run -p 3000:3000 --env-file .env email-service
```

### Using Docker Compose

```yaml
version: '3.8'

services:
  email-service:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: unless-stopped
    environment:
      NODE_ENV: production
```

**Run:**
```bash
docker-compose up -d
```

---

## File Structure After Installation

```
mail-service-nodemailer/
├── node_modules/                 # Dependencies (created after npm install)
├── src/
│   ├── config/
│   │   └── logger.js            # Logging configuration
│   ├── middleware/
│   │   └── errorHandler.js      # Error handling middleware
│   └── utils/
│       ├── emailService.js      # Core email sending function
│       └── validation.js        # Input validation
├── server.js                     # Main application file
├── package.json                  # Dependencies list
├── package-lock.json            # Locked dependency versions
├── .env                         # Environment variables (create from .env.example)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── README.md                    # Documentation
├── INSTALLATION.md              # This file
├── EXAMPLES.md                  # Code examples
└── postman-collection.json      # Postman collection
```

---

## Next Steps

1. **Send a test email** - Use the examples in EXAMPLES.md
2. **Import Postman collection** - Use postman-collection.json
3. **Configure for production** - See Production Deployment section
4. **Read the README** - Full API documentation
5. **Review code** - Check server.js for implementation details

---

## Support

If you encounter issues:

1. Check troubleshooting section above
2. Review error messages in console
3. Check logs in terminal output
4. Verify .env configuration
5. Test SMTP credentials manually

For more help, refer to:
- [Nodemailer Documentation](https://nodemailer.com/)
- [Express.js Documentation](https://expressjs.com/)
- [SMTP Server Documentation](https://www.digitalocean.com/community/tutorials/how-to-use-smtp)
