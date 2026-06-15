# cURL Commands Reference

Quick reference guide for common cURL commands to test the Email Sending Service.

## Basic Commands

### Health Check

```bash
curl http://localhost:3000/health
```

**Pretty output:**
```bash
curl http://localhost:3000/health | jq .
```

### API Documentation

```bash
curl http://localhost:3000/
```

---

## Send Email Commands

### Basic Email

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
    "subject": "Hello World",
    "body": "<h1>Hello</h1><p>This is a test email.</p>"
  }'
```

### With Pretty JSON Output

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
    "subject": "Hello World",
    "body": "<h1>Hello</h1><p>This is a test email.</p>"
  }' | jq .
```

### Extract Message ID Only

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
    "subject": "Hello World",
    "body": "<h1>Hello</h1>"
  }' | jq '.messageId'
```

### Save Response to File

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
    "subject": "Hello World",
    "body": "<h1>Hello</h1>"
  }' > email_response.json
```

### Save Response with Status Code

```bash
curl -w "\n%{http_code}\n" -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_user": "your-email@gmail.com",
    "smtp_pass": "your-app-password",
    "from_email": "your-email@gmail.com",
    "from_name": "My Company",
    "to_email": "recipient@example.com",
    "subject": "Hello World",
    "body": "<h1>Hello</h1>"
  }'
```

---

## Request Data from File

### Create JSON File

```bash
cat > email_data.json << 'EOF'
{
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_user": "your-email@gmail.com",
  "smtp_pass": "your-app-password",
  "from_email": "your-email@gmail.com",
  "from_name": "My Company",
  "to_email": "recipient@example.com",
  "subject": "Hello World",
  "body": "<h1>Hello</h1>"
}
EOF
```

### Send from File

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d @email_data.json
```

---

## Verbose & Debug Output

### Verbose Output (Headers & Response)

```bash
curl -v -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_user": "your-email@gmail.com",
    "smtp_pass": "your-app-password",
    "from_email": "your-email@gmail.com",
    "from_name": "My Company",
    "to_email": "recipient@example.com",
    "subject": "Hello World",
    "body": "<h1>Hello</h1>"
  }'
```

### Include Response Headers

```bash
curl -i -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_user": "your-email@gmail.com",
    "smtp_pass": "your-app-password",
    "from_email": "your-email@gmail.com",
    "from_name": "My Company",
    "to_email": "recipient@example.com",
    "subject": "Hello World",
    "body": "<h1>Hello</h1>"
  }'
```

### Trace Network Details

```bash
curl --trace-ascii trace.txt -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_user": "your-email@gmail.com",
    "smtp_pass": "your-app-password",
    "from_email": "your-email@gmail.com",
    "from_name": "My Company",
    "to_email": "recipient@example.com",
    "subject": "Hello World",
    "body": "<h1>Hello</h1>"
  }'
```

---

## Complex HTML Emails

### Email with Complex HTML

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
    "subject": "Welcome Email",
    "body": "<html><body style=\"font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;\"><div style=\"background-color: white; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto;\"><h1 style=\"color: #333; margin-top: 0;\">Welcome!</h1><p style=\"color: #666; line-height: 1.6;\">Thank you for joining our service.</p><a href=\"https://example.com/get-started\" style=\"display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; margin-top: 20px;\">Get Started</a><hr style=\"border: none; border-top: 1px solid #ddd; margin: 20px 0;\"><p style=\"color: #999; font-size: 12px;\">© 2024 My Company. All rights reserved.</p></div></body></html>"
  }'
```

---

## Error Testing

### Invalid Email Address

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_user": "your-email@gmail.com",
    "smtp_pass": "your-app-password",
    "from_email": "invalid-email",
    "from_name": "My Company",
    "to_email": "recipient@example.com",
    "subject": "Test",
    "body": "<h1>Test</h1>"
  }'
```

### Missing Required Field

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "smtp.gmail.com",
    "to_email": "recipient@example.com",
    "subject": "Test"
  }'
```

### Invalid SMTP Port

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 99999,
    "smtp_user": "your-email@gmail.com",
    "smtp_pass": "your-app-password",
    "from_email": "your-email@gmail.com",
    "from_name": "My Company",
    "to_email": "recipient@example.com",
    "subject": "Test",
    "body": "<h1>Test</h1>"
  }'
```

### Invalid SMTP Host

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "invalid host!!!",
    "smtp_port": 587,
    "smtp_user": "your-email@gmail.com",
    "smtp_pass": "your-app-password",
    "from_email": "your-email@gmail.com",
    "from_name": "My Company",
    "to_email": "recipient@example.com",
    "subject": "Test",
    "body": "<h1>Test</h1>"
  }'
```

### Wrong SMTP Credentials

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_user": "wrong@gmail.com",
    "smtp_pass": "wrong-password",
    "from_email": "wrong@gmail.com",
    "from_name": "My Company",
    "to_email": "recipient@example.com",
    "subject": "Test",
    "body": "<h1>Test</h1>"
  }'
```

---

## Different SMTP Providers

### Gmail

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_user": "your-email@gmail.com",
    "smtp_pass": "your-app-password",
    "from_email": "your-email@gmail.com",
    "from_name": "Your Name",
    "to_email": "recipient@example.com",
    "subject": "Test",
    "body": "<h1>Test</h1>"
  }'
```

### Outlook

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "smtp.office365.com",
    "smtp_port": 587,
    "smtp_user": "your-email@outlook.com",
    "smtp_pass": "your-password",
    "from_email": "your-email@outlook.com",
    "from_name": "Your Name",
    "to_email": "recipient@example.com",
    "subject": "Test",
    "body": "<h1>Test</h1>"
  }'
```

### SendGrid

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "smtp.sendgrid.net",
    "smtp_port": 587,
    "smtp_user": "apikey",
    "smtp_pass": "SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "from_email": "your-email@example.com",
    "from_name": "Your Name",
    "to_email": "recipient@example.com",
    "subject": "Test",
    "body": "<h1>Test</h1>"
  }'
```

### AWS SES

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "email-smtp.us-east-1.amazonaws.com",
    "smtp_port": 587,
    "smtp_user": "your-username",
    "smtp_pass": "your-password",
    "from_email": "verified-email@example.com",
    "from_name": "Your Name",
    "to_email": "recipient@example.com",
    "subject": "Test",
    "body": "<h1>Test</h1>"
  }'
```

---

## Batch Email Commands

### Send Multiple Emails (Sequential)

```bash
#!/bin/bash

emails=("user1@example.com" "user2@example.com" "user3@example.com")

for email in "${emails[@]}"; do
  curl -X POST http://localhost:3000/send-email \
    -H "Content-Type: application/json" \
    -d "{
      \"smtp_host\": \"smtp.gmail.com\",
      \"smtp_port\": 587,
      \"smtp_user\": \"your-email@gmail.com\",
      \"smtp_pass\": \"your-app-password\",
      \"from_email\": \"your-email@gmail.com\",
      \"from_name\": \"My Company\",
      \"to_email\": \"$email\",
      \"subject\": \"Hello\",
      \"body\": \"<h1>Hello!</h1>\"
    }"
  
  echo "Email sent to $email"
  sleep 1
done
```

### Save as script (batch_emails.sh)

```bash
#!/bin/bash

# Create temporary JSON file for each email
for i in {1..3}; do
  cat > email_$i.json << EOF
{
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_user": "your-email@gmail.com",
  "smtp_pass": "your-app-password",
  "from_email": "your-email@gmail.com",
  "from_name": "My Company",
  "to_email": "user$i@example.com",
  "subject": "Email to User $i",
  "body": "<h1>Hello User $i</h1>"
}
EOF

  curl -X POST http://localhost:3000/send-email \
    -H "Content-Type: application/json" \
    -d @email_$i.json
  
  echo "Email sent to user$i@example.com"
  sleep 1
done
```

---

## Tips & Tricks

### Function to Simplify Commands

```bash
# Add to ~/.bashrc or ~/.zshrc

send_email() {
  local to=$1
  local subject=$2
  local body=$3
  
  curl -X POST http://localhost:3000/send-email \
    -H "Content-Type: application/json" \
    -d "{
      \"smtp_host\": \"smtp.gmail.com\",
      \"smtp_port\": 587,
      \"smtp_user\": \"your-email@gmail.com\",
      \"smtp_pass\": \"your-app-password\",
      \"from_email\": \"your-email@gmail.com\",
      \"from_name\": \"My Company\",
      \"to_email\": \"$to\",
      \"subject\": \"$subject\",
      \"body\": \"$body\"
    }"
}

# Usage:
# send_email "recipient@example.com" "Hello" "<h1>Hello World</h1>"
```

### Check Response Status

```bash
response=$(curl -s -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_user": "your-email@gmail.com",
    "smtp_pass": "your-app-password",
    "from_email": "your-email@gmail.com",
    "from_name": "My Company",
    "to_email": "recipient@example.com",
    "subject": "Test",
    "body": "<h1>Test</h1>"
  }')

status=$(echo $response | jq '.status')

if [ "$status" = "true" ]; then
  echo "✅ Email sent successfully"
  echo "Message ID: $(echo $response | jq '.messageId')"
else
  echo "❌ Failed to send email"
  echo "Error: $(echo $response | jq '.message')"
fi
```

---

## Windows Command Line

### Using PowerShell

```powershell
$body = @{
    smtp_host = "smtp.gmail.com"
    smtp_port = 587
    smtp_user = "your-email@gmail.com"
    smtp_pass = "your-app-password"
    from_email = "your-email@gmail.com"
    from_name = "My Company"
    to_email = "recipient@example.com"
    subject = "Hello"
    body = "<h1>Hello</h1>"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/send-email" `
    -Method Post `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $body
```

---

## Useful Options

### Set Custom Timeout

```bash
curl --max-time 30 -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### Show Only HTTP Status Code

```bash
curl -o /dev/null -s -w "%{http_code}\n" -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### Set Custom Headers

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -H "User-Agent: MyApp/1.0" \
  -d '{...}'
```

---

## Summary

- **Quick test**: `curl http://localhost:3000/health`
- **Send email**: Use the basic email command above
- **Debug**: Add `-v` flag for verbose output
- **Parse JSON**: Pipe output to `jq .`
- **Save response**: Use `> filename.json`
- **Error testing**: Check error test commands above

For more examples, see EXAMPLES.md
