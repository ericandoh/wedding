# Email Setup for Wedding RSVP

This guide will help you set up email functionality for your wedding RSVP system.

## Prerequisites

You'll need:
1. A Google account with Gmail
2. A Google Cloud Project (you already have this for your spreadsheet)
3. Gmail API enabled in your Google Cloud Console

## Setup Steps

### 1. Enable Gmail API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Library"
4. Search for "Gmail API" and enable it

### 2. Update Service Account Permissions

1. Go to "IAM & Admin" > "Service Accounts"
2. Find your existing service account (the one you use for Google Sheets)
3. Edit the service account
4. Add the Gmail API scope: `https://www.googleapis.com/auth/gmail.send`

### 3. Environment Variables

Add these to your `.env.local` file:

```env
# Your email address (the one you want to send emails FROM)
SENDER_EMAIL=your-email@gmail.com

# Admin email (where you want to receive notifications)
ADMIN_EMAIL=your-email@gmail.com

# Base URL for your app (for production, use your actual domain)
NEXT_PUBLIC_BASE_URL=https://your-wedding-site.vercel.app
```

### 4. Install Dependencies

Run this command to install the email dependencies:

```bash
npm install
```

## How It Works

### Automatic Emails

When someone submits an RSVP, the system will automatically:

1. **Send a confirmation email to the guest** - A beautiful, personalized email confirming their RSVP with all their details
2. **Send a notification email to you** - A summary of the new RSVP so you can track responses

### Manual Email Sending

You can also send custom emails through the admin interface:

1. Go to `/admin/send-email` on your website
2. Enter recipient email, subject, and message
3. Click "Send Email"

## Email Templates

The system includes two types of email templates:

### Guest Confirmation Email
- Personalized greeting with their name
- Summary of their RSVP details
- Beautiful HTML formatting with your wedding fonts
- Different content for attending vs. not attending
- Links back to your wedding website

### Admin Notification Email
- Quick summary of the new RSVP
- All the details they provided
- Color-coded (green for attending, red for not attending)
- Easy to scan format

## Troubleshooting

### Common Issues

1. **"Missing required environment variables"**
   - Make sure `SENDER_EMAIL` is set in your `.env.local`
   - Ensure your service account has Gmail API access

2. **"Failed to send email"**
   - Check that Gmail API is enabled in Google Cloud Console
   - Verify your service account has the correct permissions
   - Make sure `SENDER_EMAIL` matches a Gmail address you control

3. **Emails not being received**
   - Check spam/junk folders
   - Verify the recipient email addresses are correct
   - Make sure your Google account isn't restricted

### Testing

To test the email functionality:

1. Submit a test RSVP through your website
2. Check that you receive the admin notification
3. Check that the guest receives the confirmation
4. Try the manual email sender at `/admin/send-email`

## Security Notes

- The service account only has permission to send emails, not read them
- Email addresses are only used for wedding-related communication
- All emails are sent through Google's secure infrastructure
- No email content is stored permanently (only in Gmail)

## Customization

You can customize the email templates by editing `/lib/email-templates.ts`:

- Change the styling and colors
- Modify the content and messaging
- Add your own branding elements
- Include additional information or links

## Alternative Email Services

If you prefer not to use Gmail API, you can also use:

- **Resend** (recommended alternative)
- **SendGrid**
- **Mailgun**
- **Amazon SES**

These would require different setup but provide similar functionality.
