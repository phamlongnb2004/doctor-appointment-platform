# Fix Newsletter 404 Error on Production

## Problem
`POST https://doctor-appointment-backend-mq2p.onrender.com/api/newsletter/subscribe` returns 404 Not Found

## Root Causes Analysis

### Possible Causes:
1. **Table Missing**: `newsletter_subscriptions` table doesn't exist on Railway database
2. **Backend Not Deployed**: Latest code with NewsletterController not deployed to Render
3. **Startup Error**: Controller failing to load due to missing dependencies
4. **Context Path Issue**: Endpoint registered but path mapping incorrect

## Solution Steps

### Step 1: Verify Table Exists on Railway

Run this SQL on Railway MySQL:
```sql
SHOW TABLES LIKE 'newsletter_subscriptions';
```

If table doesn't exist, create it:
```sql
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    phone VARCHAR(20),
    verification_code VARCHAR(6) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    expires_at TIMESTAMP NOT NULL,
    INDEX idx_email (email),
    INDEX idx_verification_code (verification_code),
    INDEX idx_is_verified (is_verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Step 2: Check Render Deployment Logs

1. Go to Render Dashboard: https://dashboard.render.com
2. Select your backend service
3. Click "Logs" tab
4. Look for:
   - ✓ "Started DoctorAppointmentApplication"
   - ✓ "Mapped \"{[/api/newsletter/subscribe]}\""
   - ✗ Any errors related to NewsletterController, NewsletterService, or EmailService

### Step 3: Test Endpoints

Open `test-newsletter-debug.html` in browser to test:
- Health check endpoint
- Newsletter GET endpoint
- Newsletter POST endpoint

### Step 4: Verify Environment Variables on Render

Check these are set:
- `SPRING_DATASOURCE_URL` - Railway MySQL connection string
- `SPRING_DATASOURCE_USERNAME` - Railway username
- `SPRING_DATASOURCE_PASSWORD` - Railway password
- `SPRING_PROFILES_ACTIVE=prod`

### Step 5: Force Redeploy Backend

If table exists but endpoint still 404:

1. Go to Render Dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete
4. Check logs for successful startup

### Step 6: Test Locally First

Before debugging production, verify it works locally:

```bash
# Start backend
cd backend
mvn spring-boot:run

# Test endpoint
curl -X POST http://localhost:8080/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test","phone":"0123456789"}'
```

Expected response:
```json
{
  "message": "Mã xác nhận đã được gửi đến email của bạn!",
  "email": "test@test.com"
}
```

## Quick Test Commands

### Test Production Endpoint
```bash
curl -X POST https://doctor-appointment-backend-mq2p.onrender.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'
```

### Test GET Endpoint (should work if controller is loaded)
```bash
curl https://doctor-appointment-backend-mq2p.onrender.com/api/newsletter/subscribers
```

## Expected Behavior

### If Table Missing:
- GET returns: `500 Internal Server Error` with SQL error
- POST returns: `500 Internal Server Error` with SQL error

### If Controller Not Loaded:
- GET returns: `404 Not Found`
- POST returns: `404 Not Found`

### If Everything Works:
- GET returns: `200 OK` with array of subscribers
- POST returns: `200 OK` with success message

## Files to Check

1. **Controller**: `backend/src/main/java/com/doctorappointment/controller/NewsletterController.java`
2. **Service**: `backend/src/main/java/com/doctorappointment/service/NewsletterService.java`
3. **Repository**: `backend/src/main/java/com/doctorappointment/repository/NewsletterSubscriptionRepository.java`
4. **Model**: `backend/src/main/java/com/doctorappointment/model/NewsletterSubscription.java`
5. **Security**: `backend/src/main/java/com/doctorappointment/config/SecurityConfig.java`

## Security Config Check

The SecurityConfig should allow public access to newsletter endpoints:
```java
.authorizeHttpRequests(auth -> {
    auth
        // ... other rules ...
        .anyRequest().permitAll();  // This allows /api/newsletter/**
})
```

## Next Steps

1. ✅ Run `debug_newsletter_404.sql` on Railway
2. ✅ Open `test-newsletter-debug.html` in browser
3. ✅ Check Render deployment logs
4. ✅ Force redeploy if needed
5. ✅ Test again

## Common Issues

### Issue: "Table doesn't exist"
**Solution**: Run the CREATE TABLE script on Railway

### Issue: "404 on all newsletter endpoints"
**Solution**: Backend not deployed or controller not loaded - redeploy

### Issue: "CORS error"
**Solution**: Already fixed in CorsConfig.java

### Issue: "500 error with email"
**Solution**: Email service failing (non-critical, subscription still works)
