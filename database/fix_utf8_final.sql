SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

TRUNCATE TABLE services;
TRUNCATE TABLE news_articles;

INSERT INTO services (title, description, image_url, icon_class, color, button_text, button_url, is_active, display_order, created_at, updated_at) VALUES
('Đặt lịch khám, lấy mẫu tại nhà', 'Quy khách hàng sử dụng tiện ích này để đặt lịch lấy mẫu tại nhà', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400', 'calendar', '#1890ff', 'Đặt lịch', '/doctors', true, 1, NOW(), NOW());

INSERT INTO news_articles (title, excerpt, content, image_url, slug, author, status, is_active, is_featured, display_order, published_at, created_at, updated_at) VALUES
('Nhập viện vì sốt', 'Sốt là triệu chứng rất thường gặp', '<p>Nội dung</p>', 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=300', 'nhap-vien-vi-sot', 'BS. Phạm Thị D', 'APPROVED', true, false, 1, NOW(), NOW(), NOW());