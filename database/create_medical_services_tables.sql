-- Tạo bảng danh mục dịch vụ y tế
CREATE TABLE IF NOT EXISTS service_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tạo bảng dịch vụ y tế
CREATE TABLE IF NOT EXISTS medical_services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    description TEXT,
    content LONGTEXT,
    image_url VARCHAR(1000),
    original_price DECIMAL(15,2),
    discounted_price DECIMAL(15,2),
    discount_percentage INT DEFAULT 0,
    button_text VARCHAR(100) DEFAULT 'Đặt lịch ngay',
    button_url VARCHAR(500),
    color VARCHAR(50) DEFAULT '#1890ff',
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm dữ liệu mẫu cho danh mục
INSERT INTO service_categories (name, slug, description, icon, display_order, is_active) VALUES
('Khám sức khỏe', 'kham-suc-khoe', 'Các gói khám sức khỏe tổng quát và chuyên khoa', '🏥', 1, TRUE),
('Xét nghiệm', 'xet-nghiem', 'Xét nghiệm máu, nước tiểu, sinh hóa và các xét nghiệm chuyên sâu', '🔬', 2, TRUE),
('Chẩn đoán hình ảnh', 'chan-doan-hinh-anh', 'X-quang, siêu âm, CT, MRI và các dịch vụ chẩn đoán hình ảnh', '📷', 3, TRUE),
('Phẫu thuật', 'phau-thuat', 'Các dịch vụ phẫu thuật chuyên khoa', '⚕️', 4, TRUE),
('Điều trị chuyên sâu', 'dieu-tri-chuyen-sau', 'Điều trị các bệnh lý chuyên sâu và phục hồi chức năng', '💊', 5, TRUE),
('Tiêm chủng', 'tiem-chung', 'Các dịch vụ tiêm chủng và phòng ngừa bệnh', '💉', 6, TRUE);

-- Thêm dữ liệu mẫu cho dịch vụ y tế
INSERT INTO medical_services (category_id, title, slug, description, content, image_url, original_price, discounted_price, discount_percentage, button_text, color, display_order, is_featured, is_active) VALUES
-- Khám sức khỏe
(1, 'Gói khám sức khỏe tổng quát cơ bản', 'goi-kham-suc-khoe-tong-quat-co-ban', 'Gói khám sức khỏe tổng quát cơ bản bao gồm các xét nghiệm và khám lâm sàng cơ bản', '<p>Gói khám bao gồm: Khám lâm sàng, xét nghiệm máu, nước tiểu, X-quang phổi, siêu âm bụng tổng quát</p>', NULL, 1500000, 1125000, 25, 'Đặt lịch khám', '#1890ff', 1, TRUE, TRUE),
(1, 'Gói khám sức khỏe tổng quát nâng cao', 'goi-kham-suc-khoe-tong-quat-nang-cao', 'Gói khám sức khỏe tổng quát nâng cao với nhiều xét nghiệm chuyên sâu', '<p>Gói khám bao gồm: Khám lâm sàng, xét nghiệm máu mở rộng, điện tim, X-quang, siêu âm, nội soi</p>', NULL, 3000000, 3000000, 0, 'Đặt lịch khám', '#52c41a', 2, TRUE, TRUE),
(1, 'Gói khám sức khỏe doanh nghiệp', 'goi-kham-suc-khoe-doanh-nghiep', 'Gói khám sức khỏe định kỳ cho doanh nghiệp', '<p>Gói khám phù hợp cho khám sức khỏe định kỳ nhân viên</p>', NULL, 1200000, 1200000, 0, 'Liên hệ tư vấn', '#722ed1', 3, FALSE, TRUE),

-- Xét nghiệm
(2, 'Xét nghiệm máu tổng quát', 'xet-nghiem-mau-tong-quat', 'Xét nghiệm công thức máu, đường huyết, mỡ máu', '<p>Bao gồm: Công thức máu, đường huyết, cholesterol, triglycerid</p>', NULL, 500000, 375000, 25, 'Đặt lịch xét nghiệm', '#1890ff', 1, TRUE, TRUE),
(2, 'Xét nghiệm sinh hóa máu', 'xet-nghiem-sinh-hoa-mau', 'Xét nghiệm chức năng gan, thận, điện giải', '<p>Bao gồm: GOT, GPT, Urea, Creatinin, điện giải đồ</p>', NULL, 800000, 800000, 0, 'Đặt lịch xét nghiệm', '#52c41a', 2, FALSE, TRUE),
(2, 'Xét nghiệm ung thư', 'xet-nghiem-ung-thu', 'Xét nghiệm các chỉ số ung thư phổ biến', '<p>Bao gồm: AFP, CEA, CA 19-9, PSA</p>', NULL, 1500000, 1500000, 0, 'Đặt lịch xét nghiệm', '#f5222d', 3, TRUE, TRUE),

-- Chẩn đoán hình ảnh
(3, 'Chụp X-quang phổi', 'chup-x-quang-phoi', 'Chụp X-quang phổi thẳng và nghiêng', '<p>Chụp X-quang phổi để phát hiện các bệnh lý về phổi</p>', NULL, 200000, 150000, 25, 'Đặt lịch chụp', '#1890ff', 1, FALSE, TRUE),
(3, 'Siêu âm bụng tổng quát', 'sieu-am-bung-tong-quat', 'Siêu âm gan, mật, tụy, lách, thận', '<p>Siêu âm các cơ quan trong ổ bụng</p>', NULL, 400000, 400000, 0, 'Đặt lịch siêu âm', '#52c41a', 2, TRUE, TRUE),
(3, 'Chụp CT Scanner', 'chup-ct-scanner', 'Chụp CT Scanner các vùng cơ thể', '<p>Chụp CT Scanner với độ phân giải cao</p>', NULL, 2000000, 2000000, 0, 'Đặt lịch chụp', '#722ed1', 3, FALSE, TRUE),

-- Phẫu thuật
(4, 'Phẫu thuật nội soi', 'phau-thuat-noi-soi', 'Phẫu thuật nội soi ít xâm lấn', '<p>Phẫu thuật nội soi với công nghệ hiện đại</p>', NULL, 15000000, 11250000, 25, 'Liên hệ tư vấn', '#1890ff', 1, TRUE, TRUE),
(4, 'Phẫu thuật thẩm mỹ', 'phau-thuat-tham-my', 'Các dịch vụ phẫu thuật thẩm mỹ', '<p>Phẫu thuật thẩm mỹ an toàn, hiệu quả</p>', NULL, 20000000, 20000000, 0, 'Liên hệ tư vấn', '#f5222d', 2, FALSE, TRUE),

-- Điều trị chuyên sâu
(5, 'Điều trị vật lý trị liệu', 'dieu-tri-vat-ly-tri-lieu', 'Vật lý trị liệu và phục hồi chức năng', '<p>Điều trị phục hồi chức năng sau chấn thương, tai biến</p>', NULL, 500000, 500000, 0, 'Đặt lịch điều trị', '#52c41a', 1, FALSE, TRUE),
(5, 'Điều trị tim mạch', 'dieu-tri-tim-mach', 'Điều trị các bệnh lý tim mạch', '<p>Điều trị và theo dõi các bệnh lý tim mạch</p>', NULL, 1000000, 750000, 25, 'Đặt lịch khám', '#1890ff', 2, TRUE, TRUE),

-- Tiêm chủng
(6, 'Tiêm phòng cúm', 'tiem-phong-cum', 'Vắc xin phòng cúm mùa', '<p>Tiêm phòng cúm mùa cho người lớn và trẻ em</p>', NULL, 300000, 300000, 0, 'Đặt lịch tiêm', '#52c41a', 1, FALSE, TRUE),
(6, 'Tiêm phòng viêm gan B', 'tiem-phong-viem-gan-b', 'Vắc xin phòng viêm gan B', '<p>Tiêm phòng viêm gan B (3 mũi)</p>', NULL, 500000, 375000, 25, 'Đặt lịch tiêm', '#1890ff', 2, TRUE, TRUE);

-- Tạo index để tăng tốc truy vấn
CREATE INDEX idx_service_categories_slug ON service_categories(slug);
CREATE INDEX idx_service_categories_active ON service_categories(is_active);
CREATE INDEX idx_medical_services_slug ON medical_services(slug);
CREATE INDEX idx_medical_services_category ON medical_services(category_id);
CREATE INDEX idx_medical_services_active ON medical_services(is_active);
CREATE INDEX idx_medical_services_featured ON medical_services(is_featured);
