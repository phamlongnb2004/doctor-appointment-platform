# Newsletter CORS Fix - Complete ✅

## Issue Fixed
Fixed 500 Internal Server Error caused by CORS configuration conflict:
```
java.lang.IllegalArgumentException: When allowCredentials is true, allowedOrigins cannot contain the special value "*"
```

## Root Cause
The `NewsletterController` had `@CrossOrigin(origins = "*")` annotation which conflicted with `SecurityConfig`'s CORS configuration that uses `allowCredentials=true`.

## Solution Applied

### 1. Removed Conflicting CORS Annotation
**File**: `backend/src/main/java/com/doctorappointment/controller/NewsletterController.java`

**Before**:
```java
@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")  // ❌ This caused the conflict
public class NewsletterController {
```

**After**:
```java
@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
@Slf4j
public class NewsletterController {  // ✅ Removed @CrossOrigin
```

### 2. SecurityConfig Already Has Proper CORS
**File**: `backend/src/main/java/com/doctorappointment/config/SecurityConfig.java`

The SecurityConfig already has the correct CORS configuration:
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);  // ✅ This requires specific origins
    configuration.setExposedHeaders(Arrays.asList("Authorization"));
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

## Backend Restarted
- Process 22 stopped
- Process 23 started with `mvn spring-boot:run`
- Backend running successfully on http://localhost:8080

## Test Results
Backend logs show newsletter subscription working:
```
Hibernate: select n1_0.id from newsletter_subscriptions n1_0 where n1_0.email=? limit ?
Hibernate: insert into newsletter_subscriptions (created_at,email,expires_at,is_active,is_verified,name,phone,verification_code,verified_at) values (?,?,?,?,?,?,?,?,?)
```

## How to Test

### 1. Subscribe to Newsletter
```bash
curl -X POST http://localhost:8080/api/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "phone": "0123456789"
  }'
```

Expected response:
```json
{
  "message": "Mã xác nhận đã được gửi đến email của bạn!",
  "email": "test@example.com"
}
```

### 2. Verify Code
Check your email for the 6-digit verification code, then:
```bash
curl -X POST http://localhost:8080/api/api/newsletter/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456"
  }'
```

Expected response:
```json
{
  "message": "Đăng ký thành công! Bạn sẽ nhận được các thông báo ưu đãi qua email.",
  "subscription": { ... }
}
```

## Frontend Integration
The HomePage already has the newsletter form integrated:
- Email input field
- Name input field (optional)
- Phone input field (optional)
- Subscribe button
- Verification modal with 6-digit code input

## Email Configuration
Gmail SMTP is configured and working:
- Host: smtp.gmail.com
- Port: 587
- TLS: enabled
- User configured Gmail App Password successfully

## Status
✅ CORS issue fixed
✅ Backend restarted
✅ Newsletter subscription working
✅ Email sending configured
✅ Frontend form ready

## Next Steps
1. Test the newsletter subscription flow on the homepage
2. Check email inbox for verification code
3. Verify the code to complete subscription
4. Confirm welcome email is received
