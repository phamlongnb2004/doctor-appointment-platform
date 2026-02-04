-- CMS Initial Data for MEDLATEC Website
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Homepage Content
INSERT INTO homepage_content (section_key, title, subtitle, content, image_url, button_text, button_url, extra_data, is_active, display_order, created_at, updated_at) VALUES
('hero', 'SỨC KHỎE ĐỊNH KỲ', 'Khám SỨC KHỎE ĐỊNH KỲ', 'Bảo vệ sức khỏe của đội ngũ - Gia tăng doanh nghiệp', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500', 'Đăng ký ngay: 1900 56 56 56', '/contact', '{"discount": "25%", "promotion": "ĐỢT KHÁM CÀNG LỚN - ƯU ĐÃI CÀNG KHỦNG"}', true, 1, NOW(), NOW()),
('statistics', 'MEDLATEC TRONG SỐ LIỆU', 'Những con số ấn tượng khẳng định uy tín và chất lượng dịch vụ', '', '', '', '', '{"stats": [{"number": "30+", "label": "Năm kinh nghiệm"}, {"number": "500K+", "label": "Bệnh nhân tin tưởng"}, {"number": "200+", "label": "Bác sĩ chuyên khoa"}, {"number": "98%", "label": "Hài lòng dịch vụ"}]}', true, 2, NOW(), NOW());

-- Services
INSERT INTO services (title, description, image_url, icon_class, color, button_text, button_url, is_active, display_order, created_at, updated_at) VALUES
('Đặt lịch khám, lấy mẫu tại nhà', 'Quy khách hàng sử dụng tiện ích này để đặt lịch lấy mẫu tại nhà hoặc quy lịch khám chữa bệnh tại các cơ sở của MEDLATEC', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400', 'calendar', '#1890ff', 'Đặt lịch', '/doctors', true, 1, NOW(), NOW()),
('Tra cứu kết quả', 'Quy khách hàng sử dụng tiện ích này để tra cứu kết quả sau khi sử dụng dịch vụ y tế tại Hệ thống Y tế MEDLATEC', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400', 'file-text', '#52c41a', 'Tra cứu', '/results', true, 2, NOW(), NOW()),
('Bảng giá dịch vụ', 'Quy khách hàng sử dụng tiện ích này để tra cứu giá dịch vụ y tế tại Hệ thống Y tế MEDLATEC', 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400', 'dollar', '#fa8c16', 'Xem bảng giá', '/pricing', true, 3, NOW(), NOW()),
('Hỏi đáp chuyên gia', 'Quy khách hàng sử dụng tiện ích này để đặt câu hỏi và nhận hướng dẫn giải đáp thực mắc từ chuyên gia y tế của MEDLATEC', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400', 'question-circle', '#722ed1', 'Đặt câu hỏi', '/chat', true, 4, NOW(), NOW());

-- News Articles
INSERT INTO news_articles (title, excerpt, content, image_url, slug, author, status, is_active, is_featured, display_order, published_at, created_at, updated_at) VALUES
('Hy hữu: Xương gà du hành trong dạ dày, rồi mắc kẹt ở...', 'Bệnh viện Đa khoa MEDLATEC vừa can thiệp và điều trị thành công một ca lâm sàng hy hữu. Đó là mảnh xương gà dài 3,5cm...', '<p>Nội dung chi tiết về ca bệnh hy hữu này...</p>', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300', 'xuong-ga-du-hanh', 'BS. Nguyễn Văn A', 'APPROVED', true, true, 1, NOW(), NOW(), NOW()),
('Hút thuốc lá nhiều năm, xuất hiện khó thở, đi khám...', 'Có thói quen hút thuốc lá nhiều năm, khoảng 3 tháng nay, người đàn ông xuất hiện các cơn khó thở nhưng lại không thở...', '<p>Nội dung chi tiết về tác hại của thuốc lá...</p>', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300', 'hut-thuoc-la-kho-tho', 'BS. Trần Thị B', 'APPROVED', true, true, 2, NOW(), NOW(), NOW()),
('Cảnh báo hệ lụy từ món ăn làm tí cho đỡ ngày Tết của...', 'Từ những biểu hiện ban đầu không điển hình, nam bệnh nhân 60 tuổi tại Hà Nội được phát hiện mắc nhiễm khuẩn huyết...', '<p>Nội dung chi tiết về an toàn thực phẩm ngày Tết...</p>', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300', 'canh-bao-he-luy-tet', 'BS. Lê Văn C', 'APPROVED', true, true, 3, NOW(), NOW(), NOW()),
('Nhập viện vì sốt, người đàn ông bất ngờ được chẩn đoán...', 'Sốt là triệu chứng rất thường gặp trong lâm sàng và phần lớn liên quan đến nhiễm trùng. Tuy nhiên, trong một số trường hợp...', '<p>Nội dung chi tiết về chẩn đoán bệnh qua triệu chứng sốt...</p>', 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=300', 'nhap-vien-vi-sot', 'BS. Phạm Thị D', 'APPROVED', true, false, 4, NOW(), NOW(), NOW());

-- Testimonials
INSERT INTO testimonials (customer_name, customer_title, customer_image, testimonial_text, rating, is_active, is_featured, display_order, created_at, updated_at) VALUES
('Chị Nguyễn Thị Lan', 'Bệnh nhân tim mạch', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100', 'Dịch vụ tại MEDLATEC rất chuyên nghiệp. Các bác sĩ tận tâm, chu đáo. Tôi đã khám và điều trị ở đây được 3 năm, rất hài lòng với chất lượng dịch vụ.', 5, true, true, 1, NOW(), NOW()),
('Anh Trần Văn Minh', 'Khám sức khỏe định kỳ', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', 'Hệ thống đặt lịch online rất tiện lợi. Không phải chờ đợi lâu, quy trình khám nhanh gọn. Tôi sẽ giới thiệu cho bạn bè và đồng nghiệp.', 5, true, true, 2, NOW(), NOW()),
('Cô Phạm Thị Hoa', 'Khám phụ khoa', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', 'Cơ sở vật chất hiện đại, sạch sẽ. Đội ngũ y tế chuyên nghiệp, thái độ phục vụ tốt. Tôi cảm thấy an tâm khi khám chữa bệnh tại đây.', 5, true, true, 3, NOW(), NOW());
