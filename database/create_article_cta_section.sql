-- Create table for Article CTA (Call-to-Action) Section
-- This section appears at the bottom of article detail pages

CREATE TABLE IF NOT EXISTS article_cta_section (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL COMMENT 'Section title',
    subtitle TEXT COMMENT 'Section subtitle/description',
    
    -- CTA Item 1
    cta1_image VARCHAR(500) COMMENT 'CTA 1 image URL',
    cta1_title VARCHAR(255) COMMENT 'CTA 1 title',
    cta1_description TEXT COMMENT 'CTA 1 description',
    cta1_button_text VARCHAR(100) COMMENT 'CTA 1 button text',
    cta1_button_url VARCHAR(500) COMMENT 'CTA 1 button URL',
    
    -- CTA Item 2
    cta2_image VARCHAR(500) COMMENT 'CTA 2 image URL',
    cta2_title VARCHAR(255) COMMENT 'CTA 2 title',
    cta2_description TEXT COMMENT 'CTA 2 description',
    cta2_button_text VARCHAR(100) COMMENT 'CTA 2 button text',
    cta2_button_url VARCHAR(500) COMMENT 'CTA 2 button URL',
    
    background_color VARCHAR(50) DEFAULT '#1890ff' COMMENT 'Section background color',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default data
INSERT INTO article_cta_section (
    title,
    subtitle,
    cta1_image,
    cta1_title,
    cta1_description,
    cta1_button_text,
    cta1_button_url,
    cta2_image,
    cta2_title,
    cta2_description,
    cta2_button_text,
    cta2_button_url,
    background_color
) VALUES (
    'Lựa chọn dịch vụ',
    'Quý khách hàng vui lòng lựa chọn dịch vụ y tế theo nhu cầu',
    '/api/placeholder/400/300',
    'Lấy mẫu xét nghiệm tại nhà',
    'Lấy mẫu xét nghiệm tại nhà giúp khách hàng chủ động tầm soát bệnh lý. Đồng thời tiết kiệm thời gian đi lại, cho đối kết quả với mức chi phí hợp lý.',
    'Đặt lịch',
    '/appointment',
    '/api/placeholder/400/300',
    'Đặt lịch thăm khám tại MEDLATEC',
    'Đặt lịch khám tại cơ sở khám chữa bệnh thuộc Hệ thống Y tế MEDLATEC giúp chủ động thời gian, hạn chế tiếp xúc đông người.',
    'Đặt lịch',
    '/appointment',
    '#1890ff'
);
