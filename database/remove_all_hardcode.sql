-- =====================================================
-- LOẠI BỎ TẤT CẢ HARDCODE - HOÀN CHỈNH
-- Chạy file này để tạo tất cả bảng và dữ liệu mẫu
-- =====================================================

-- 1. Bảng Features (Tại sao chọn MEDLATEC)
DROP TABLE IF EXISTS features;
CREATE TABLE features (
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

-- 2. Bảng Specialties (Chuyên khoa)
DROP TABLE IF EXISTS specialties;
CREATE TABLE specialties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(50),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Bảng Statistics (Thống kê)
DROP TABLE IF EXISTS statistics;
CREATE TABLE statistics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    value VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. Bảng Certifications (Chứng nhận)
DROP TABLE IF EXISTS certifications;
CREATE TABLE certifications (
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

-- =====================================================
-- DỮ LIỆU MẪU
-- =====================================================

-- Features (Tại sao chọn MEDLATEC)
INSERT INTO features (title, description, icon, color, is_active, display_order, created_at, updated_at) VALUES
('Đội ngũ chuyên gia', '200+ bác sĩ chuyên khoa hàng đầu với nhiều năm kinh nghiệm', '👨‍⚕️', 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)', true, 1, NOW(), NOW()),
('Cơ sở hiện đại', 'Trang thiết bị y tế tiên tiến, đạt chuẩn quốc tế', '🏥', 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', true, 2, NOW(), NOW()),
('Phục vụ 24/7', 'Sẵn sàng hỗ trợ khách hàng mọi lúc, mọi nơi', '⏰', 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)', true, 3, NOW(), NOW()),
('An toàn tuyệt đối', 'Tuân thủ nghiêm ngặt các quy chuẩn an toàn y tế', '🛡️', 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)', true, 4, NOW(), NOW());

-- Specialties (Chuyên khoa)
INSERT INTO specialties (name, icon, color, description, is_active, is_featured, display_order, created_at, updated_at) VALUES
('Chuyên khoa Nội', '🫁', '#1890ff', 'Khám và điều trị các bệnh lý nội khoa', true, false, 1, NOW(), NOW()),
('Ung bướu', '🎗️', '#52c41a', 'Chẩn đoán và điều trị ung thư', true, false, 2, NOW(), NOW()),
('Chuyên khoa Sản Phụ khoa', '👶', '#fa8c16', 'Chăm sóc sức khỏe phụ nữ và thai sản', true, false, 3, NOW(), NOW()),
('Chẩn đoán hình ảnh', '📷', '#1890ff', 'X-quang, CT, MRI, siêu âm', true, true, 4, NOW(), NOW()),
('Trung tâm xét nghiệm MEDLATEC', '🔬', '#722ed1', 'Xét nghiệm máu, nước tiểu, sinh hóa', true, false, 5, NOW(), NOW()),
('Khoa ngoại', '⚕️', '#eb2f96', 'Phẫu thuật và điều trị ngoại khoa', true, false, 6, NOW(), NOW()),
('Tiêu hóa', '🫄', '#13c2c2', 'Điều trị bệnh lý đường tiêu hóa', true, false, 7, NOW(), NOW()),
('Nội tiết', '🩺', '#a0d911', 'Điều trị rối loạn nội tiết tố', true, false, 8, NOW(), NOW()),
('Tim mạch', '❤️', '#f5222d', 'Khám và điều trị bệnh tim mạch', true, false, 9, NOW(), NOW()),
('Nam khoa', '👨', '#1890ff', 'Chăm sóc sức khỏe nam giới', true, false, 10, NOW(), NOW()),
('Chuyên khoa Cơ xương khớp', '🦴', '#52c41a', 'Điều trị bệnh lý xương khớp', true, false, 11, NOW(), NOW()),
('Truyền nhiễm', '🦠', '#fa8c16', 'Điều trị các bệnh truyền nhiễm', true, false, 12, NOW(), NOW()),
('Thần kinh', '🧠', '#722ed1', 'Điều trị bệnh lý thần kinh', true, false, 13, NOW(), NOW()),
('Nhi khoa', '👶', '#eb2f96', 'Chăm sóc sức khỏe trẻ em', true, false, 14, NOW(), NOW()),
('Mắt', '👁️', '#13c2c2', 'Khám và điều trị bệnh về mắt', true, false, 15, NOW(), NOW()),
('Tai mũi họng', '👂', '#a0d911', 'Điều trị bệnh tai mũi họng', true, false, 16, NOW(), NOW()),
('Da liễu', '🧴', '#f5222d', 'Điều trị bệnh lý da liễu', true, false, 17, NOW(), NOW()),
('Răng hàm mặt', '🦷', '#1890ff', 'Chăm sóc sức khỏe răng miệng', true, false, 18, NOW(), NOW());

-- Statistics (Thống kê)
INSERT INTO statistics (label, value, icon, color, is_active, display_order, created_at, updated_at) VALUES
('Năm kinh nghiệm', '30+', '📅', '#FFD700', true, 1, NOW(), NOW()),
('Bệnh nhân tin tưởng', '500K+', '👥', '#FFD700', true, 2, NOW(), NOW()),
('Bác sĩ chuyên khoa', '200+', '👨‍⚕️', '#FFD700', true, 3, NOW(), NOW()),
('Hài lòng dịch vụ', '98%', '⭐', '#FFD700', true, 4, NOW(), NOW());

-- Certifications (Chứng nhận)
INSERT INTO certifications (name, icon, color, description, is_active, display_order, created_at, updated_at) VALUES
('ISO 15189:2022', '🏆', '#1890ff', 'Chứng nhận chất lượng phòng xét nghiệm', true, 1, NOW(), NOW()),
('CAP ACCREDITED', '✅', '#52c41a', 'Chứng nhận của Hiệp hội Bệnh lý Hoa Kỳ', true, 2, NOW(), NOW()),
('BỘ Y TẾ', '🎖️', '#fa8c16', 'Giấy phép hoạt động của Bộ Y tế', true, 3, NOW(), NOW()),
('TOP 10 VN', '🌟', '#722ed1', 'Top 10 bệnh viện tư nhân uy tín', true, 4, NOW(), NOW()),
('JCI STANDARD', '🏥', '#eb2f96', 'Tiêu chuẩn chất lượng quốc tế', true, 5, NOW(), NOW()),
('NABL CERTIFIED', '🔬', '#13c2c2', 'Chứng nhận phòng xét nghiệm quốc tế', true, 6, NOW(), NOW());

-- =====================================================
-- HOÀN TẤT
-- =====================================================
SELECT 'Đã tạo thành công tất cả bảng và dữ liệu mẫu!' AS message;
