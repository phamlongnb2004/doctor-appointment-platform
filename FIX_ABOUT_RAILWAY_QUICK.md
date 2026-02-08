# Fix About Page Railway - Quick Guide

## Các bước thực hiện

### 1. Vào Railway MySQL Query
- Mở https://railway.app
- Chọn project → MySQL service
- Click tab **"Query"**

### 2. Copy & Run SQL này

```sql
UPDATE about_page_content 
SET content_json = REPLACE(content_json, 'http://localhost:8080/api/images/', '')
WHERE content_json LIKE '%localhost:8080%';
```

Click **Run**

### 3. Kiểm tra

```sql
SELECT section_key, 
       CASE WHEN content_json LIKE '%localhost%' THEN 'BAD' ELSE 'OK' END 
FROM about_page_content;
```

Tất cả phải là **OK**

### 4. Refresh trang About

https://doctor-appointment-frontend-ujug.onrender.com/about

Tất cả sections sẽ hiển thị!

---

**Lưu ý**: Một số ảnh có thể bị mất, upload lại qua Admin CMS → About Page
