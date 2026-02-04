-- Simple About Page Content (JSON-based)
CREATE TABLE IF NOT EXISTS about_page_content (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    section_key VARCHAR(100) UNIQUE NOT NULL,
    content_json TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default content as JSON
INSERT INTO about_page_content (section_key, content_json, is_active) VALUES
('hero', '{"title":"Về chúng tôi","subtitle":"Hệ thống Y tế chất lượng cao - Chăm sóc sức khỏe toàn diện","backgroundImage":""}', TRUE),

('mission', '{"label":"SỨ MỆNH CỦA CHÚNG TÔI","title":"Mang đến dịch vụ y tế chất lượng cao","description":"MEDLATEC được thành lập với sứ mệnh cung cấp dịch vụ chăm sóc sức khỏe toàn diện, chất lượng cao với chi phí hợp lý cho mọi người dân Việt Nam. Chúng tôi tin rằng mỗi người đều xứng đáng được tiếp cận với các dịch vụ y tế hiện đại, an toàn và hiệu quả.","imageUrl":"https://images.unsplash.com/photo-5519494026892-80bbd2d6fd0d?w=800","features":["Đội ngũ bác sĩ chuyên môn cao","Trang thiết bị hiện đại","Quy trình khám chữa bệnh chuẩn quốc tế"]}', TRUE),

('values', '[{"title":"Tận tâm","description":"Chúng tôi đặt sức khỏe và hạnh phúc của bệnh nhân lên hàng đầu trong mọi quyết định","icon":"HeartOutlined","color":"#ff4d4f"},{"title":"An toàn","description":"Cam kết cung cấp dịch vụ y tế an toàn với các tiêu chuẩn quốc tế","icon":"SafetyOutlined","color":"#52c41a"},{"title":"Chuyên nghiệp","description":"Đội ngũ bác sĩ giàu kinh nghiệm, được đào tạo bài bản","icon":"TeamOutlined","color":"#1890ff"},{"title":"Chất lượng","description":"Không ngừng nâng cao chất lượng dịch vụ và cơ sở vật chất","icon":"TrophyOutlined","color":"#faad14"}]', TRUE),

('achievements', '[{"value":500000,"suffix":"+","title":"Bệnh nhân","icon":"TeamOutlined"},{"value":200,"suffix":"+","title":"Bác sĩ","icon":"MedicineBoxOutlined"},{"value":50,"suffix":"+","title":"Chuyên khoa","icon":"GlobalOutlined"},{"value":15,"suffix":"","title":"Năm kinh nghiệm","icon":"TrophyOutlined"}]', TRUE),

('timeline', '[{"year":"2010","title":"Thành lập","description":"MEDLATEC được thành lập với sứ mệnh mang đến dịch vụ y tế chất lượng cao"},{"year":"2015","title":"Mở rộng","description":"Khai trương 10 chi nhánh trên toàn quốc với đầy đủ trang thiết bị hiện đại"},{"year":"2020","title":"Chuyển đổi số","description":"Ra mắt nền tảng đặt lịch khám trực tuyến và tư vấn sức khỏe từ xa"},{"year":"2024","title":"Đạt chuẩn quốc tế","description":"Đạt chứng nhận ISO 9001:2015 và JCI về chất lượng dịch vụ y tế"}]', TRUE),

('team', '[{"name":"PGS.TS Nguyễn Văn A","position":"Giám đốc Y khoa","specialty":"Tim mạch","avatarUrl":""},{"name":"TS.BS Trần Thị B","position":"Phó Giám đốc","specialty":"Nội khoa","avatarUrl":""},{"name":"ThS.BS Lê Văn C","position":"Trưởng khoa Ngoại","specialty":"Ngoại khoa","avatarUrl":""},{"name":"BS.CKI Phạm Thị D","position":"Trưởng khoa Sản","specialty":"Sản phụ khoa","avatarUrl":""}]', TRUE);
