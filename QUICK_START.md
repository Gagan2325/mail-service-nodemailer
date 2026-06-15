# Quick Start Guide

Get the Email Sending Service up and running in 5 minutes.

## 1️⃣ Install Dependencies

```bash
npm install
```

## 2️⃣ Configure Environment

```bash
# Copy example file
cp .env.example .env

# Edit .env with your SMTP credentials
# nano .env (or use your editor)
```

**Example .env:**
```env
PORT=3000
DEFAULT_SMTP_HOST=smtp.gmail.com
DEFAULT_SMTP_PORT=587
DEFAULT_SMTP_USER=your-email@gmail.com
DEFAULT_SMTP_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
DEFAULT_FROM_NAME=My Company
```

## 3️⃣ Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## 4️⃣ Test Email Service

### Health Check
```bash
curl http://localhost:3000/health
```

### Send Email
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
    "to_email": "recipient@example.com",
    "subject": "Test Email",
    "body": "<h1>Hello World</h1>"
  }'
```

## 📚 API Endpoint

```
POST /send-email
```

## 📋 Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `smtp_host` | string | SMTP server hostname |
| `smtp_port` | number | SMTP server port (587 or 465) |
| `smtp_user` | string | SMTP username |
| `smtp_pass` | string | SMTP password |
| `from_email` | string | Sender email address |
| `from_name` | string | Sender display name |
| `to_email` | string | Recipient email address |
| `subject` | string | Email subject |
| `body` | string | Email body (HTML supported) |

## ✅ Success Response

```json
{
  "status": true,
  "message": "Email sent successfully",
  "messageId": "<message-id@gmail.com>"
}
```

## ❌ Error Response

```json
{
  "status": false,
  "message": "Error description"
}
```

## 🔧 Gmail Setup (5 minutes)

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select Mail and device
3. Click Generate
4. Copy the password to .env

## 📁 Documentation

- [Full Documentation](README.md)
- [Installation Guide](INSTALLATION.md)
- [Code Examples](EXAMPLES.md)
- [Postman Collection](postman-collection.json)

## 🆘 Troubleshooting

**Error: "Port 3000 in use"**
```bash
PORT=3001 npm start
```

**Error: "SMTP authentication failed"**
- Verify credentials in .env
- Use Gmail app password (not account password)
- Enable 2-Step Verification on Gmail

**Error: "npm: command not found"**
- Install Node.js from [nodejs.org](https://nodejs.org/)

## 📝 JavaScript Example

```javascript
const response = await fetch('http://localhost:3000/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_user: 'your-email@gmail.com',
    smtp_pass: 'your-app-password',
    from_email: 'your-email@gmail.com',
    from_name: 'My Company',
    to_email: 'recipient@example.com',
    subject: 'Hello',
    body: '<h1>Welcome!</h1>'
  })
});

const data = await response.json();
console.log(data);
```

## 🚀 Ready to Go!

Your email service is now ready to send emails. See [Examples](EXAMPLES.md) for more use cases.
