# Email Service - Detailed Examples

Complete examples for using the Email Sending Service in various scenarios.

## Table of Contents

1. [cURL Examples](#curl-examples)
2. [JavaScript/Node.js Examples](#javascriptnodejs-examples)
3. [Python Examples](#python-examples)
4. [Advanced Scenarios](#advanced-scenarios)

---

## cURL Examples

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
    "subject": "Hello",
    "body": "<h1>Hello World</h1>"
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
    "subject": "Hello",
    "body": "<h1>Hello World</h1>"
  }' | jq .
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
    "subject": "Hello",
    "body": "<h1>Hello World</h1>"
  }' > response.json
```

### With Verbose Output

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
    "subject": "Hello",
    "body": "<h1>Hello World</h1>"
  }'
```

### Check Response Headers

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
    "subject": "Hello",
    "body": "<h1>Hello World</h1>"
  }'
```

### Complex HTML Email with cURL

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
    "body": "<html><body><h1>Welcome!</h1><p>Thank you for joining us.</p></body></html>"
  }' | jq '.messageId'
```

### Using Data File

```bash
# Create data.json
cat > data.json << 'EOF'
{
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_user": "your-email@gmail.com",
  "smtp_pass": "your-app-password",
  "from_email": "your-email@gmail.com",
  "from_name": "My Company",
  "to_email": "recipient@example.com",
  "subject": "Hello",
  "body": "<h1>Hello World</h1>"
}
EOF

# Send request with data from file
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d @data.json
```

---

## JavaScript/Node.js Examples

### Using Fetch API

```javascript
// Basic fetch example
async function sendEmailWithFetch() {
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
      to_email: 'recipient@example.com',
      subject: 'Welcome',
      body: '<h1>Welcome!</h1>',
    }),
  });

  const data = await response.json();
  return data;
}

// Usage
sendEmailWithFetch()
  .then(response => {
    if (response.status) {
      console.log('Email sent! ID:', response.messageId);
    } else {
      console.error('Failed:', response.message);
    }
  })
  .catch(error => console.error('Error:', error));
```

### Using Axios

```javascript
const axios = require('axios');

async function sendEmailWithAxios() {
  try {
    const response = await axios.post('http://localhost:3000/send-email', {
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_user: 'your-email@gmail.com',
      smtp_pass: 'your-app-password',
      from_email: 'your-email@gmail.com',
      from_name: 'My Company',
      to_email: 'recipient@example.com',
      subject: 'Welcome',
      body: '<h1>Welcome!</h1>',
    });

    console.log('Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

sendEmailWithAxios();
```

### Error Handling

```javascript
async function sendEmailWithErrorHandling() {
  try {
    const response = await axios.post('http://localhost:3000/send-email', {
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_user: 'your-email@gmail.com',
      smtp_pass: 'your-app-password',
      from_email: 'your-email@gmail.com',
      from_name: 'My Company',
      to_email: 'recipient@example.com',
      subject: 'Welcome',
      body: '<h1>Welcome!</h1>',
    });

    if (response.data.status) {
      console.log('✅ Email sent successfully');
      console.log('Message ID:', response.data.messageId);
      return response.data;
    } else {
      console.log('❌ Email failed to send');
      console.log('Error:', response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      console.error('HTTP Error:', error.response.status);
      console.error('Message:', error.response.data.message);
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server');
    } else {
      // Request setup error
      console.error('Error:', error.message);
    }
    throw error;
  }
}
```

### Sending Batch Emails

```javascript
const axios = require('axios');

async function sendBatchEmails(recipients) {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const response = await axios.post('http://localhost:3000/send-email', {
        smtp_host: 'smtp.gmail.com',
        smtp_port: 587,
        smtp_user: 'your-email@gmail.com',
        smtp_pass: 'your-app-password',
        from_email: 'your-email@gmail.com',
        from_name: 'My Company',
        to_email: recipient.email,
        subject: recipient.subject,
        body: recipient.body,
      });

      results.push({
        email: recipient.email,
        status: 'success',
        messageId: response.data.messageId,
      });
      
      console.log(`✅ Email sent to ${recipient.email}`);
    } catch (error) {
      results.push({
        email: recipient.email,
        status: 'failed',
        error: error.response?.data?.message || error.message,
      });
      
      console.log(`❌ Failed to send email to ${recipient.email}`);
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

// Usage
const recipients = [
  {
    email: 'user1@example.com',
    subject: 'Welcome',
    body: '<h1>Welcome User 1!</h1>',
  },
  {
    email: 'user2@example.com',
    subject: 'Welcome',
    body: '<h1>Welcome User 2!</h1>',
  },
];

sendBatchEmails(recipients)
  .then(results => {
    console.log('Batch results:', results);
  })
  .catch(error => console.error('Batch error:', error));
```

### Using Nodemailer Directly in Your App

```javascript
const { sendMail } = require('./src/utils/emailService');

// In your application code
async function notifyUser(user) {
  const result = await sendMail(
    {
      host: 'smtp.gmail.com',
      port: 587,
      user: 'your-email@gmail.com',
      pass: 'your-app-password',
      from: 'noreply@yourcompany.com',
      secure: false,
      rejectUnauthorized: false,
    },
    user.email,
    'Welcome to Our Service',
    `<h1>Hello ${user.name}</h1><p>Welcome to our service!</p>`,
    null,
    []
  );

  if (result.success) {
    console.log('Email sent to', user.email, 'with ID:', result.messageId);
  } else {
    console.error('Failed to send email:', result.error);
  }
}
```

---

## Python Examples

### Basic Request with Requests

```python
import requests
import json

def send_email_with_requests():
    url = 'http://localhost:3000/send-email'
    
    payload = {
        'smtp_host': 'smtp.gmail.com',
        'smtp_port': 587,
        'smtp_user': 'your-email@gmail.com',
        'smtp_pass': 'your-app-password',
        'from_email': 'your-email@gmail.com',
        'from_name': 'My Company',
        'to_email': 'recipient@example.com',
        'subject': 'Welcome',
        'body': '<h1>Welcome!</h1>'
    }
    
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        print(json.dumps(data, indent=2))
        return data
    except requests.exceptions.RequestException as e:
        print(f'Error: {e}')
        return None

send_email_with_requests()
```

### With Error Handling

```python
import requests
import json

def send_email_with_error_handling():
    url = 'http://localhost:3000/send-email'
    
    payload = {
        'smtp_host': 'smtp.gmail.com',
        'smtp_port': 587,
        'smtp_user': 'your-email@gmail.com',
        'smtp_pass': 'your-app-password',
        'from_email': 'your-email@gmail.com',
        'from_name': 'My Company',
        'to_email': 'recipient@example.com',
        'subject': 'Welcome',
        'body': '<h1>Welcome!</h1>'
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        if data.get('status'):
            print(f"✅ Email sent successfully!")
            print(f"Message ID: {data.get('messageId')}")
            return True
        else:
            print(f"❌ Email failed: {data.get('message')}")
            return False
            
    except requests.exceptions.Timeout:
        print('❌ Request timed out')
    except requests.exceptions.ConnectionError:
        print('❌ Failed to connect to server')
    except requests.exceptions.HTTPError as e:
        print(f'❌ HTTP Error: {e.response.status_code}')
    except Exception as e:
        print(f'❌ Error: {str(e)}')
        return False

send_email_with_error_handling()
```

### Batch Email Sending

```python
import requests
import time

def send_batch_emails(recipients):
    url = 'http://localhost:3000/send-email'
    results = []
    
    for recipient in recipients:
        payload = {
            'smtp_host': 'smtp.gmail.com',
            'smtp_port': 587,
            'smtp_user': 'your-email@gmail.com',
            'smtp_pass': 'your-app-password',
            'from_email': 'your-email@gmail.com',
            'from_name': 'My Company',
            'to_email': recipient['email'],
            'subject': recipient['subject'],
            'body': recipient['body']
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('status'):
                results.append({
                    'email': recipient['email'],
                    'status': 'success',
                    'message_id': data.get('messageId')
                })
                print(f"✅ Email sent to {recipient['email']}")
            else:
                results.append({
                    'email': recipient['email'],
                    'status': 'failed',
                    'error': data.get('message')
                })
                print(f"❌ Failed to send email to {recipient['email']}")
        
        except Exception as e:
            results.append({
                'email': recipient['email'],
                'status': 'error',
                'error': str(e)
            })
            print(f"❌ Error sending to {recipient['email']}: {e}")
        
        # Delay to avoid rate limiting
        time.sleep(1)
    
    return results

# Usage
recipients = [
    {
        'email': 'user1@example.com',
        'subject': 'Welcome',
        'body': '<h1>Welcome User 1!</h1>'
    },
    {
        'email': 'user2@example.com',
        'subject': 'Welcome',
        'body': '<h1>Welcome User 2!</h1>'
    }
]

results = send_batch_emails(recipients)
print("\nBatch Results:")
print(results)
```

### Using Class Structure

```python
import requests
from typing import Dict, Optional
import json

class EmailServiceClient:
    def __init__(self, base_url: str = 'http://localhost:3000'):
        self.base_url = base_url
        self.endpoint = f'{base_url}/send-email'
    
    def send_email(
        self,
        smtp_host: str,
        smtp_port: int,
        smtp_user: str,
        smtp_pass: str,
        from_email: str,
        from_name: str,
        to_email: str,
        subject: str,
        body: str
    ) -> Optional[Dict]:
        """Send an email via the service"""
        
        payload = {
            'smtp_host': smtp_host,
            'smtp_port': smtp_port,
            'smtp_user': smtp_user,
            'smtp_pass': smtp_pass,
            'from_email': from_email,
            'from_name': from_name,
            'to_email': to_email,
            'subject': subject,
            'body': body
        }
        
        try:
            response = requests.post(self.endpoint, json=payload, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f'Error: {e}')
            return None
    
    def health_check(self) -> bool:
        """Check if service is healthy"""
        try:
            response = requests.get(f'{self.base_url}/health', timeout=5)
            return response.status_code == 200
        except:
            return False

# Usage
client = EmailServiceClient()

if client.health_check():
    print("✅ Service is healthy")
    
    result = client.send_email(
        smtp_host='smtp.gmail.com',
        smtp_port=587,
        smtp_user='your-email@gmail.com',
        smtp_pass='your-app-password',
        from_email='your-email@gmail.com',
        from_name='My Company',
        to_email='recipient@example.com',
        subject='Welcome',
        body='<h1>Welcome!</h1>'
    )
    
    if result and result.get('status'):
        print(f"✅ Email sent with ID: {result.get('messageId')}")
    else:
        print(f"❌ Failed to send email")
else:
    print("❌ Service is not available")
```

---

## Advanced Scenarios

### Email Templates

```javascript
// Create a template function
function getWelcomeEmailTemplate(userName) {
  return `
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      <div style="background-color: white; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; margin-top: 0;">Welcome to My Company, ${userName}!</h1>
        
        <p style="color: #666; line-height: 1.6;">
          We're excited to have you join our community. Here's what you can do next:
        </p>
        
        <ol style="color: #666; line-height: 1.8;">
          <li>Complete your profile</li>
          <li>Browse our features</li>
          <li>Connect with other users</li>
        </ol>
        
        <a href="https://example.com/get-started" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; margin-top: 20px;">Get Started</a>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="color: #999; font-size: 12px;">
          © 2024 My Company. All rights reserved.<br>
          123 Main St, City, State 12345
        </p>
      </div>
    </body>
    </html>
  `;
}

// Use the template
async function sendWelcomeEmail(userName, userEmail) {
  const response = await axios.post('http://localhost:3000/send-email', {
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_user: 'your-email@gmail.com',
    smtp_pass: 'your-app-password',
    from_email: 'your-email@gmail.com',
    from_name: 'My Company',
    to_email: userEmail,
    subject: `Welcome to My Company, ${userName}!`,
    body: getWelcomeEmailTemplate(userName),
  });
  
  return response.data;
}
```

### Rate Limiting Handling

```javascript
async function sendEmailWithRetry(emailData, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post('http://localhost:3000/send-email', emailData, {
        timeout: 10000,
      });
      
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (error.response?.status === 429) {
        // Rate limited, wait and retry
        const retryAfter = error.response.headers['retry-after'] || Math.pow(2, attempt);
        console.log(`Rate limited. Retrying in ${retryAfter}s...`);
        
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      } else if (attempt < maxRetries) {
        // Other error, retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      } else {
        // Last attempt failed
        throw error;
      }
    }
  }
}
```

---

## Configuration Examples

### Different SMTP Providers

#### Gmail
```json
{
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_user": "your-email@gmail.com",
  "smtp_pass": "your-app-password"
}
```

#### Outlook/Hotmail
```json
{
  "smtp_host": "smtp.office365.com",
  "smtp_port": 587,
  "smtp_user": "your-email@outlook.com",
  "smtp_pass": "your-password"
}
```

#### SendGrid
```json
{
  "smtp_host": "smtp.sendgrid.net",
  "smtp_port": 587,
  "smtp_user": "apikey",
  "smtp_pass": "SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

#### AWS SES
```json
{
  "smtp_host": "email-smtp.us-east-1.amazonaws.com",
  "smtp_port": 587,
  "smtp_user": "your-username",
  "smtp_pass": "your-password"
}
```

---

## Tips and Best Practices

1. **Always handle errors** - Network issues and SMTP errors can occur
2. **Use rate limiting** - Don't exceed your SMTP server's limits
3. **Test with yourself first** - Send test emails to your own address
4. **Use templates** - Create reusable email templates
5. **Log responses** - Keep track of message IDs for debugging
6. **Implement retry logic** - Handle temporary failures gracefully
7. **Validate emails** - Use email validation before sending
8. **Keep credentials secure** - Never hardcode SMTP passwords
9. **Monitor service health** - Check the health endpoint periodically
10. **Batch with delays** - Add delays between batch emails to avoid rate limiting
