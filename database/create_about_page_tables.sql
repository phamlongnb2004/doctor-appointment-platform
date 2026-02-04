-- About Page Hero Section
CREATE TABLE IF NOT EXISTS about_hero (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    background_image VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- About Page Mission Section
CREATE TABLE IF NOT EXISTS about_mission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    label VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    feature_1 VARCHAR(255),
    feature_2 VARCHAR(255),
    feature_3 VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- About Page Core Values
CREATE TABLE IF NOT EXISTS about_values (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100),
    color VARCHAR(50) DEFAULT '#1890ff',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- About Page Achievements/Statistics
CREATE TABLE IF NOT EXISTS about_achievements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    value INT NOT NULL,
    suffix VARCHAR(10),
    icon VARCHAR(100),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- About Page Timeline/Milestones
CREATE TABLE IF NOT EXISTS about_timeline (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    year VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- About Page Team Members
CREATE TABLE IF NOT EXISTS about_team (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    specialty VARCHAR(255),
    avatar_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default data
INSERT INTO about_hero (title, subtitle, is_active) VALUES
('Về chúng tôi', 'Hệ thống Y tế chất lượng cao - Chăm sóc sức khỏe toàn diện', TRUE);

INSERT INTO about_mission (label, title, description, feature_1, feature_2, feature_3, is_active) VALUES
('SỨ MỆNH CỦA CHÚNG TÔI', 
'Mang đến dịch vụ y tế chất lượng cao', 
'MEDLATEC được thành lập với sứ mệnh cung cấp dịch vụ chăm sóc sức khỏe toàn diện, chất lượng cao với chi phí hợp lý cho mọi người dân Việt Nam. Chúng tôi tin rằng mỗi người đều xứng đáng được tiếp cận với các dịch vụ y tế hiện đại, an toàn và hiệu quả.',
'Đội ngũ bác sĩ chuyên môn cao',
'Trang thiết bị hiện đại',
'Quy trình khám chữa bệnh chuẩn quốc tế',
TRUE);

INSERT INTO about_values (title, description, icon, color, display_order, is_active) VALUES
('Tận tâm', 'Chúng tôi đặt sức khỏe và hạnh phúc của bệnh nhân lên hàng đầu trong mọi quyết định', 'HeartOutlined', '#ff4d4f', 1, TRUE),
('An toàn', 'Cam kết cung cấp dịch vụ y tế an toàn với các tiêu chuẩn quốc tế', 'SafetyOutlined', '#52c41a', 2, TRUE),
('Chuyên nghiệp', 'Đội ngũ bác sĩ giàu kinh nghiệm, được đào tạo bài bản', 'TeamOutlined', '#1890ff', 3, TRUE),
('Chất lượng', 'Không ngừng nâng cao chất lượng dịch vụ và cơ sở vật chất', 'TrophyOutlined', '#faad14', 4, TRUE);

INSERT INTO about_achievements (title, value, suffix, icon, display_order, is_active) VALUES
('Bệnh nhân', 500000, '+', 'TeamOutlined', 1, TRUE),
('Bác sĩ', 200, '+', 'MedicineBoxOutlined', 2, TRUE),
('Chuyên khoa', 50, '+', 'GlobalOutlined', 3, TRUE),
('Năm kinh nghiệm', 15, '', 'TrophyOutlined', 4, TRUE);

INSERT INTO about_timeline (year, title, description, display_order, is_active) VALUES
('2010', 'Thành lập', 'MEDLATEC được thành lập với sứ mệnh mang đến dịch vụ y tế chất lượng cao', 1, TRUE),
('2015', 'Mở rộng', 'Khai trương 10 chi nhánh trên toàn quốc với đầy đủ trang thiết bị hiện đại', 2, TRUE),
('2020', 'Chuyển đổi số', 'Ra mắt nền tảng đặt lịch khám trực tuyến và tư vấn sức khỏe từ xa', 3, TRUE),
('2024', 'Đạt chuẩn quốc tế', 'Đạt chứng nhận ISO 9001:2015 và JCI về chất lượng dịch vụ y tế', 4, TRUE);

INSERT INTO about_team (name, position, specialty, display_order, is_active) VALUES
('PGS.TS Nguyễn Văn A', 'Giám đốc Y khoa', 'Tim mạch', 1, TRUE),
('TS.BS Trần Thị B', 'Phó Giám đốc', 'Nội khoa', 2, TRUE),
('ThS.BS Lê Văn C', 'Trưởng khoa Ngoại', 'Ngoại khoa', 3, TRUE),
('BS.CKI Phạm Thị D', 'Trưởng khoa Sản', 'Sản phụ khoa', 4, TRUE);
