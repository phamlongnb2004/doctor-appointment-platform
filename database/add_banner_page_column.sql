-- Thêm cột page vào bảng banners để phân biệt banner cho từng trang
ALTER TABLE banners 
ADD COLUMN page VARCHAR(50) DEFAULT 'home' AFTER display_order;

-- Cập nhật tất cả banner hiện tại thành 'home'
UPDATE banners SET page = 'home' WHERE page IS NULL;

-- Thêm index cho cột page
CREATE INDEX idx_banners_page ON banners(page);

-- Thêm một số banner mẫu cho trang tin tức
INSERT INTO banners (image_url, display_order, page, is_active, created_at, updated_at) VALUES
('https://via.placeholder.com/1920x400/667eea/ffffff?text=Tin+Tức+Y+Khoa', 1, 'news', true, NOW(), NOW()),
('https://via.placeholder.com/1920x400/764ba2/ffffff?text=Cập+Nhật+Sức+Khỏe', 2, 'news', true, NOW(), NOW());
