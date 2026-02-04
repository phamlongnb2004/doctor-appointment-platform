-- Create news_sidebar_widgets table for managing sidebar content
CREATE TABLE IF NOT EXISTS news_sidebar_widgets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    widget_type VARCHAR(50) NOT NULL COMMENT 'hotline, banner, latest-news',
    title VARCHAR(255) NULL,
    subtitle TEXT NULL,
    image_url VARCHAR(500) NULL,
    button_text VARCHAR(100) NULL,
    button_url VARCHAR(500) NULL,
    hotline VARCHAR(50) NULL,
    description TEXT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default hotline widget
INSERT INTO news_sidebar_widgets (widget_type, title, subtitle, hotline, description, button_text, button_url, display_order, is_active, image_url) VALUES
('hotline', 'Hotline', '1900565656', '1900565656', 'Liên hệ ngay với số hotline của MEDLATEC để được phục vụ và sử dụng các dịch vụ khám, chữa bệnh hiện đại & cao cấp nhất.', 'Liên hệ với chúng tôi', '/contact', 1, TRUE, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500'),
('banner', 'HỆ THỐNG Y TẾ MEDLATEC', 'THƯƠNG HIỆU QUỐC GIA VIỆT NAM VÀ TIÊU CHUẨN CHẤT LƯỢNG QUỐC TẾ', NULL, NULL, NULL, NULL, 2, TRUE, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500');
