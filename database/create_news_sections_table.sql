-- Create news_sections table for managing news sections
CREATE TABLE IF NOT EXISTS news_sections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE COMMENT 'Tên section (slug)',
    title VARCHAR(255) NOT NULL COMMENT 'Tiêu đề hiển thị',
    description TEXT COMMENT 'Mô tả section',
    display_order INT DEFAULT 0 COMMENT 'Thứ tự hiển thị',
    background_color VARCHAR(50) DEFAULT '#fff' COMMENT 'Màu nền',
    title_align VARCHAR(20) DEFAULT 'left' COMMENT 'Căn lề tiêu đề: left, center, right',
    articles_limit INT DEFAULT 4 COMMENT 'Số lượng bài viết hiển thị',
    show_more_button BOOLEAN DEFAULT TRUE COMMENT 'Hiển thị nút xem thêm',
    more_button_text VARCHAR(100) DEFAULT 'Xem thêm' COMMENT 'Text nút xem thêm',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Trạng thái hoạt động',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default sections
INSERT INTO news_sections (name, title, description, display_order, background_color, title_align, articles_limit, show_more_button, more_button_text, is_active) VALUES
('featured', 'TIN TỨC NỔI BẬT', 'Những tin tức nổi bật và quan trọng nhất', 1, '#f8f9fa', 'center', 4, TRUE, 'Xem tất cả tin nổi bật', TRUE),
('medlatec', 'Y KHOA MEDLATEC', 'Tin tức về y khoa và dịch vụ của MEDLATEC', 2, '#fff', 'left', 4, TRUE, 'Xem thêm', TRUE),
('health', 'SỨC KHỎE CỘNG ĐỒNG', 'Thông tin sức khỏe hữu ích cho cộng đồng', 3, '#f0f9ff', 'center', 3, TRUE, 'Đọc thêm', TRUE),
('medical-topics', 'CHUYÊN ĐỀ Y HỌC', 'Các chuyên đề y học chuyên sâu', 4, '#fff', 'left', 4, TRUE, 'Xem tất cả chuyên đề', TRUE);

-- Add section_name column to news_articles table if not exists
ALTER TABLE news_articles 
ADD COLUMN section_name VARCHAR(255) DEFAULT 'medlatec' COMMENT 'Tên section (foreign key to news_sections.name)';

-- Add index for better performance
ALTER TABLE news_articles 
ADD INDEX idx_section_name (section_name);

-- Add foreign key constraint
ALTER TABLE news_articles
ADD CONSTRAINT fk_news_section
FOREIGN KEY (section_name) REFERENCES news_sections(name)
ON UPDATE CASCADE
ON DELETE SET NULL;
