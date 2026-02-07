# Newsletter 404 Debug Flowchart

```
START: Newsletter returns 404
         |
         v
┌────────────────────────────────┐
│ Step 1: Test Endpoint          │
│ Open: test-newsletter-simple.html │
└────────────────────────────────┘
         |
         v
    What status?
         |
    ┌────┴────┬────────┬────────┐
    │         │        │        │
   404       500      200      CORS
    │         │        │        │
    v         v        v        v
┌─────────┐ ┌──────┐ ┌──────┐ ┌──────────┐
│Controller│ │Table │ │ OK!  │ │Check CORS│
│not loaded│ │missing│ │Done! │ │Config    │
└─────────┘ └──────┘ └──────┘ └──────────┘
    │         │
    v         v
┌─────────────────────┐ ┌──────────────────────┐
│ Step 2: Check Logs  │ │ Step 3: Check Table  │
│ Render Dashboard    │ │ Railway MySQL        │
│ → Logs tab          │ │ → Query Editor       │
└─────────────────────┘ └──────────────────────┘
    │                       │
    v                       v
Look for:              Run SQL:
"Mapped /api/          SHOW TABLES LIKE
newsletter/subscribe"  'newsletter_subscriptions';
    │                       │
    v                       v
Found?                 Exists?
    │                       │
   NO                      NO
    │                       │
    v                       v
┌─────────────────────┐ ┌──────────────────────┐
│ Step 4: Redeploy    │ │ Step 5: Create Table │
│ Render Dashboard    │ │ Run SQL script:      │
│ → Manual Deploy     │ │ debug_newsletter_404.sql │
│ → Deploy latest     │ └──────────────────────┘
└─────────────────────┘         │
    │                           │
    └───────────┬───────────────┘
                v
        ┌───────────────┐
        │ Step 6: Test  │
        │ Again         │
        └───────────────┘
                │
                v
            SUCCESS! ✅
```

## Quick Reference

### 404 Error → Controller Issue
```
1. Check Render logs
2. Look for "Mapped /api/newsletter/subscribe"
3. If not found → Redeploy
4. Test again
```

### 500 Error → Database Issue
```
1. Check Railway database
2. Run: SHOW TABLES LIKE 'newsletter_subscriptions'
3. If not found → Run debug_newsletter_404.sql
4. Test again
```

### 200 Success → All Good! ✅
```
{
  "message": "Mã xác nhận đã được gửi đến email của bạn!",
  "email": "test@test.com"
}
```

## Test Files Priority

1. **test-newsletter-simple.html** ⭐ Start here
2. **verify_newsletter_table.sql** ⭐ Check database
3. **debug_newsletter_404.sql** ⭐ Fix database
4. **test-newsletter-debug.html** - Detailed testing
5. **debug_newsletter_railway.bat** - Automated SQL

## Common Scenarios

### Scenario A: Fresh deployment
```
Problem: 404 on all newsletter endpoints
Cause: Controller not deployed
Fix: Redeploy backend on Render
```

### Scenario B: Database not initialized
```
Problem: 500 error with SQL exception
Cause: Table doesn't exist
Fix: Run debug_newsletter_404.sql on Railway
```

### Scenario C: Email not sending
```
Problem: Subscription works but no email
Cause: Email service not configured (OK!)
Fix: Check Render logs for verification code
```

## Debugging Checklist

- [ ] Open test-newsletter-simple.html
- [ ] Click "Test Subscribe"
- [ ] Note the status code (404/500/200)
- [ ] If 404: Check Render logs
- [ ] If 500: Check Railway database
- [ ] Run appropriate fix
- [ ] Test again
- [ ] Verify success (200 OK)

## Success Indicators

✅ Status: 200 OK
✅ Response has "message" field
✅ Response has "email" field
✅ No errors in browser console
✅ Render logs show "Mapped /api/newsletter/subscribe"
✅ Railway has newsletter_subscriptions table

## Failure Indicators

❌ Status: 404 → Controller not loaded
❌ Status: 500 → Database error
❌ CORS error → Check CorsConfig
❌ Network error → Backend down
❌ Timeout → Backend slow/crashed
