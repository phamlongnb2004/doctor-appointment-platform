-- Create membership_benefits table
CREATE TABLE IF NOT EXISTS membership_benefits (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL COMMENT 'Tiêu đề section',
    subtitle VARCHAR(500) COMMENT 'Phụ đề',
    benefit_1 VARCHAR(255) COMMENT 'Ưu đãi 1',
    benefit_2 VARCHAR(255) COMMENT 'Ưu đãi 2',
    benefit_3 VARCHAR(255) COMMENT 'Ưu đãi 3',
    benefit_4 VARCHAR(255) COMMENT 'Ưu đãi 4',
    benefit_5 VARCHAR(255) COMMENT 'Ưu đãi 5',
    image_1 VARCHAR(500) COMMENT 'Hình ảnh lớn bên trái',
    image_2 VARCHAR(500) COMMENT 'Hình ảnh nhỏ trên bên phải',
    image_3 VARCHAR(500) COMMENT 'Hình ảnh nhỏ dưới bên phải',
    email_placeholder VARCHAR(255) DEFAULT 'Nhập email của bạn',
    button_1_text VARCHAR(100) DEFAULT 'Đăng ký thành viên',
    button_1_url VARCHAR(255) DEFAULT '/register',
    button_2_text VARCHAR(100) DEFAULT 'Liên hệ chúng tôi',
    button_2_url VARCHAR(255) DEFAULT '/doctors',
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default data
INSERT INTO membership_benefits (
    title,
    subtitle,
    benefit_1,
    benefit_2,
    benefit_3,
    benefit_4,
    benefit_5,
    image_1,
    image_2,
    image_3,
    is_active,
    display_order
) VALUES (
    'ƯU ĐÃI THÀNH VIÊN CỦA MEDLATEC',
    'Đăng ký thành viên để nhận nhiều ưu đãi đặc biệt',
    'Theo dõi lịch sử khám chữa bệnh',
    'Được đăng ký khám và tải khoản với chuyên gia',
    'Tra cứu kết quả nhanh chóng và chi tiết',
    'Nhận thông báo quan trọng và video mới',
    'Được đăng ký các gói khám độc quyền',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=250&fit=crop',
    TRUE,
    1
);

-- Verify
SELECT * FROM membership_benefits;
