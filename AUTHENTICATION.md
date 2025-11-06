# Authentication System Setup Guide

This document provides step-by-step instructions for setting up the Supabase authentication system.

## Prerequisites

1. A Supabase account (free tier is sufficient)
2. PostgreSQL database (can use Supabase's built-in database)

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the project details:
   - Project name: `senate-path` (or your preferred name)
   - Database password: Choose a strong password
   - Region: Choose the closest region to your users
4. Wait for the project to be created (takes ~2 minutes)

### 2. Configure Email Authentication

1. In your Supabase project, go to **Authentication** > **Providers**
2. Find **Email** in the list of providers
3. Make sure **Enable Email provider** is turned ON
4. Configure **Email Templates** (optional but recommended):
   - Go to **Authentication** > **Email Templates**
   - Customize the "Magic Link" template with your branding
   - The default template works fine for testing

### 3. Get Your Supabase Credentials

1. Go to **Project Settings** > **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### 4. Configure Environment Variables

1. Create a `.env.local` file in the project root (or update your hosting platform's environment variables)
2. Add the following variables:

```env
# Database (if using external PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-project-url-from-step-3"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-from-step-3"
```

**Note:** If you're using Supabase's built-in database:
- Go to **Project Settings** > **Database**
- Copy the **Connection string** under "Connection pooling"
- Use this for both `DATABASE_URL` and `DIRECT_URL`

### 5. Update Database Schema

Run Prisma migrations to add the email field to the User model:

```bash
npm run prisma:migrate
```

### 6. Configure Redirect URLs (Production Only)

For production deployments:

1. Go to **Authentication** > **URL Configuration** in Supabase
2. Add your production URL to **Site URL**: `https://your-domain.com`
3. Add redirect URLs to **Redirect URLs**:
   - `https://your-domain.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for local testing)

### 7. Test the Authentication

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click "Sign In" in the navbar
4. Enter your email address
5. Check your email for the magic link
6. Click the link to authenticate
7. You should be redirected back to the site and see your email in the navbar

## User Management

### Adding Admin Users

Currently, any user who signs in can access the admin dashboard. To restrict access:

1. Users authenticate via email OTP
2. Their email is stored in Supabase Auth
3. You can add additional role-based access control by:
   - Storing user roles in the database
   - Checking roles in the middleware
   - Creating an admin panel to manage user roles

### Viewing Authenticated Users

1. Go to **Authentication** > **Users** in Supabase
2. You'll see all users who have signed in
3. You can manually delete users or disable their accounts

## Troubleshooting

### Magic Link Not Received

- Check your spam folder
- Verify email settings in Supabase (Authentication > Email Templates)
- Make sure you're using a real email address
- Check Supabase logs in Authentication > Logs

### Authentication Not Working

- Verify environment variables are set correctly
- Check browser console for errors
- Verify redirect URLs are configured correctly in Supabase
- Make sure cookies are enabled in your browser

### Build Errors

- Ensure all environment variables are set (even with placeholder values for build)
- Run `npm run prisma:generate` to regenerate Prisma client
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## Security Notes

- The email OTP system is secure and doesn't require password management
- Magic links expire after a short time (configurable in Supabase)
- Sessions are managed securely via HTTP-only cookies
- Middleware validates sessions on every request
- Admin routes are protected and require authentication

## Production Deployment

When deploying to production:

1. Set all environment variables in your hosting platform
2. Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
3. Configure redirect URLs in Supabase for your production domain
4. Test the authentication flow in production
5. Monitor Supabase logs for any authentication issues
