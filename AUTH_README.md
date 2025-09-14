# Website Authentication

This website is now password protected with a secret keyphrase system.

## How it works

1. **Secret Keyphrase**: The current keyphrase is set to `wedding2024`
2. **Authentication**: Users must enter the correct keyphrase to access any part of the website
3. **Session Management**: Once authenticated, users stay logged in for 7 days (configurable)
4. **Logout**: Users can logout using the logout button in the top navigation

## Configuration

### ⚠️ SECURITY IMPORTANT ⚠️
The secret keyphrase is now stored in environment variables for security. 

**To set your secret keyphrase:**

1. Create a `.env.local` file in the root directory:
```bash
# Wedding Website Environment Variables
WEDDING_SECRET_KEYPHRASE=your-secret-keyphrase-here
```

2. For production deployment, set the environment variable in your hosting platform:
   - Vercel: Add `WEDDING_SECRET_KEYPHRASE` in your project settings
   - Netlify: Add it in Site settings > Environment variables
   - Other platforms: Set the environment variable accordingly

**Never commit the `.env.local` file to git!** It's already in `.gitignore`.

The fallback keyphrase is 'calico' if no environment variable is set.

## Files Added/Modified

- `middleware.ts` - Protects all routes except login and static assets
- `app/login/page.tsx` - Login page with keyphrase input
- `app/api/auth/route.ts` - API endpoint for authentication
- `app/_components/auth-provider.tsx` - React context for auth state
- `app/_components/logout-button.tsx` - Logout button component
- `app/_config/auth.ts` - Configuration file for keyphrase and settings
- `app/layout.tsx` - Updated to include auth provider and logout button

## Security Features

- HTTP-only cookies prevent client-side access to authentication tokens
- Secure cookies in production environment
- Session expiration after configurable duration
- All routes protected except login page and static assets

## Usage

1. Start the development server: `npm run dev`
2. Navigate to any page - you'll be redirected to `/login`
3. Enter the keyphrase: `wedding2024`
4. You'll be redirected to the main website
5. Use the logout button to end your session
