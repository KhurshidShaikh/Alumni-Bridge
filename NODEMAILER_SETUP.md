# Nodemailer Setup Guide for AlumniBridge

## Gmail Configuration (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Enable 2-Factor Authentication

### Step 2: Generate App Password
1. Go to Google Account → Security → 2-Step Verification
2. Scroll down to "App passwords"
3. Select "Mail" and your device
4. Copy the generated 16-character password

### Step 3: Update Environment Variables
Add these to your `.env` file:

```env
# Email Configuration for Nodemailer
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_16_character_app_password
FRONTEND_URL=http://localhost:5173
```

## Alternative Email Providers

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_password
```

### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your_email@yahoo.com
EMAIL_PASS=your_app_password
```

### Custom SMTP Server
```env
EMAIL_HOST=your_smtp_server.com
EMAIL_PORT=587
EMAIL_USER=your_username
EMAIL_PASS=your_password
```

## Testing Email Configuration

Create a test file to verify your email setup:

```javascript
// test-email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
    const transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        const info = await transporter.sendMail({
            from: `"AlumniBridge Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to yourself for testing
            subject: 'Test Email from AlumniBridge',
            html: '<h1>Email configuration is working!</h1>'
        });

        console.log('Test email sent successfully:', info.messageId);
    } catch (error) {
        console.error('Email test failed:', error);
    }
};

testEmail();
```

Run the test:
```bash
node test-email.js
```

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use App Passwords** instead of regular passwords
3. **Enable 2FA** on your email account
4. **Use environment variables** for all sensitive data
5. **Consider OAuth2** for production environments

## Troubleshooting

### Common Issues

**1. Authentication Failed**
- Verify EMAIL_USER and EMAIL_PASS are correct
- Ensure 2FA is enabled and app password is used
- Check if "Less secure app access" is disabled (good security practice)

**2. Connection Timeout**
- Verify EMAIL_HOST and EMAIL_PORT
- Check firewall settings
- Try different ports (25, 465, 587)

**3. SSL/TLS Errors**
- For port 465, set `secure: true`
- For other ports, set `secure: false`
- Add `tls: { rejectUnauthorized: false }` if needed

### Debug Mode
Enable debug logging:

```javascript
const transporter = nodemailer.createTransporter({
    // ... your config
    debug: true,
    logger: true
});
```

## Production Considerations

1. **Rate Limiting**: Gmail has sending limits (500 emails/day for free accounts)
2. **Dedicated SMTP**: Consider services like SendGrid, Mailgun for high volume
3. **Email Templates**: Use proper HTML templates for professional appearance
4. **Bounce Handling**: Implement bounce and complaint handling
5. **Monitoring**: Set up email delivery monitoring and alerts

## Enhanced Features (Optional)

### Email Queue System
For large bulk imports, consider implementing a queue:

```javascript
import Bull from 'bull';

const emailQueue = new Bull('email queue');

emailQueue.process(async (job) => {
    const { email, name, password, grNo, role } = job.data;
    await sendWelcomeEmail(email, name, password, grNo, role);
});

// Add emails to queue
emailQueue.add('send welcome email', userData);
```

### Email Templates with Handlebars
```javascript
import handlebars from 'handlebars';
import fs from 'fs';

const template = handlebars.compile(
    fs.readFileSync('templates/welcome.hbs', 'utf8')
);

const html = template({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123'
});
```

---

**Note**: This setup uses Nodemailer which is free and doesn't require domain verification like Resend. Perfect for development and small-scale production use.
