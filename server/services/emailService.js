import nodemailer from 'nodemailer';

// Initialize Nodemailer transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

/**
 * Send welcome email with login credentials to newly imported users
 * @param {string} email - User's email address
 * @param {string} name - User's name
 * @param {string} password - Generated password
 * @param {string} grNo - User's GR number
 * @param {string} role - User's role (student/alumni)
 * @returns {Promise<Object>} - Email send result
 */
export const sendWelcomeEmail = async (email, name, password, grNo, role) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"AlumniBridge" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to AlumniBridge - Your Account Credentials',
            html: generateWelcomeEmailTemplate(name, email, password, grNo, role)
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log(`Email sent successfully to ${email}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('Email service error:', error);
        throw new Error(`Failed to send email to ${email}: ${error.message}`);
    }
};

/**
 * Send bulk welcome emails to multiple users
 * @param {Array} users - Array of user objects with email, name, password, grNo, role
 * @returns {Promise<Object>} - Bulk email results
 */
export const sendBulkWelcomeEmails = async (users) => {
    const results = {
        successful: [],
        failed: []
    };

    // Process emails in batches to avoid rate limiting
    const batchSize = 10;
    for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (user) => {
            try {
                const result = await sendWelcomeEmail(
                    user.email, 
                    user.name, 
                    user.password, 
                    user.grNo, 
                    user.role
                );
                results.successful.push({
                    email: user.email,
                    name: user.name,
                    result
                });
            } catch (error) {
                results.failed.push({
                    email: user.email,
                    name: user.name,
                    error: error.message
                });
            }
        });

        await Promise.all(batchPromises);
        
        // Add delay between batches to respect rate limits
        if (i + batchSize < users.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return results;
};

/**
 * Generate HTML email template for welcome email
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} password - Generated password
 * @param {string} grNo - User's GR number
 * @param {string} role - User's role
 * @returns {string} - HTML email template
 */
const generateWelcomeEmailTemplate = (name, email, password, grNo, role) => {
    const loginUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to AlumniBridge</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #2563eb;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #2563eb;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #6b7280;
                font-size: 16px;
            }
            .welcome-message {
                margin-bottom: 25px;
            }
            .credentials-box {
                background-color: #f3f4f6;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #2563eb;
            }
            .credential-item {
                margin: 10px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .credential-label {
                font-weight: 600;
                color: #374151;
            }
            .credential-value {
                font-family: 'Courier New', monospace;
                background-color: #e5e7eb;
                padding: 5px 10px;
                border-radius: 4px;
                font-weight: bold;
            }
            .login-button {
                display: inline-block;
                background-color: #2563eb;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                margin: 20px 0;
                text-align: center;
            }
            .login-button:hover {
                background-color: #1d4ed8;
            }
            .instructions {
                background-color: #fef3c7;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #f59e0b;
                margin: 20px 0;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
            }
            .security-note {
                background-color: #fef2f2;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #ef4444;
                margin: 20px 0;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">AlumniBridge</div>
                <div class="subtitle">Connecting Students, Alumni & Success</div>
            </div>
            
            <div class="welcome-message">
                <h2>Welcome to AlumniBridge, ${name}!</h2>
                <p>Your account has been created successfully. You're now part of our vibrant alumni network that connects students, graduates, and professionals from our college community.</p>
            </div>
            
            <div class="credentials-box">
                <h3 style="margin-top: 0; color: #2563eb;">Your Login Credentials</h3>
                <div class="credential-item">
                    <span class="credential-label">Email:</span>
                    <span class="credential-value">${email}</span>
                </div>
                <div class="credential-item">
                    <span class="credential-label">Password:</span>
                    <span class="credential-value">${password}</span>
                </div>
                <div class="credential-item">
                    <span class="credential-label">GR Number:</span>
                    <span class="credential-value">${grNo}</span>
                </div>
                <div class="credential-item">
                    <span class="credential-label">Role:</span>
                    <span class="credential-value">${role.charAt(0).toUpperCase() + role.slice(1)}</span>
                </div>
            </div>
            
            <div class="instructions">
                <h4 style="margin-top: 0;">Next Steps:</h4>
                <ol>
                    <li>Click the login button below to access your account</li>
                    <li>Complete your profile with additional information</li>
                    <li>Start connecting with fellow alumni and students</li>
                    <li>Explore job opportunities and networking events</li>
                </ol>
            </div>
            
            <div style="text-align: center;">
                <a href="${loginUrl}/login" class="login-button">Login to AlumniBridge</a>
            </div>
            
            <div class="security-note">
                <strong>🔒 Security Reminder:</strong> Please change your password after your first login for enhanced security. Keep your credentials confidential and never share them with anyone.
            </div>
            
            <div class="footer">
                <p>If you have any questions or need assistance, please contact our support team.</p>
                <p>© 2024 AlumniBridge. All rights reserved.</p>
                <p style="font-size: 12px; margin-top: 10px;">
                    This email was sent to ${email} because your account was created by an administrator.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

/**
 * Generate a secure random password
 * @param {number} length - Password length (default: 12)
 * @returns {string} - Generated password
 */
export const generateSecurePassword = (length = 12) => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    
    // Ensure at least one character from each category
    const categories = [
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ", // uppercase
        "abcdefghijklmnopqrstuvwxyz", // lowercase
        "0123456789",                 // numbers
        "!@#$%^&*"                   // special chars
    ];
    
    // Add one character from each category
    categories.forEach(category => {
        password += category.charAt(Math.floor(Math.random() * category.length));
    });
    
    // Fill the rest with random characters
    for (let i = password.length; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Shuffle the password to randomize positions
    return password.split('').sort(() => Math.random() - 0.5).join('');
};

export default {
    sendWelcomeEmail,
    sendBulkWelcomeEmails,
    generateSecurePassword
};
