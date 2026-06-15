# Vercel Deployment Guide

Complete guide to deploy the Email Sending Service to Vercel.

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account** - For connecting your repository
3. **Git installed** - For version control
4. **Vercel CLI** (optional) - For local testing

## Installation Methods

### Method 1: GitHub Integration (Recommended)

**Step 1: Push code to GitHub**

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Email Sending Service"

# Add GitHub remote
git remote add origin https://github.com/yourusername/mail-service-nodemailer.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Step 2: Deploy on Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"
5. Configure settings:
   - **Framework Preset**: Node.js
   - **Root Directory**: ./
   - **Build Command**: (leave empty - Node.js)
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`
6. Set environment variables:
   ```
   DEFAULT_SMTP_HOST=smtp.gmail.com
   DEFAULT_SMTP_PORT=587
   DEFAULT_SMTP_USER=your-email@gmail.com
   DEFAULT_SMTP_PASSWORD=your-app-password
   DEFAULT_FROM_EMAIL=your-email@gmail.com
   DEFAULT_FROM_NAME=Your Company
   ALLOWED_ORIGINS=https://your-domain.vercel.app
   ```
7. Click "Deploy"

---

### Method 2: Vercel CLI

**Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

**Step 2: Login to Vercel**

```bash
vercel login
```

**Step 3: Deploy**

```bash
vercel
```

**Step 4: Follow prompts:**
- Link to existing project? No
- Set up and deploy? Yes
- Which scope? Select your account
- Project name? mail-service-nodemailer
- Detected location of code? ./
- Want to modify settings? Yes
- Build Command: (leave blank)
- Output Directory: (leave blank)
- Development Command: npm run dev

**Step 5: Add environment variables**

```bash
vercel env add DEFAULT_SMTP_HOST
vercel env add DEFAULT_SMTP_PORT
vercel env add DEFAULT_SMTP_USER
vercel env add DEFAULT_SMTP_PASSWORD
vercel env add DEFAULT_FROM_EMAIL
vercel env add DEFAULT_FROM_NAME
vercel env add ALLOWED_ORIGINS
```

**Step 6: Redeploy**

```bash
vercel --prod
```

---

### Method 3: Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..."
3. Select "Project"
4. Import from GitHub/GitLab
5. Select repository
6. Click "Import"
7. Configure and deploy

---

## Environment Variables

### Add via Dashboard

1. Go to project settings
2. Click "Environment Variables"
3. Add each variable:

| Variable | Value |
|----------|-------|
| `DEFAULT_SMTP_HOST` | smtp.gmail.com |
| `DEFAULT_SMTP_PORT` | 587 |
| `DEFAULT_SMTP_USER` | your-email@gmail.com |
| `DEFAULT_SMTP_PASSWORD` | your-app-password |
| `DEFAULT_FROM_EMAIL` | your-email@gmail.com |
| `DEFAULT_FROM_NAME` | Your Company |
| `ALLOWED_ORIGINS` | https://your-domain.vercel.app |
| `RATE_LIMIT_MAX_REQUESTS` | 100 |
| `NODE_ENV` | production |

### Add via CLI

```bash
vercel env add DEFAULT_SMTP_HOST smtp.gmail.com
vercel env add DEFAULT_SMTP_PORT 587
vercel env add DEFAULT_SMTP_USER your-email@gmail.com
vercel env add DEFAULT_SMTP_PASSWORD your-app-password
vercel env add DEFAULT_FROM_EMAIL your-email@gmail.com
vercel env add DEFAULT_FROM_NAME "Your Company"
vercel env add ALLOWED_ORIGINS https://your-domain.vercel.app
vercel env add RATE_LIMIT_MAX_REQUESTS 100
vercel env add NODE_ENV production
```

---

## Configuration Files

### vercel.json

Already included in the project. Key settings:

```json
{
  "version": 2,
  "name": "mail-service-nodemailer",
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "regions": ["iad1"]
}
```

### .vercelignore

Already included. Excludes:
- Documentation files
- node_modules
- Environment files
- IDE configurations

---

## Testing Deployment

### Health Check

```bash
curl https://your-project.vercel.app/health
```

**Expected response:**
```json
{
  "status": true,
  "message": "Email Service is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 45.123,
  "environment": "production"
}
```

### Send Test Email

```bash
curl -X POST https://your-project.vercel.app/send-email \
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
    "body": "<h1>Hello from Vercel!</h1>"
  }'
```

---

## Custom Domain

### Add Custom Domain

1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS setup instructions

### Update CORS Settings

After adding custom domain, update environment variable:

```bash
vercel env add ALLOWED_ORIGINS https://your-custom-domain.com
```

Then redeploy:

```bash
vercel --prod
```

---

## Monitoring & Logs

### View Logs

```bash
# View recent logs
vercel logs <url>

# View live logs
vercel logs <url> --follow
```

### Monitoring in Dashboard

1. Go to project dashboard
2. Click "Analytics"
3. View:
   - Function metrics
   - Request count
   - Error rates
   - Performance

---

## Troubleshooting

### Issue: Build fails

**Check logs:**
```bash
vercel logs your-project.vercel.app
```

**Common causes:**
- Missing dependencies: Run `npm install` locally
- Syntax errors: Check server.js
- Environment variables: Verify all required vars are set

### Issue: Email not sending

**Check:**
1. Environment variables are set correctly
2. SMTP credentials are valid
3. Sender domain has DKIM/SPF records
4. Gmail: Using app password, not account password

**Debug:**
```bash
curl -v https://your-project.vercel.app/send-email \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### Issue: Rate limiting errors

**Solution:**
Increase rate limit in environment variables:
```bash
vercel env add RATE_LIMIT_MAX_REQUESTS 500
```

### Issue: CORS errors

**Check:**
1. ALLOWED_ORIGINS environment variable
2. Request origin matches allowed origins
3. Update after changing origins

### Issue: Timeout errors

**Vercel timeout:** 60 seconds for Hobby plan
- Reduce email batch size
- Check SMTP server response times
- Consider upgrading to Pro plan (300 seconds)

---

## Best Practices

✓ Use GitHub for version control  
✓ Keep sensitive data in environment variables  
✓ Monitor logs regularly  
✓ Set up custom domain for production  
✓ Use production SMTP credentials  
✓ Test thoroughly before production  
✓ Set up alerts for errors  
✓ Regular backups of configuration  
✓ Use PRs for testing before deployment  

---

## Vercel Pricing

| Plan | Cost | Requests/Month | Duration | Features |
|------|------|----------------|----------|----------|
| Hobby | Free | Included | 60s | Good for testing |
| Pro | $20/mo | Included | 300s | Production use |
| Enterprise | Custom | Custom | Custom | Advanced features |

For email service: **Pro plan recommended** for production

---

## Optimization Tips

### 1. Node.js Version

Check/set Node.js version:

```json
{
  "engines": {
    "node": "18.x"
  }
}
```

### 2. Memory Optimization

The service is lightweight and works well within Vercel's limits.

### 3. Connection Pooling

Already implemented in emailService.js for better performance.

### 4. Caching Headers

Already configured via Helmet middleware.

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] All environment variables set
- [ ] vercel.json configured
- [ ] .vercelignore configured
- [ ] Health check working
- [ ] Send email test successful
- [ ] Custom domain configured (if needed)
- [ ] Monitoring set up
- [ ] Backup of credentials stored safely

---

## CI/CD Setup

### Automatic Deployments

Vercel automatically deploys on:
- Push to `main` branch
- Merge pull requests
- Deploy from dashboard

### Preview Deployments

Vercel creates preview URLs for:
- Pull requests
- Branch deployments
- Manual deployments

### Custom Deployment Rules

Configure in vercel.json:

```json
{
  "deploymentBranches": ["main", "production"]
}
```

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Status**: https://www.vercelstatus.com/
- **Community**: https://github.com/vercel/vercel/discussions
- **Email Support**: support@vercel.com (Pro plan)

---

## Post-Deployment

### 1. Update API Calls

Update all API calls from `localhost:3000` to:
```
https://your-project.vercel.app
```

### 2. Configure Webhooks

If needed, set up webhooks to your services.

### 3. Set Up Monitoring

Monitor email delivery via logs and analytics.

### 4. Document Deployment

Update README with Vercel deployment info.

---

**Your Email Service is now live on Vercel!** 🚀
