-- Create features table for "Why Choose Us" section
CREATE TABLE IF NOT EXISTS features (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO features (title, description, icon, color, is_active, display_order, created_at, updated_at) VALUES
('Đội ngũ chuyên gia', '200+ bác sĩ chuyên khoa hàng đầu với nhiều năm kinh nghiệm', '👨‍⚕️', 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)', true, 1, NOW(), NOW()),
('Cơ sở hiện đại', 'Trang thiết bị y tế tiên tiến, đạt chuẩn quốc tế', '🏥', 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', true, 2, NOW(), NOW()),
('Phục vụ 24/7', 'Sẵn sàng hỗ trợ khách hàng mọi lúc, mọi nơi', '⏰', 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)', true, 3, NOW(), NOW()),
('An toàn tuyệt đối', 'Tuân thủ nghiêm ngặt các quy chuẩn an toàn y tế', '🛡️', 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)', true, 4, NOW(), NOW());
