# Bulk Import Setup Guide

## Overview
The bulk import feature allows administrators to import multiple users (students/alumni) from CSV files and automatically send welcome emails with login credentials to each user.

## Features Implemented
✅ **CSV File Upload**: Upload CSV files with user data  
✅ **Unique Password Generation**: Each user gets a secure, unique password  
✅ **Email Integration**: Automatic welcome emails with credentials using Resend  
✅ **Profile Management**: Users are set to complete profiles after first login  
✅ **Error Handling**: Comprehensive validation and error reporting  
✅ **Import History**: Track all import operations with detailed logs  
✅ **Real-time Processing**: Background processing with status updates  

## Prerequisites

### 1. Install Resend Package
```bash
cd server
npm install resend
```

### 2. Get Resend API Key
1. Visit [Resend.com](https://resend.com)
2. Sign up for a free account
3. Go to API Keys section
4. Create a new API key
5. Copy the API key (starts with `re_`)

### 3. Domain Verification (Optional but Recommended)
1. In Resend dashboard, go to Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Follow DNS verification steps
4. Use verified domain in FROM_EMAIL

## Environment Configuration

Add these variables to your `.env` file:

```env
# Resend Email Configuration (Required for Bulk Import)
RESEND_API_KEY=re_your_actual_api_key_here
FROM_EMAIL=AlumniBridge <onboarding@yourdomain.com>

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173
```

**Important Notes:**
- Replace `re_your_actual_api_key_here` with your actual Resend API key
- Replace `yourdomain.com` with your verified domain or use `onboarding@resend.dev` for testing
- Update `FRONTEND_URL` to your production URL when deploying

## CSV File Format

### Required Columns
- `name`: Full name of the user
- `email`: Valid email address (must be unique)
- `grNo`: GR/Registration number (must be unique)
- `role`: Either "student" or "alumni"

### Optional Columns
- `batch`: Graduation year (number)
- `branch`: Department/Branch name

### Sample CSV Content
```csv
name,email,grNo,role,batch,branch
John Doe,john.doe@example.com,GR001,student,2024,Computer Science
Jane Smith,jane.smith@example.com,GR002,alumni,2020,Information Technology
Mike Johnson,mike.johnson@example.com,GR003,alumni,2019,Electronics
```

## How It Works

### 1. File Upload Process
1. Admin uploads CSV file through the bulk import interface
2. System validates file format and size (max 10MB)
3. Creates import record in database with "processing" status

### 2. User Creation Process
1. Parses CSV file row by row
2. Validates required fields and data format
3. Checks for duplicate emails/GR numbers
4. Generates unique secure password for each user
5. Creates user account with:
   - `isVerified: true` (auto-verified)
   - `isProfileComplete: false` (requires profile completion)
   - Hashed password stored in database

### 3. Email Sending Process
1. Collects all successfully created users
2. Sends welcome emails in batches (10 at a time)
3. Includes login credentials and instructions
4. Tracks email success/failure rates

### 4. Result Tracking
1. Updates import record with results
2. Logs admin action with detailed metrics
3. Stores error details for failed records
4. Provides comprehensive import history

## Email Template Features

The welcome email includes:
- **Professional Design**: Clean, responsive HTML template
- **Login Credentials**: Email, password, GR number, role
- **Next Steps**: Instructions for profile completion
- **Security Note**: Reminder to change password
- **Direct Login Link**: Button linking to login page
- **Branding**: AlumniBridge logo and styling

## Error Handling

### Validation Errors
- Missing required fields
- Invalid email format
- Invalid role (must be student/alumni)
- Duplicate email or GR number
- Invalid batch year

### Processing Errors
- Database connection issues
- User creation failures
- Email sending failures
- File parsing errors

### Error Recovery
- Failed user creation doesn't stop the process
- Email failures don't fail the entire import
- Detailed error logs for troubleshooting
- Partial success handling

## Usage Instructions

### For Administrators

1. **Access Bulk Import**
   - Navigate to Admin Panel → Bulk Import
   - Download the CSV template
   - Fill template with user data

2. **Upload and Import**
   - Select import type (All Users, Students Only, Alumni Only)
   - Choose CSV file
   - Click "Start Import"
   - Monitor progress in Import History

3. **Monitor Results**
   - Check import status in real-time
   - View detailed error reports
   - Track email delivery success
   - Download error logs if needed

### For Imported Users

1. **Receive Welcome Email**
   - Check email inbox for welcome message
   - Note login credentials (email + generated password)
   - Click login link in email

2. **First Login**
   - Use provided credentials to log in
   - System will redirect to profile completion
   - Fill required profile information
   - Change password for security

3. **Complete Setup**
   - Add profile photo, bio, contact details
   - Connect with other users
   - Explore platform features

## Security Features

### Password Security
- 12-character secure passwords with mixed case, numbers, symbols
- Bcrypt hashing with salt rounds
- Unique password per user
- Password change reminder in email

### Data Protection
- CSV files deleted after processing
- Sensitive data not logged
- Email credentials sent only once
- Secure database storage

### Access Control
- Admin-only access to bulk import
- JWT authentication required
- Action logging for audit trail
- File type and size validation

## Troubleshooting

### Common Issues

**1. Email Not Sending**
- Check RESEND_API_KEY is correct
- Verify FROM_EMAIL domain
- Check Resend account limits
- Review error logs

**2. CSV Upload Fails**
- Ensure file is .csv format
- Check file size (max 10MB)
- Verify column headers match template
- Remove special characters

**3. User Creation Errors**
- Check for duplicate emails/GR numbers
- Validate required fields
- Ensure role is "student" or "alumni"
- Check database connection

**4. Import Stuck in Processing**
- Check server logs for errors
- Restart server if needed
- Verify file permissions
- Check database connectivity

### Debug Steps

1. **Check Server Logs**
   ```bash
   # View real-time logs
   npm run server
   
   # Check for errors during import
   tail -f logs/error.log
   ```

2. **Verify Environment Variables**
   ```bash
   # Check if variables are loaded
   console.log(process.env.RESEND_API_KEY);
   console.log(process.env.FROM_EMAIL);
   ```

3. **Test Email Service**
   ```javascript
   // Test email sending manually
   import { sendWelcomeEmail } from './services/emailService.js';
   
   await sendWelcomeEmail(
     'test@example.com', 
     'Test User', 
     'TestPass123', 
     'GR001', 
     'student'
   );
   ```

## Production Deployment

### Environment Setup
1. Update `FRONTEND_URL` to production URL
2. Use verified domain for `FROM_EMAIL`
3. Set up proper DNS records
4. Configure SSL certificates

### Monitoring
1. Set up email delivery monitoring
2. Monitor import success rates
3. Track user activation rates
4. Set up error alerting

### Scaling Considerations
1. Implement rate limiting for large imports
2. Add queue system for email processing
3. Consider email service limits
4. Monitor server resources

## Support

For issues or questions:
1. Check this documentation first
2. Review server logs for errors
3. Test with small CSV files
4. Contact development team with specific error messages

---

**Last Updated**: September 2024  
**Version**: 1.0.0  
**Compatible with**: AlumniBridge v2.0+
