# Fix News Detail Page 500 Error ✅

## Problem
When viewing a news article detail page (NewsDetailPage), the application was throwing a 500 error when fetching articles by slug. The error occurred during JSON serialization of the NewsArticle entity.

## Root Cause
The NewsArticle model has a `@ManyToOne` relationship with Doctor:
```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "doctor_id")
private Doctor doctor;
```

When the article was fetched and serialized to JSON, it tried to serialize the Doctor entity, which then tried to serialize the User entity. The Doctor model was missing proper JSON serialization annotations, causing:
1. Lazy loading initialization errors
2. Potential circular reference issues
3. Serialization of sensitive data (like passwords)

## Solution

### Updated Doctor.java
**File**: `backend/src/main/java/com/doctorappointment/model/Doctor.java`

#### 1. Added class-level annotation
```java
@Entity
@Table(name = "doctors")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Doctor {
```

This prevents Hibernate lazy loading proxy issues during JSON serialization.

#### 2. Added field-level annotation for User relationship
```java
@OneToOne
@JoinColumn(name = "user_id", nullable = false, unique = true)
@JsonIgnoreProperties({"password", "appointments", "reviews", "hibernateLazyInitializer", "handler"})
private User user;
```

This:
- Prevents serialization of sensitive password field
- Prevents circular references through appointments and reviews
- Handles lazy loading proxies

## Changes Made

### backend/src/main/java/com/doctorappointment/model/Doctor.java
1. Added import: `import com.fasterxml.jackson.annotation.JsonIgnoreProperties;`
2. Added `@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})` to class
3. Added `@JsonIgnoreProperties({"password", "appointments", "reviews", "hibernateLazyInitializer", "handler"})` to user field

## Testing

### Before Fix
- Accessing `/news/{slug}` endpoint returned 500 error
- NewsDetailPage failed to load articles
- Console showed serialization errors

### After Fix
- `/news/{slug}` endpoint returns 200 OK
- NewsDetailPage loads articles successfully
- Doctor information (if present) serializes correctly
- No sensitive data exposed in JSON response

## Related Models

### NewsArticle.java (already had proper annotations)
```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "doctor_id")
@JsonIgnoreProperties({"user", "certifications", "availabilities", "appointments", "reviews", "hibernateLazyInitializer", "handler"})
private Doctor doctor;
```

The NewsArticle model already had `@JsonIgnoreProperties` on the doctor field, but the Doctor model itself needed the annotations to properly handle its own relationships.

## Impact

### Affected Endpoints
- `GET /api/cms/news/{slug}` - Now works correctly
- Any other endpoint returning Doctor entities will benefit from proper serialization

### Affected Pages
- NewsDetailPage - Can now load and display articles
- Any page displaying doctor information with articles

## Build & Deploy

### Compilation
```bash
cd backend
mvn clean compile -DskipTests
```
✅ Build successful

### Server Restart
Backend server restarted to apply changes.

## Status
✅ **FIXED** - News detail page now loads articles successfully without 500 errors

## Prevention
When creating new models with relationships:
1. Always add `@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})` at class level
2. Add `@JsonIgnoreProperties` to relationship fields to prevent:
   - Circular references
   - Sensitive data exposure
   - Lazy loading issues
3. Test serialization with actual data before deploying
