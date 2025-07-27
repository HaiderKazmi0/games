# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Debris Pulse application.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make sure billing is enabled (required for OAuth)

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" and enable it
3. Alternatively, search for "Google OAuth2 API" and enable it

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure the OAuth consent screen first if prompted:
   - Choose "External" for user type
   - Fill in the required fields (App name, User support email, Developer contact)
   - Add your domain to authorized domains if deploying to production
4. For Application type, select "Web application"
5. Add your redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`

## Step 4: Configure Environment Variables

1. Copy your Client ID and Client Secret from the Google Cloud Console
2. Add them to your `.env` file:

```env
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
```

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Go to your application
3. Click the "Sign In" button
4. Select "Continue with Google"
5. Complete the OAuth flow

## Important Notes

- Make sure your Google Cloud project has billing enabled
- The OAuth consent screen must be configured before creating credentials
- For production, make sure to add your production domain to the authorized redirect URIs
- Keep your client secret secure and never commit it to version control

## Troubleshooting

**Error: "redirect_uri_mismatch"**
- Check that your redirect URI in Google Cloud Console matches exactly: `http://localhost:3000/api/auth/callback/google`

**Error: "access_blocked"**
- Make sure your OAuth consent screen is properly configured
- Check that the user's email is added to test users if your app is in testing mode

**Error: "invalid_client"**
- Verify your Client ID and Client Secret are correct
- Make sure there are no extra spaces or characters in your environment variables