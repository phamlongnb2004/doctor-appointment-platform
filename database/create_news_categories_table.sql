-- Create news_categories table
CREATE TABLE IF NOT EXISTS news_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    color VARCHAR(50) DEFAULT '#667eea',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default categories
INSERT INTO news_categories (name, slug, description, color, display_order) VALUES
('Tin tức y khoa', 'tin-tuc-y-khoa', 'Tin tức và cập nhật mới nhất về y khoa', '#1890ff', 1),
('Sức khỏe tổng quát', 'suc-khoe-tong-quat', 'Thông tin về sức khỏe và chăm sóc sức khỏe', '#52c41a', 2),
('Dinh dưỡng', 'dinh-duong', 'Kiến thức về dinh dưỡng và chế độ ăn uống', '#faad14', 3),
('Chuyên khoa', 'chuyen-khoa', 'Thông tin về các chuyên khoa y tế', '#722ed1', 4),
('Phòng bệnh', 'phong-benh', 'Hướng dẫn phòng ngừa bệnh tật', '#13c2c2', 5),
('Làm đẹp', 'lam-dep', 'Mẹo làm đẹp và chăm sóc da', '#eb2f96', 6),
('Sức khỏe tâm thần', 'suc-khoe-tam-than', 'Chăm sóc sức khỏe tinh thần', '#2f54eb', 7);

-- Show result
SELECT * FROM news_categories ORDER BY display_order;
