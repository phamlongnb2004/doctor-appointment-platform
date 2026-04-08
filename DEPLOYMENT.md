# Deployment Guide

## Environment Variables Required on Render

### Backend Service

Add these environment variables in Render Dashboard > Backend Service > Environment:

```
FRONTEND_URL=https://doctor-appointment-frontend-ujug.onrender.com
```

This variable is used for:
- SePay payment redirect URLs (success, error, cancel)
- CORS configuration
- Email links

### Frontend Service

Add these environment variables in Render Dashboard > Frontend Service > Environment:

```
REACT_APP_API_URL=https://doctor-appointment-platform-vaff.onrender.com/api
```

## Recent Changes

### 2026-04-09: Fix SePay Return URL
- Changed `app.frontend-url` in `application-render.yml` to use `${FRONTEND_URL}` environment variable
- This fixes the issue where payment success/cancel redirects to localhost instead of production domain
- Requires `FRONTEND_URL` environment variable to be set on Render

## Deployment Steps

1. Push code to GitHub
2. Render will auto-deploy both services
3. Verify environment variables are set correctly
4. Test payment flow to ensure redirect URLs work correctly
