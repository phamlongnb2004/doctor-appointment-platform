# Hướng dẫn sửa lỗi UTF-8 - Cách thủ công

## Vấn đề
Dữ liệu tiếng Việt vẫn hiển thị sai dù đã cấu hình UTF-8.

## Nguyên nhân
Windows PowerShell và cmd không xử lý UTF-8 đúng cách khi nhập dữ liệu vào MySQL.

## Giải pháp - Sử dụng MySQL Workbench

### Bước 1: Mở MySQL Workbench
1. Mở MySQL Workbench
2. Connect vào database `doctor_appointment_db`

### Bước 2: Cấu hình Connection
1. Click vào connection → Edit Connection
2. Vào tab "Advanced"
3. Thêm vào "Others":
   ```
   characterEncoding=UTF-8
   useUnicode=true
   ```
4. Save và reconnect

### Bước 3: Xóa dữ liệu cũ
Chạy query sau:

```sql
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

TRUNCATE TABLE services;
TRUNCATE TABLE news_articles;
TRUNCATE TABLE homepage_content;
TRUNCATE TABLE testimonials;
```

### Bước 4: Nhập dữ liệu mới
Copy và paste đoạn SQL sau vào MySQL Workbench và chạy:

```sql
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

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

-- Homepage Content
INSERT INTO homepage_content (section_key, title, subtitle, content, image_url, button_text, button_url, extra_data, is_active, display_order, created_at, updated_at) VALUES
('hero', 'SỨC KHỎE ĐỊNH KỲ', 'Khám SỨC KHỎE ĐỊNH KỲ', 'Bảo vệ sức khỏe của đội ngũ - Gia tăng doanh nghiệp', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500', 'Đăng ký ngay: 1900 56 56 56', '/contact', '{"discount": "25%"}', true, 1, NOW(), NOW());

-- Testimonials
INSERT INTO testimonials (customer_name, customer_title, customer_image, testimonial_text, rating, is_active, is_featured, display_order, created_at, updated_at) VALUES
('Chị Nguyễn Thị Lan', 'Bệnh nhân tim mạch', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100', 'Dịch vụ tại MEDLATEC rất chuyên nghiệp. Các bác sĩ tận tâm, chu đáo.', 5, true, true, 1, NOW(), NOW()),
('Anh Trần Văn Minh', 'Khám sức khỏe định kỳ', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', 'Hệ thống đặt lịch online rất tiện lợi. Không phải chờ đợi lâu.', 5, true, true, 2, NOW(), NOW());
```

### Bước 5: Kiểm tra
Chạy query sau để kiểm tra:

```sql
SELECT title, author FROM news_articles LIMIT 1;
SELECT title FROM services LIMIT 1;
```

Nếu tiếng Việt hiển thị đúng trong MySQL Workbench → Thành công!

### Bước 6: Kiểm tra trong Browser
1. Mở `http://localhost:3000`
2. Xem trang chủ
3. Tiếng Việt phải hiển thị đúng

## Lưu ý quan trọng

1. **Luôn sử dụng MySQL Workbench** để nhập dữ liệu tiếng Việt
2. **Không dùng PowerShell/CMD** để nhập dữ liệu có tiếng Việt
3. **Luôn chạy `SET NAMES utf8mb4`** trước khi INSERT
4. **Kiểm tra trong Workbench trước** khi kiểm tra trong browser

## Nếu vẫn lỗi

### Option 1: Sử dụng phpMyAdmin
1. Cài đặt XAMPP hoặc phpMyAdmin
2. Mở phpMyAdmin
3. Chọn database `doctor_appointment_db`
4. Vào tab SQL
5. Paste đoạn SQL ở trên và chạy

### Option 2: Nhập dữ liệu qua Frontend
1. Login với tài khoản admin
2. Vào `/admin/cms`
3. Tạo dữ liệu mới trực tiếp qua giao diện
4. Dữ liệu sẽ được lưu đúng UTF-8

### Option 3: Sử dụng API
Tạo dữ liệu qua API với Postman hoặc curl:

```bash
curl -X POST http://localhost:8080/api/cms/admin/services \
  -H "Content-Type: application/json; charset=UTF-8" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Đặt lịch khám",
    "description": "Quy khách hàng sử dụng tiện ích này",
    "imageUrl": "https://example.com/image.jpg",
    "iconClass": "calendar",
    "color": "#1890ff",
    "buttonText": "Đặt lịch",
    "buttonUrl": "/doctors",
    "isActive": true,
    "displayOrder": 1
  }'
```

## Kết luận

Cách tốt nhất là sử dụng MySQL Workbench để nhập dữ liệu có tiếng Việt. Windows command line không xử lý UTF-8 tốt.

Sau khi nhập dữ liệu đúng trong MySQL Workbench, backend và frontend sẽ hiển thị tiếng Việt chính xác.
