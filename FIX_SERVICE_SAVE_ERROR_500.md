# Fix Service Save Error 500 - Complete ✅

## Problem
When saving a Service in Admin CMS, got error: "Lỗi khi lưu: Request failed with status code 500"

## Root Cause
The `Service` model had `iconClass` field marked as `nullable = false` (required), but the frontend form no longer sends this field after we changed to use `imageUrl` for icon upload instead.

## Solution Applied

### 1. Backend Model Update
**File**: `backend/src/main/java/com/doctorappointment/model/Service.java`

Changed:
```java
@Column(nullable = false)
private String iconClass; // CSS class for icon
```

To:
```java
@Column
private String iconClass; // CSS class for icon (optional, now using imageUrl)
```

### 2. Database Schema Update
**File**: `database/fix_service_iconclass_nullable.sql`

```sql
-- Make icon_class nullable
ALTER TABLE services 
MODIFY COLUMN icon_class VARCHAR(255) NULL;

-- Update existing records
UPDATE services 
SET icon_class = '' 
WHERE icon_class IS NULL;
```

### 3. Rebuild & Restart
- Ran SQL script to update database
- Rebuilt backend: `mvn clean install -DskipTests`
- Restarted backend server

## Files Modified
- `backend/src/main/java/com/doctorappointment/model/Service.java`
- `database/fix_service_iconclass_nullable.sql` (new)
- `run_fix_service_iconclass.bat` (new)

## Testing
1. Go to Admin CMS → Tiện ích khách hàng
2. Click "Thêm dịch vụ"
3. Fill in:
   - Tiêu đề: Test Service
   - Mô tả: Test description
   - Upload Icon (image)
   - Màu sắc: Pick color or enter hex code (e.g., #10b981)
   - Display order: 0
   - Kích hoạt: ON
4. Click "OK" to save
5. Should save successfully without 500 error

## Status
✅ Backend model updated
✅ Database schema updated
✅ Backend rebuilt and restarted
✅ Ready for testing

## Note
This same issue might occur with other entities if they have required fields that are no longer sent from frontend. Check if similar errors occur with Features, Specialties, Statistics, or Certifications.
