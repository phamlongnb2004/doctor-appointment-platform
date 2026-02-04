# Hướng dẫn cài đặt Features (Tính năng nổi bật)

## Bước 1: Tạo bảng features trong database

Mở MySQL Workbench hoặc command line và chạy SQL sau:

```sql
-- Create features table for "Why Choose Us" section
CREATE TABLE IF NOT EXISTS features (
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

-- Insert sample data
INSERT INTO features (title, description, icon, color, is_active, display_order, created_at, updated_at) VALUES
('Đội ngũ chuyên gia', '200+ bác sĩ chuyên khoa hàng đầu với nhiều năm kinh nghiệm', '👨‍⚕️', 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)', true, 1, NOW(), NOW()),
('Cơ sở hiện đại', 'Trang thiết bị y tế tiên tiến, đạt chuẩn quốc tế', '🏥', 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', true, 2, NOW(), NOW()),
('Phục vụ 24/7', 'Sẵn sàng hỗ trợ khách hàng mọi lúc, mọi nơi', '⏰', 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)', true, 3, NOW(), NOW()),
('An toàn tuyệt đối', 'Tuân thủ nghiêm ngặt các quy chuẩn an toàn y tế', '🛡️', 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)', true, 4, NOW(), NOW());
```

Hoặc chạy file SQL có sẵn:
```bash
mysql -u root -p doctor_appointment_db < database/create_features_table.sql
```

## Bước 2: Restart backend

Backend đã có sẵn model Feature, repository, service và controller. Chỉ cần restart:

```bash
cd backend
mvn spring-boot:run
```

## Bước 3: Kiểm tra

1. Mở trình duyệt và truy cập: http://localhost:3000
2. Đăng nhập với tài khoản admin: admin@doctor.com / password123
3. Vào trang Admin CMS: http://localhost:3000/admin/cms
4. Chọn tab "Tính năng nổi bật" để quản lý features
5. Quay lại trang chủ để xem phần "TẠI SAO CHỌN MEDLATEC?" đã hiển thị động từ database

## Đã hoàn thành

✅ Backend: Model, Repository, Service, Controller đã có sẵn
✅ Frontend API: cmsApi.js đã có methods getFeatures, createFeature, updateFeature, deleteFeature
✅ HomePage: Đã cập nhật để fetch và hiển thị features từ API
✅ AdminCMSPage: Đã thêm tab "Tính năng nổi bật" để quản lý
✅ Database: SQL script đã tạo sẵn trong database/create_features_table.sql

## Các phần hardcode còn lại

Sau khi hoàn thành Features, còn các phần hardcode khác:

1. **Services Section** (3 cards): "Khám sức khỏe cho doanh nghiệp", "Lấy mẫu xét nghiệm", "Khám chữa bệnh"
   - Có thể sử dụng bảng `services` hiện có hoặc tạo section riêng

2. **Specialties** (18 items): Các chuyên khoa y tế
   - Cần tạo bảng `specialties` mới hoặc lưu trong `homepage_content`

3. **Statistics Section**: "30+ năm", "500K+ bệnh nhân", "200+ bác sĩ", "98% hài lòng"
   - Đã có `statisticsContent` state nhưng chưa sử dụng

4. **Certifications**: ISO, CAP, Bộ Y Tế, etc.
   - Có thể tạo bảng `certifications` mới

5. **Testimonials**: Đánh giá khách hàng
   - Đã có trong database và CMS, nhưng HomePage đang dùng hardcode

Bạn muốn tiếp tục loại bỏ phần nào tiếp theo?
