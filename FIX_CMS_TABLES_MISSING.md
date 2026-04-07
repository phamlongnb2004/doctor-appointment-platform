# Fix: CMS Tables Missing After Deploy

## Vấn đề
Mỗi lần deploy lên Render, Hibernate xóa và tạo lại tất cả bảng, làm mất data CMS.

## Nguyên nhân
Cấu hình `hibernate.hbm2ddl.auto: create` trong `application-prod.yml` đang xóa và tạo lại bảng.

## Giải pháp

### 1. Đã sửa cấu hình Hibernate

**File: `backend/src/main/resources/application-prod.yml`**

Thay đổi từ:
```yaml
jpa:
  hibernate:
    ddl-auto: validate
  properties:
    hibernate:
      hbm2ddl:
        auto: create  # ❌ XÓA VÀ TẠO LẠI BẢNG
```

Sang:
```yaml
jpa:
  hibernate:
    ddl-auto: update  # ✅ CHỈ CẬP NHẬT SCHEMA
  properties:
    hibernate:
      # Xóa hbm2ddl.auto: create
```

### 2. Chạy script để tạo lại bảng CMS

#### Option A: Chạy SQL trực tiếp trên Render

1. Vào Render Dashboard
2. Chọn PostgreSQL database
3. Tab **Shell** hoặc connect qua psql
4. Copy nội dung file `database/ensure_cms_tables.sql`
5. Paste và chạy

#### Option B: Chạy Python script (Khuyến nghị)

**Local:**
```bash
# Set environment variable
set DATABASE_URL=postgresql://user:password@host:port/database

# Chạy script
python ensure_cms_tables.py
```

**Trên Render (qua Shell):**
```bash
python ensure_cms_tables.py
```

### 3. Verify bảng đã tồn tại

```sql
-- Kiểm tra các bảng CMS
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'home_page_content',
    'banners',
    'site_settings',
    'about_page_content',
    'certifications',
    'features',
    'statistics',
    'membership_benefits',
    'news_sections',
    'news_sidebar_widgets',
    'article_cta_section'
)
ORDER BY table_name;
```

Kết quả mong đợi: 11 bảng

### 4. Insert data mẫu (nếu cần)

Nếu bảng trống, chạy:
```bash
python insert_cms_data.py
```

Hoặc chạy SQL:
```sql
-- File: database/cms_initial_data.sql
```

## Các chế độ ddl-auto

| Mode | Mô tả | Khi nào dùng |
|------|-------|--------------|
| `create` | Xóa và tạo lại bảng mỗi lần start | ❌ KHÔNG BAO GIỜ dùng production |
| `create-drop` | Tạo khi start, xóa khi stop | ❌ Chỉ dùng test |
| `update` | Cập nhật schema, giữ data | ✅ Dùng cho development/production |
| `validate` | Chỉ kiểm tra, không thay đổi | ✅ Dùng khi schema đã ổn định |
| `none` | Không làm gì | ✅ Dùng khi quản lý schema thủ công |

## Khuyến nghị cho Production

**Best practice:**
1. Dùng `ddl-auto: validate` hoặc `none`
2. Quản lý schema bằng migration tools (Flyway, Liquibase)
3. Không để Hibernate tự động tạo/sửa bảng

**Hiện tại:**
- Dùng `ddl-auto: update` để tự động cập nhật schema
- Phù hợp cho giai đoạn development/staging
- Cần chuyển sang `validate` khi production ổn định

## Checklist sau mỗi lần deploy

- [ ] Kiểm tra logs không có lỗi "table not found"
- [ ] Verify các bảng CMS tồn tại
- [ ] Test các trang CMS (Home, About, etc.)
- [ ] Kiểm tra data không bị mất

## Troubleshooting

### Lỗi: "relation does not exist"

**Nguyên nhân:** Bảng chưa được tạo

**Giải pháp:**
```bash
python ensure_cms_tables.py
```

### Lỗi: "column does not exist"

**Nguyên nhân:** Schema cũ, thiếu column mới

**Giải pháp:**
1. Dùng `ddl-auto: update` để tự động thêm column
2. Hoặc chạy ALTER TABLE thủ công

### Data bị mất sau deploy

**Nguyên nhân:** Vẫn đang dùng `create` mode

**Giải pháp:**
1. Kiểm tra lại `application-prod.yml`
2. Đảm bảo không có `hbm2ddl.auto: create`
3. Restore data từ backup

## Backup & Restore

### Backup trước khi deploy
```bash
pg_dump -h host -U user -d database > backup.sql
```

### Restore nếu cần
```bash
psql -h host -U user -d database < backup.sql
```
