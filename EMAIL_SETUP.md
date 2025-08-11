# Email Configuration Setup

This document explains how to set up email functionality for the Wagehire application.

## Email Service Setup

The application uses Nodemailer to send verification emails and password reset emails. You need to configure your email service provider.

### Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the generated password

3. **Set Environment Variables**:
   Create a `.env` file in the `backend` directory with the following variables:

   ```env
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here

   # Email Configuration (for Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Frontend URL (for email links)
   FRONTEND_URL=http://localhost:3000

   # Database Reset (set to 'true' to reset database on startup)
   RESET_DB=false

   # Node Environment
   NODE_ENV=development
   ```

### Other Email Providers

You can use other email providers by changing the configuration:

#### Outlook/Hotmail:
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

#### Yahoo:
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

#### Custom SMTP Server:
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_USER=your-username
EMAIL_PASS=your-password
```

## Email Features

### 1. Email Verification
- Users receive a verification email after registration
- Verification link expires in 24 hours
- Users must verify their email before logging in (except admin users)

### 2. Password Reset
- Users can request a password reset via email
- Reset link expires in 1 hour
- Secure token-based reset process

### 3. Email Templates
- Professional HTML email templates
- Responsive design
- Branded with Wagehire styling

## Testing Email Functionality

1. **Start the backend server**:
   ```bash
   cd backend
   npm start
   ```

2. **Register a new account** with a valid email address

3. **Check your email** for the verification link

4. **Click the verification link** to verify your account

5. **Test password reset** by clicking "Forgot Password" on the login page

## Troubleshooting

### Email Not Sending
1. Check your email configuration in `.env`
2. Verify your email provider settings
3. Check the console for error messages
4. Ensure your email provider allows SMTP access

### Verification Links Not Working
1. Check the `FRONTEND_URL` environment variable
2. Ensure the frontend is running on the correct port
3. Verify the token in the URL

### Gmail Issues
1. Make sure you're using an App Password, not your regular password
2. Enable "Less secure app access" if not using 2FA
3. Check if your Gmail account has any restrictions

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique passwords for email accounts
- Regularly rotate email app passwords
- Consider using environment-specific email configurations for production

## Production Deployment

For production deployment:

1. Use a professional email service (SendGrid, Mailgun, etc.)
2. Set up proper DNS records (SPF, DKIM, DMARC)
3. Configure email monitoring and logging
4. Use environment-specific configurations
5. Set up email delivery monitoring 