-- Script để đảm bảo các bảng CMS tồn tại
-- Chạy script này sau mỗi lần deploy nếu cần

-- 1. Kiểm tra và tạo bảng home_page_content
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

-- 2. Kiểm tra và tạo bảng banners
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

-- 3. Kiểm tra và tạo bảng site_settings
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

-- 4. Kiểm tra và tạo bảng about_page_content
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

-- 5. Kiểm tra và tạo bảng certifications
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

-- 6. Kiểm tra và tạo bảng features
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

-- 7. Kiểm tra và tạo bảng statistics
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

-- 8. Kiểm tra và tạo bảng membership_benefits
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

-- 9. Kiểm tra và tạo bảng news_sections
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

-- 10. Kiểm tra và tạo bảng news_sidebar_widgets
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

-- 11. Kiểm tra và tạo bảng article_cta_section
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

-- Insert default data nếu bảng trống
INSERT INTO home_page_content (id, hero_title, hero_subtitle, hero_description)
SELECT 1, 'Chào mừng đến với MEDLATEC', 'Hệ thống y tế hàng đầu', 'Chăm sóc sức khỏe toàn diện'
WHERE NOT EXISTS (SELECT 1 FROM home_page_content WHERE id = 1);

INSERT INTO site_settings (id, site_name, contact_email, contact_phone)
SELECT 1, 'MEDLATEC', 'contact@medlatec.com', '1900-xxxx'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE id = 1);

-- Thông báo hoàn tất
SELECT 'CMS tables checked and created if needed' AS status;
