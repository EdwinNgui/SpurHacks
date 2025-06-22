# Environment Setup Guide

This guide explains how to set up environment variables for the Quantum Circuit Assistant with AI integration.

## Required Environment Variables

### Gemini API Key

The application requires a Gemini API key to function. You can get one from [Google AI Studio](https://makersuite.google.com/app/apikey).

## Setup Instructions

### 1. Create Environment File

Create a `.env.local` file in the root directory of your project:

```bash
# On Windows
echo NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here > .env.local

# On macOS/Linux
touch .env.local
echo "NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here" > .env.local
```

### 2. Add Your API Key

Edit the `.env.local` file and replace `your_actual_api_key_here` with your actual Gemini API key:

```env
# Gemini API Configuration
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyDK5cHbOa8L97fEvdASBrul3x8X2Sp3BnQ
```

### 3. Verify Setup

The `.env.local` file is already in `.gitignore`, so it won't be committed to version control.

## Environment Variable Details

### NEXT_PUBLIC_GEMINI_API_KEY
- **Purpose**: Gemini API key for AI-powered circuit generation
- **Required**: Yes
- **Format**: String (API key from Google AI Studio)
- **Security**: This key is exposed to the client-side code due to the `NEXT_PUBLIC_` prefix

### Alternative: Server-Side Only (Recommended for Production)

For better security in production, you can use a server-side only environment variable:

```env
# Server-side only (more secure)
GEMINI_API_KEY=your_actual_api_key_here
```

The application will check for both `NEXT_PUBLIC_GEMINI_API_KEY` and `GEMINI_API_KEY`, preferring the server-side version.

## Security Considerations

1. **Never commit API keys to version control**
   - The `.env.local` file is already in `.gitignore`
   - Never add API keys to `.env.example` or other committed files

2. **Use server-side environment variables in production**
   - The `NEXT_PUBLIC_` prefix exposes the key to client-side code
   - For production, consider using server-side only variables

3. **Rotate API keys regularly**
   - Change your API keys periodically for security

## Troubleshooting

### "API key not configured" Error
If you see this error, make sure:
1. The `.env.local` file exists in the project root
2. The environment variable name is correct
3. The API key value is valid
4. You've restarted the development server after adding the environment variable

### Restart Development Server
After adding or changing environment variables, restart your development server:

```bash
npm run dev
```

## Example .env.local File

```env
# Gemini API Configuration
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyDK5cHbOa8L97fEvdASBrul3x8X2Sp3BnQ

# Optional: Server-side only (more secure for production)
# GEMINI_API_KEY=AIzaSyDK5cHbOa8L97fEvdASBrul3x8X2Sp3BnQ
```

## Deployment

When deploying to platforms like Vercel, Netlify, or other hosting services:

1. Add the environment variable in your hosting platform's dashboard
2. Use the same variable name: `NEXT_PUBLIC_GEMINI_API_KEY`
3. Set the value to your actual API key
4. Redeploy your application

The environment variable will be automatically available to your application. 