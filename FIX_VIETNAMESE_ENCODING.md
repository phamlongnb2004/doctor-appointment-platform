# Hướng dẫn sửa lỗi encoding tiếng Việt

## Vấn đề
Dữ liệu tiếng Việt hiển thị sai: `Nh???p vi???n v?? s???t` thay vì `Nhập viện vì sốt`

## Nguyên nhân
- Database hoặc bảng không sử dụng UTF-8
- Connection string thiếu cấu hình UTF-8
- Dữ liệu đã bị lưu sai encoding

## Giải pháp

### Bước 1: Cập nhật cấu hình Backend

File `backend/src/main/resources/application.yml` đã được cập nhật với:

```yaml
datasource:
  url: jdbc:mysql://localhost:3306/doctor_appointment_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&useUnicode=true

jpa:
  properties:
    hibernate:
      connection:
        characterEncoding: utf-8
        CharSet: utf-8
        useUnicode: true
```

### Bước 2: Sửa encoding của Database

Chạy script SQL sau trong MySQL:

```bash
mysql -u root -p doctor_appointment_db < database/fix_utf8_encoding.sql
```

Hoặc chạy trực tiếp trong MySQL Workbench:

```sql
-- Set database to UTF-8
ALTER DATABASE doctor_appointment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Fix all tables
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE doctors CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE news_articles CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE services CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE home_page_content CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE testimonials CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- ... (xem file fix_utf8_encoding.sql để có danh sách đầy đủ)
```

### Bước 3: Kiểm tra encoding hiện tại

Chạy script kiểm tra:

```bash
mysql -u root -p doctor_appointment_db < database/check_and_fix_data.sql
```

Hoặc chạy query:

```sql
-- Kiểm tra encoding của database
SELECT 
    DEFAULT_CHARACTER_SET_NAME,
    DEFAULT_COLLATION_NAME
FROM 
    information_schema.SCHEMATA
WHERE 
    SCHEMA_NAME = 'doctor_appointment_db';

-- Kết quả mong đợi:
-- DEFAULT_CHARACTER_SET_NAME: utf8mb4
-- DEFAULT_COLLATION_NAME: utf8mb4_unicode_ci
```

### Bước 4: Sửa dữ liệu đã bị lỗi

Nếu dữ liệu đã bị lưu sai, bạn cần:

#### Option 1: Xóa và nhập lại dữ liệu

```sql
-- Xóa dữ liệu cũ
DELETE FROM news_articles;
DELETE FROM services;
DELETE FROM home_page_content;
DELETE FROM testimonials;

-- Nhập lại dữ liệu từ file SQL
SOURCE database/cms_initial_data.sql;
```

#### Option 2: Sửa từng record

```sql
-- Ví dụ sửa một bài viết
UPDATE news_articles 
SET 
    title = 'Nhập viện vì sốt, người đàn ông bất ngờ được chẩn đoán...',
    excerpt = 'Sốt là triệu chứng rất thường gặp trong lâm sàng...'
WHERE id = 1;
```

#### Option 3: Export và Import lại

```bash
# Export dữ liệu với UTF-8
mysqldump -u root -p --default-character-set=utf8mb4 doctor_appointment_db > backup.sql

# Import lại
mysql -u root -p --default-character-set=utf8mb4 doctor_appointment_db < backup.sql
```

### Bước 5: Restart Backend

Sau khi sửa xong, restart Spring Boot application:

```bash
cd backend
mvn spring-boot:run
```

### Bước 6: Kiểm tra Frontend

1. Mở trình duyệt: `http://localhost:3000`
2. Kiểm tra các trang có tiếng Việt:
   - Trang chủ
   - Tin tức
   - Bài viết bác sĩ
   - Dịch vụ

## Kiểm tra nhanh

### Trong MySQL

```sql
-- Kiểm tra một bài viết
SELECT id, title, excerpt FROM news_articles LIMIT 1;

-- Nếu hiển thị đúng tiếng Việt → OK
-- Nếu vẫn lỗi → Cần sửa dữ liệu
```

### Trong Backend Log

Khi start backend, kiểm tra log:

```
Hibernate: 
    select ...
    from news_articles
```

Nếu thấy tiếng Việt hiển thị đúng trong log → Backend OK

### Trong Frontend

Mở Developer Console (F12) → Network → Chọn API call → Response

Nếu response JSON có tiếng Việt đúng → API OK

## Ngăn chặn vấn đề trong tương lai

### 1. Luôn sử dụng UTF-8 khi tạo database

```sql
CREATE DATABASE my_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### 2. Luôn set connection encoding

```yaml
# application.yml
datasource:
  url: jdbc:mysql://localhost:3306/db?characterEncoding=UTF-8&useUnicode=true
```

### 3. Kiểm tra encoding khi import data

```bash
# Luôn dùng --default-character-set=utf8mb4
mysql -u root -p --default-character-set=utf8mb4 db < data.sql
```

### 4. Set MySQL client encoding

Trong MySQL Workbench hoặc command line:

```sql
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
```

## Troubleshooting

### Vấn đề: Sau khi sửa vẫn lỗi

**Giải pháp**:
1. Kiểm tra lại connection string
2. Restart MySQL server
3. Restart Spring Boot
4. Clear browser cache
5. Kiểm tra dữ liệu trong database trực tiếp

### Vấn đề: Dữ liệu mới OK, dữ liệu cũ vẫn lỗi

**Giải pháp**:
- Dữ liệu cũ đã bị lưu sai, cần xóa và nhập lại
- Hoặc update từng record bằng tay

### Vấn đề: MySQL Workbench hiển thị sai

**Giải pháp**:
1. Edit Connection → Advanced
2. Set "Use Unicode": Yes
3. Set "Character Set": utf8mb4
4. Reconnect

### Vấn đề: Command line hiển thị sai

**Giải pháp**:
```bash
# Windows
chcp 65001

# Linux/Mac
export LANG=en_US.UTF-8

# Trong MySQL
SET NAMES utf8mb4;
```

## Files đã cập nhật

- ✅ `backend/src/main/resources/application.yml` - Thêm UTF-8 config
- ✅ `database/fix_utf8_encoding.sql` - Script sửa encoding
- ✅ `database/check_and_fix_data.sql` - Script kiểm tra
- ✅ `FIX_VIETNAMESE_ENCODING.md` - Hướng dẫn này

## Checklist

- [ ] Chạy `fix_utf8_encoding.sql`
- [ ] Kiểm tra encoding với `check_and_fix_data.sql`
- [ ] Xóa và nhập lại dữ liệu nếu cần
- [ ] Restart backend
- [ ] Kiểm tra frontend
- [ ] Test tạo dữ liệu mới
- [ ] Verify tiếng Việt hiển thị đúng

## Kết luận

Sau khi làm theo các bước trên, tất cả dữ liệu tiếng Việt sẽ hiển thị đúng. Nếu vẫn gặp vấn đề, hãy kiểm tra lại từng bước và đảm bảo:

1. Database encoding: utf8mb4
2. Table encoding: utf8mb4
3. Connection string có UTF-8
4. Dữ liệu được nhập với UTF-8

**Lưu ý quan trọng**: Luôn backup database trước khi chạy các script ALTER TABLE!
