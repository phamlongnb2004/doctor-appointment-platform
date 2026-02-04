-- ============================================
-- COMPLETE HARDCODE REMOVAL SQL SCRIPT
-- Tạo tất cả bảng và dữ liệu cần thiết
-- ============================================

-- 1. CREATE SPECIALTIES TABLE
CREATE TABLE IF NOT EXISTS specialties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(50),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert specialties data
INSERT INTO specialties (name, icon, color, description, is_active, display_order, created_at, updated_at) VALUES
('Chuyên khoa Nội', '🫁', '#1890ff', 'Khám và điều trị các bệnh lý nội khoa', true, 1, NOW(), NOW()),
('Ung bướu', '🎗️', '#52c41a', 'Chẩn đoán và điều trị ung thư', true, 2, NOW(), NOW()),
('Chuyên khoa Sản Phụ khoa', '👶', '#fa8c16', 'Chăm sóc sức khỏe phụ nữ và thai sản', true, 3, NOW(), NOW()),
('Chẩn đoán hình ảnh', '📷', '#1890ff', 'X-quang, CT, MRI, siêu âm', true, 4, NOW(), NOW()),
('Trung tâm xét nghiệm MEDLATEC', '🔬', '#722ed1', 'Xét nghiệm máu, nước tiểu, sinh hóa', true, 5, NOW(), NOW()),
('Khoa ngoại', '⚕️', '#eb2f96', 'Phẫu thuật và điều trị ngoại khoa', true, 6, NOW(), NOW()),
('Tiêu hóa', '🫄', '#13c2c2', 'Điều trị bệnh lý đường tiêu hóa', true, 7, NOW(), NOW()),
('Nội tiết', '🩺', '#a0d911', 'Điều trị rối loạn nội tiết tố', true, 8, NOW(), NOW()),
('Tim mạch', '❤️', '#f5222d', 'Khám và điều trị bệnh tim mạch', true, 9, NOW(), NOW()),
('Nam khoa', '👨', '#1890ff', 'Chăm sóc sức khỏe nam giới', true, 10, NOW(), NOW()),
('Chuyên khoa Cơ xương khớp', '🦴', '#52c41a', 'Điều trị bệnh lý xương khớp', true, 11, NOW(), NOW()),
('Truyền nhiễm', '🦠', '#fa8c16', 'Điều trị các bệnh truyền nhiễm', true, 12, NOW(), NOW()),
('Thần kinh', '🧠', '#722ed1', 'Điều trị bệnh lý thần kinh', true, 13, NOW(), NOW()),
('Nhi khoa', '👶', '#eb2f96', 'Chăm sóc sức khỏe trẻ em', true, 14, NOW(), NOW()),
('Mắt', '👁️', '#13c2c2', 'Khám và điều trị bệnh về mắt', true, 15, NOW(), NOW()),
('Tai mũi họng', '👂', '#a0d911', 'Điều trị bệnh tai mũi họng', true, 16, NOW(), NOW()),
('Da liễu', '🧴', '#f5222d', 'Điều trị bệnh lý da liễu', true, 17, NOW(), NOW()),
('Răng hàm mặt', '🦷', '#1890ff', 'Chăm sóc sức khỏe răng miệng', true, 18, NOW(), NOW());

-- 2. CREATE CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS certifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(50),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert certifications data
INSERT INTO certifications (name, icon, color, description, is_active, display_order, created_at, updated_at) VALUES
('ISO 15189:2022', '🏆', '#1890ff', 'Chứng nhận chất lượng phòng xét nghiệm', true, 1, NOW(), NOW()),
('CAP ACCREDITED', '✅', '#52c41a', 'Công nhận của Hiệp hội Bệnh lý Hoa Kỳ', true, 2, NOW(), NOW()),
('BỘ Y TẾ', '🎖️', '#fa8c16', 'Giấy phép hoạt động của Bộ Y tế', true, 3, NOW(), NOW()),
('TOP 10 VN', '🌟', '#722ed1', 'Top 10 bệnh viện tư nhân uy tín', true, 4, NOW(), NOW()),
('JCI STANDARD', '🏥', '#eb2f96', 'Tiêu chuẩn chất lượng quốc tế JCI', true, 5, NOW(), NOW()),
('NABL CERTIFIED', '🔬', '#13c2c2', 'Chứng nhận phòng thí nghiệm NABL', true, 6, NOW(), NOW());

-- 3. UPDATE HOMEPAGE_CONTENT FOR STATISTICS
INSERT INTO homepage_content (section_key, title, subtitle, content, image_url, button_text, button_url, extra_data, is_active, display_order, created_at, updated_at) VALUES
('statistics', 'MEDLATEC TRONG SỐ LIỆU', 'Những con số ấn tượng khẳng định uy tín và chất lượng dịch vụ', NULL, NULL, NULL, NULL, 
'{"stats": [
  {"value": "30+", "label": "Năm kinh nghiệm"},
  {"value": "500K+", "label": "Bệnh nhân tin tưởng"},
  {"value": "200+", "label": "Bác sĩ chuyên khoa"},
  {"value": "98%", "label": "Hài lòng dịch vụ"}
]}', 
true, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  title = 'MEDLATEC TRONG SỐ LIỆU',
  subtitle = 'Những con số ấn tượng khẳng định uy tín và chất lượng dịch vụ',
  extra_data = '{"stats": [
    {"value": "30+", "label": "Năm kinh nghiệm"},
    {"value": "500K+", "label": "Bệnh nhân tin tưởng"},
    {"value": "200+", "label": "Bác sĩ chuyên khoa"},
    {"value": "98%", "label": "Hài lòng dịch vụ"}
  ]}',
  updated_at = NOW();

-- 4. UPDATE HOMEPAGE_CONTENT FOR INFRASTRUCTURE
INSERT INTO homepage_content (section_key, title, subtitle, content, image_url, button_text, button_url, extra_data, is_active, display_order, created_at, updated_at) VALUES
('infrastructure', 'CƠ SỞ VẬT CHẤT', NULL, 
'Hệ thống Y tế MEDLATEC (viết tắt là MEDLATEC GROUP) gồm 01 Bệnh viện đa khoa, 41 Phòng khám tại Việt Nam, 01 Phòng khám tại Campuchia và hơn 100 văn phòng lấy mẫu tận nơi trên toàn quốc. Mỗi cơ sở khám chữa bệnh có năng lực đáp ứng hơn 1.000 lượt khám mỗi ngày với cơ sở vật chất khang trang, trang thiết bị hiện đại, đồng bộ cho kết quả khám, chẩn đoán và điều trị chính xác, hiệu quả.', 
'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600', 
'Xem chi tiết', 
'/about', 
'{"images": [
  "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300"
]}',
true, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  title = 'CƠ SỞ VẬT CHẤT',
  content = 'Hệ thống Y tế MEDLATEC (viết tắt là MEDLATEC GROUP) gồm 01 Bệnh viện đa khoa, 41 Phòng khám tại Việt Nam, 01 Phòng khám tại Campuchia và hơn 100 văn phòng lấy mẫu tận nơi trên toàn quốc. Mỗi cơ sở khám chữa bệnh có năng lực đáp ứng hơn 1.000 lượt khám mỗi ngày với cơ sở vật chất khang trang, trang thiết bị hiện đại, đồng bộ cho kết quả khám, chẩn đoán và điều trị chính xác, hiệu quả.',
  image_url = 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600',
  button_text = 'Xem chi tiết',
  button_url = '/about',
  extra_data = '{"images": [
    "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300"
  ]}',
  updated_at = NOW();

-- 5. ADD MORE SERVICES FOR THE 3-CARD SECTION
INSERT INTO services (title, description, image_url, icon_class, color, button_text, button_url, is_active, display_order, created_at, updated_at) VALUES
('Khám sức khỏe cho doanh nghiệp', 'Khám sức khỏe cho CBNV doanh nghiệp theo quy định. Đáp ứng đa dạng nhu cầu khám của đơn vị', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400', 'team', '#1890ff', 'Đặt lịch', '/appointment', true, 5, NOW(), NOW()),
('Lấy mẫu xét nghiệm tận nơi', 'Tiết kiệm thời gian, chi phí, không cần xếp hàng chờ đợi, tránh lây nhiễm chéo', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400', 'home', '#52c41a', 'Đặt lịch', '/appointment', true, 6, NOW(), NOW()),
('Khám chữa bệnh chủ động', 'Khám chữa bệnh đầy đủ chuyên khoa, khám sức khỏe tổng quát định kỳ cho người dân', 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400', 'medical-box', '#fa8c16', 'Đặt lịch', '/appointment', true, 7, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  description = VALUES(description),
  updated_at = NOW();

-- Done!
SELECT 'All tables and data created successfully!' AS Status;
