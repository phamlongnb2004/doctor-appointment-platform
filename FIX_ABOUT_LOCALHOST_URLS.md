# Fix About Page Localhost URLs - COMPLETE

## Vấn đề
Console log cho thấy:
- ✅ **Hero section**: Cloudinary URL đúng
- ✅ **Mission section**: Cloudinary URL đúng  
- ❌ **Achievements section**: `http://localhost:8080/api/images/articles/3af35edf-996a-4916-a378-4cdcd7c14f90.webp` (SAI)

## Giải pháp

### Bước 1: Xóa localhost URLs khỏi database

Chạy lệnh:
```bash
run_quick_fix_about.bat
```

Hoặc chạy SQL trực tiếp trong MySQL:
```sql
UPDATE about_page_content 
SET content_json = REPLACE(content_json, 'http://localhost:8080/api/images/', '')
WHERE content_json LIKE '%localhost:8080%';
```

### Bước 2: Re-upload ảnh qua CMS

1. Vào **Admin CMS → About Page**
2. Chọn tab **Achievements**
3. Tìm phần upload ảnh background
4. Upload lại ảnh
5. Click **"Lưu thay đổi"**

Ảnh mới sẽ tự động upload lên Cloudinary với URL đúng.

### Bước 3: Kiểm tra

Refresh trang About và xem console log:
```javascript
// Phải thấy Cloudinary URL
backgroundImage: "https://res.cloudinary.com/dms0oco5w/image/upload/..."
```

## Tại sao có localhost URLs?

Những URLs này được tạo khi bạn test trên localhost và upload ảnh. Backend trả về localhost URL thay vì Cloudinary URL, và URL đó được lưu vào database.

**Đã fix**: Bây giờ tất cả uploads mới qua CMS sẽ tự động dùng Cloudinary URLs.

## Files liên quan

- `database/quick_fix_about_localhost.sql` - SQL script để xóa localhost URLs
- `run_quick_fix_about.bat` - Batch file để chạy script
- `frontend/src/pages/AdminCMSPage.js` - Đã fix để lưu imageUrl đúng cách
