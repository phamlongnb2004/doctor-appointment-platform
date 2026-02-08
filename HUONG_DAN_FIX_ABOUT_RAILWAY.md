# Hướng dẫn Fix About Page trên Railway

## Vấn đề
Trang About chỉ hiển thị Hero section, các sections khác bị ẩn vì có localhost URLs trong database.

## Giải pháp

### Bước 1: Vào Railway Dashboard

1. Mở https://railway.app
2. Đăng nhập
3. Chọn project của bạn
4. Click vào **MySQL database**

### Bước 2: Mở Query Tab

1. Trong MySQL service, click tab **"Query"** hoặc **"Data"**
2. Bạn sẽ thấy SQL editor

### Bước 3: Chạy SQL Fix

Copy và paste SQL này vào editor:

```sql
-- Xóa tất cả localhost URLs
UPDATE about_page_content 
SET content_json = REPLACE(content_json, 'http://localhost:8080/api/images/', '')
WHERE content_json LIKE '%localhost:8080%';

-- Kiểm tra kết quả
SELECT 
    section_key,
    CASE 
        WHEN content_json LIKE '%localhost%' THEN 'STILL HAS LOCALHOST'
        ELSE 'FIXED'
    END as status
FROM about_page_content;
```

Click **"Run"** hoặc **"Execute"**

### Bước 4: Kiểm tra kết quả

Bạn sẽ thấy output:
```
section_key    | status
---------------|--------
hero           | FIXED
mission        | FIXED
values         | FIXED
achievements   | FIXED
timeline       | FIXED
team           | FIXED
```

Tất cả phải là **FIXED**.

### Bước 5: Refresh trang About

1. Mở trang About trên production: https://doctor-appointment-frontend-ujug.onrender.com/about
2. Refresh (Ctrl + F5)
3. Tất cả sections sẽ hiển thị (có thể thiếu một số ảnh)

### Bước 6: Upload lại ảnh (nếu cần)

1. Vào Admin CMS → About Page
2. Chọn tab **Achievements**
3. Upload lại ảnh background
4. Click **"Lưu thay đổi"**

Ảnh mới sẽ tự động dùng Cloudinary URL.

## Nếu không có quyền truy cập Railway Query

Bạn có thể dùng MySQL client:

```bash
# Lấy connection string từ Railway
# Format: mysql://user:password@host:port/database

mysql -h <railway-host> -u <user> -p<password> <database> -e "UPDATE about_page_content SET content_json = REPLACE(content_json, 'http://localhost:8080/api/images/', '') WHERE content_json LIKE '%localhost:8080%';"
```

## Tại sao cần fix?

- Localhost URLs (`http://localhost:8080`) không thể load trên HTTPS production
- Browser chặn Mixed Content (HTTPS page load HTTP resource)
- JavaScript render bị lỗi → Sections không hiển thị

## Sau khi fix

✅ Tất cả sections sẽ hiển thị
✅ Không còn localhost URLs
✅ Có thể thiếu một số ảnh (upload lại qua CMS)
