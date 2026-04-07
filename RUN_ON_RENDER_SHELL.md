# Hướng dẫn chạy script trực tiếp trên Render Shell

## Bước 1: Mở Render Shell

1. Vào: https://dashboard.render.com
2. Chọn service: **doctor-appointment-backend-mq2p**
3. Click tab **Shell** (góc phải trên)
4. Đợi shell load xong (sẽ thấy dấu nhắc `$`)

## Bước 2: Tạo file SQL

Copy và paste từng lệnh sau vào Shell:

```bash
# Tạo file SQL
cat > /tmp/ensure_cms_tables.sql << 'EOF'
-- Script để đảm bảo các bảng CMS tồn tại

CREATE TABLE IF NOT EXISTS home_page_content (
    id BIGSERIAL PRIMARY KEY,
    hero_title VARCHAR(500),
    hero_subtitle TEXT,
    hero_description TEXT,
    hero_button_text VARCHAR(100),
    hero_button_link VARCHAR(500),
    hero_image_url VARCHAR(1000),
    hero_background_url VARCHAR(1000),
    about_title VARCHAR(500),
    about_description TEXT,
    about_image_url VARCHAR(1000),
    services_title VARCHAR(500),
    services_description TEXT,
    doctors_title VARCHAR(500),
    doctors_description TEXT,
    testimonials_title VARCHAR(500),
    testimonials_description TEXT,
    cta_title VARCHAR(500),
    cta_description TEXT,
    cta_button_text VARCHAR(100),
    cta_button_link VARCHAR(500),
    cta_background_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS banners (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500),
    subtitle TEXT,
    description TEXT,
    button_text VARCHAR(100),
    button_link VARCHAR(500),
    image_url VARCHAR(1000),
    background_url VARCHAR(1000),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    page VARCHAR(50) DEFAULT 'home',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
    id BIGSERIAL PRIMARY KEY,
    site_name VARCHAR(255),
    site_logo VARCHAR(1000),
    site_favicon VARCHAR(1000),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_address TEXT,
    facebook_url VARCHAR(500),
    twitter_url VARCHAR(500),
    instagram_url VARCHAR(500),
    youtube_url VARCHAR(500),
    working_hours TEXT,
    footer_text TEXT,
    header_announcement TEXT,
    header_announcement_link VARCHAR(500),
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(100),
    bank_account_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about_page_content (
    id BIGSERIAL PRIMARY KEY,
    hero_title VARCHAR(500),
    hero_subtitle TEXT,
    hero_image_url VARCHAR(1000),
    mission_title VARCHAR(500),
    mission_description TEXT,
    vision_title VARCHAR(500),
    vision_description TEXT,
    values_title VARCHAR(500),
    values_description TEXT,
    history_title VARCHAR(500),
    history_description TEXT,
    team_title VARCHAR(500),
    team_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certifications (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(1000),
    issuer VARCHAR(255),
    issue_date DATE,
    expiry_date DATE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS features (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS statistics (
    id BIGSERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    value VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    background_color VARCHAR(50),
    text_color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS membership_benefits (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news_sections (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    layout_type VARCHAR(50) DEFAULT 'grid',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    page VARCHAR(50) DEFAULT 'home',
    category_filter BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news_sidebar_widgets (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    widget_type VARCHAR(50) NOT NULL,
    content TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS article_cta_section (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500),
    description TEXT,
    button_text VARCHAR(100),
    button_link VARCHAR(500),
    background_color VARCHAR(50),
    text_color VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default data
INSERT INTO home_page_content (id, hero_title, hero_subtitle, hero_description)
SELECT 1, 'Chào mừng đến với MEDLATEC', 'Hệ thống y tế hàng đầu', 'Chăm sóc sức khỏe toàn diện'
WHERE NOT EXISTS (SELECT 1 FROM home_page_content WHERE id = 1);

INSERT INTO site_settings (id, site_name, contact_email, contact_phone)
SELECT 1, 'MEDLATEC', 'contact@medlatec.com', '1900-xxxx'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE id = 1);

SELECT 'CMS tables created successfully!' AS status;
EOF
```

## Bước 3: Chạy SQL

```bash
# Parse DATABASE_URL và chạy SQL
python3 << 'PYTHON_EOF'
import os
import psycopg2
from urllib.parse import urlparse

# Lấy DATABASE_URL từ environment
database_url = os.getenv('DATABASE_URL')
if not database_url:
    print("ERROR: DATABASE_URL not found!")
    exit(1)

print(f"Connecting to database...")

# Parse URL
result = urlparse(database_url)
conn = psycopg2.connect(
    host=result.hostname,
    port=result.port,
    database=result.path[1:],
    user=result.username,
    password=result.password
)

cursor = conn.cursor()

# Đọc và chạy SQL
print("Reading SQL file...")
with open('/tmp/ensure_cms_tables.sql', 'r') as f:
    sql = f.read()

print("Executing SQL...")
cursor.execute(sql)
conn.commit()

# Kiểm tra bảng
print("\nChecking tables...")
cursor.execute("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
        'home_page_content', 'banners', 'site_settings',
        'about_page_content', 'certifications', 'features',
        'statistics', 'membership_benefits', 'news_sections',
        'news_sidebar_widgets', 'article_cta_section'
    )
    ORDER BY table_name;
""")

tables = cursor.fetchall()
print(f"\nFound {len(tables)} CMS tables:")
for table in tables:
    print(f"  ✓ {table[0]}")

cursor.close()
conn.close()

print("\n✅ Done!")
PYTHON_EOF
```

## Bước 4: Verify

Kiểm tra bảng đã tồn tại:

```bash
python3 << 'PYTHON_EOF'
import os
import psycopg2
from urllib.parse import urlparse

database_url = os.getenv('DATABASE_URL')
result = urlparse(database_url)
conn = psycopg2.connect(
    host=result.hostname,
    port=result.port,
    database=result.path[1:],
    user=result.username,
    password=result.password
)

cursor = conn.cursor()
cursor.execute("""
    SELECT COUNT(*) 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
        'home_page_content', 'banners', 'site_settings',
        'about_page_content', 'certifications', 'features',
        'statistics', 'membership_benefits', 'news_sections',
        'news_sidebar_widgets', 'article_cta_section'
    );
""")

count = cursor.fetchone()[0]
print(f"CMS tables found: {count}/11")

if count == 11:
    print("✅ All CMS tables exist!")
else:
    print("⚠️  Some tables are missing!")

cursor.close()
conn.close()
PYTHON_EOF
```

## Nếu gặp lỗi

### Lỗi: psycopg2 not found

```bash
pip install psycopg2-binary
```

Sau đó chạy lại Bước 3.

### Lỗi: DATABASE_URL not found

```bash
# Kiểm tra biến môi trường
echo $DATABASE_URL
```

Nếu không có, liên hệ để lấy DATABASE_URL.

## Hoàn tất

Sau khi chạy xong:
1. Restart backend service (nếu cần)
2. Test website: https://doctor-appointment-frontend-ujug.onrender.com
3. Kiểm tra không còn lỗi 500

---

**Lưu ý:** Script này an toàn, chỉ tạo bảng nếu chưa tồn tại, không xóa data.
