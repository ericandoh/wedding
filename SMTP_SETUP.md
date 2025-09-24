# Gmail SMTP Email Setup

This guide will help you set up email sending using Gmail SMTP (much simpler than Gmail API).

## Prerequisites

- Gmail account
- 2-Factor Authentication enabled on your Gmail

## Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", enable "2-Step Verification" if not already enabled

## Step 2: Generate App Password

1. In the same "Security" section, find "App passwords"
2. Click "App passwords"
3. Select "Mail" and "Other (custom name)"
4. Enter "Wedding RSVP" as the app name
5. Copy the generated 16-character password (it will look like: `abcd efgh ijkl mnop`)

## Step 3: Environment Variables

Add these to your `.env.local` file:

```env
# Your Gmail address
SENDER_EMAIL=your-email@gmail.com

# The App Password you just generated (remove spaces)
SENDER_PASSWORD=abcdefghijklmnop

# Your name for email signatures
SENDER_NAME=Eric & Hang

# Admin email (where you want to receive notifications)
ADMIN_EMAIL=your-email@gmail.com

# Base URL for your app
NEXT_PUBLIC_BASE_URL=https://your-wedding-site.vercel.app
```

## Step 4: Deploy to Vercel

1. Go to your Vercel dashboard
2. Select your wedding project
3. Go to Settings → Environment Variables
4. Add the same environment variables:
   - `SENDER_EMAIL`
   - `SENDER_PASSWORD`
   - `SENDER_NAME`
   - `ADMIN_EMAIL`
   - `NEXT_PUBLIC_BASE_URL`

## Step 5: Test

1. **Test locally:**
   - Run `npm run dev`
   - Go to `http://localhost:3000/admin/send-email`
   - Send a test email to yourself

2. **Test in production:**
   - Go to `https://your-wedding-site.vercel.app/admin/send-email`
   - Send a test email

## Troubleshooting

### "Invalid login" error
- Make sure you're using an App Password, not your regular Gmail password
- Ensure 2-Factor Authentication is enabled
- Double-check that the App Password doesn't have spaces

### "Less secure app access" error
- This shouldn't happen with App Passwords
- Make sure you're using the 16-character App Password

### Emails not being received
- Check spam/junk folders
- Verify the recipient email addresses are correct
- Make sure your Gmail account isn't restricted

### Environment variables not working
- Make sure there are no extra spaces or quotes around the values
- Redeploy your Vercel app after adding environment variables

## Rate Limits

Gmail SMTP has generous rate limits:
- 500 emails per day for regular Gmail accounts
- 2,000 emails per day for Google Workspace accounts

This should be more than enough for wedding RSVPs!

## Security Notes

- App Passwords are secure and can be revoked at any time
- Your regular Gmail password is never stored in the code
- All emails are sent through Gmail's secure SMTP servers
- You can monitor sent emails in your Gmail "Sent" folder

## Next Steps

Once you have this working, you can:
1. Update your RSVP system to send automatic confirmation emails
2. Send custom emails to wedding guests
3. Set up email notifications for new RSVPs

The SMTP method is much more reliable and easier to set up than the Gmail API approach!
