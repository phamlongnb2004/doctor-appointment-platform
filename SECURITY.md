# 🔒 Security Guidelines

## Sensitive Files

The following files contain sensitive information and are **NOT** committed to Git:

### Backend
- `backend/src/main/resources/application-render.yml` - Production database credentials
- `backend/.env` - Local environment variables
- `backend/run-render.bat` - Script with production database connection

### Frontend
- `frontend/.env.production` - Production API keys
- `frontend/.env.local` - Local environment variables

### Database
- `data/` - Local H2 database files
- `*.db`, `*.mv.db`, `*.trace.db` - Database files

## Environment Variables

### Required for Production (Render)

Set these in Render Dashboard → Environment Variables:

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://...
SPRING_DATASOURCE_USERNAME=...
SPRING_DATASOURCE_PASSWORD=...

# Email
MAIL_USERNAME=...
MAIL_PASSWORD=...

# SePay
SEPAY_MERCHANT_ID=...
SEPAY_SECRET_KEY=...
SEPAY_CHECKOUT_URL=https://pay-sandbox.sepay.vn/v1/checkout/init
SEPAY_IPN_URL=https://your-backend-url/api/orders/sepay/ipn

# URLs
APP_BASE_URL=https://your-backend-url
FRONTEND_URL=https://your-frontend-url
```

### For Local Development

1. Copy `backend/.env.example` to `backend/.env`
2. Fill in your local credentials
3. Or use `application-dev.yml` with default values

## What's Safe to Commit

✅ **Safe:**
- `*.example` files (templates without real credentials)
- `application.yml` (with environment variable placeholders)
- `application-dev.yml` (with test/default values only)
- `application-prod.yml` (with environment variable placeholders)

❌ **Never Commit:**
- Real passwords, API keys, secret keys
- Database credentials
- Email passwords
- Payment gateway secrets
- Production URLs with credentials

## If You Accidentally Committed Secrets

1. **Immediately rotate/change** all exposed credentials
2. Remove from Git history:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/file" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push (⚠️ dangerous):
   ```bash
   git push origin --force --all
   ```

## Best Practices

1. ✅ Use environment variables for all secrets
2. ✅ Keep `.env.example` updated as template
3. ✅ Review `.gitignore` before committing
4. ✅ Use different credentials for dev/staging/production
5. ✅ Rotate secrets regularly
6. ❌ Never hardcode secrets in source code
7. ❌ Never commit `.env` files
8. ❌ Never share credentials in chat/email

## Contact

If you discover a security vulnerability, please email: [your-email@domain.com]
