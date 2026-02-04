-- Tạo bảng banners cho slider trang chủ
DROP TABLE IF EXISTS banners;
CREATE TABLE banners (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    image_url VARCHAR(500),
    button_text VARCHAR(100),
    button_url VARCHAR(500),
    background_color VARCHAR(50),
    text_color VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert dữ liệu mẫu
INSERT INTO banners (title, subtitle, description, image_url, button_text, button_url, background_color, text_color, is_active, display_order, created_at, updated_at) VALUES
('SỨC KHỎE ĐỊNH KỲ', 'Khám SỨC KHỎE ĐỊNH KỲ', 'Bảo vệ sức khỏe của đội ngũ - Gia tăng doanh nghiệp', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500', 'Đăng ký ngay: 1900 56 56 56', '/doctors', 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)', '#ffffff', true, 1, NOW(), NOW()),
('KHÁM CHỮA BỆNH CHUYÊN NGHIỆP', 'Đội ngũ bác sĩ giàu kinh nghiệm', 'Trang thiết bị hiện đại - Quy trình chuẩn quốc tế', 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=500', 'Đặt lịch khám', '/doctors', 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', '#ffffff', true, 2, NOW(), NOW()),
('XÉT NGHIỆM NHANH CHÓNG', 'Kết quả chính xác trong 24h', 'Hệ thống xét nghiệm hiện đại nhất Việt Nam', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500', 'Xem dịch vụ', '/doctors', 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)', '#ffffff', true, 3, NOW(), NOW());

SELECT 'Đã tạo bảng banners và thêm 3 banners mẫu!' AS message;
