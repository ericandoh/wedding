# Environment Variables Check

## Required Environment Variables

You need these environment variables set up for the email system to work:

### For Local Development (.env.local)
```env
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password
ADMIN_EMAIL=your-email@gmail.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### For Production (Vercel)
Set these in your Vercel dashboard under Settings → Environment Variables:
- `SENDER_EMAIL`
- `SENDER_PASSWORD` 
- `ADMIN_EMAIL`
- `NEXT_PUBLIC_BASE_URL`

## How to Get SENDER_PASSWORD

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Go to App Passwords**: https://myaccount.google.com/apppasswords
3. **Generate a new app password** for "Wedding RSVP"
4. **Copy the 16-character password** (like: `abcd efgh ijkl mnop`)
5. **Remove spaces** when adding to environment variables

## Test Your Setup

1. **Visit the test endpoint**: `http://localhost:3000/api/test-email`
2. **Check the response** for any missing environment variables
3. **Look at server logs** for detailed error messages

## Common Issues

### "Missing email environment variables"
- Set up your `.env.local` file with the required variables
- Restart your development server after adding variables

### "Invalid login" error
- Make sure you're using an App Password, not your regular Gmail password
- Ensure 2-Factor Authentication is enabled
- Double-check there are no spaces in the App Password

### "Less secure app access" error
- This shouldn't happen with App Passwords
- Make sure you're using the 16-character App Password

## Debug Steps

1. **Check environment variables**: Visit `/api/test-email`
2. **Test email sending**: The endpoint will try to send a test email
3. **Check server logs**: Look for detailed error messages
4. **Verify Gmail settings**: Make sure App Password is correctly generated
