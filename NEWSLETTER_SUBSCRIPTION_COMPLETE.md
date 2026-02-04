# Newsletter Subscription với Email Verification - HOÀN THÀNH

## Tổng quan
Đã triển khai hệ thống đăng ký nhận tin với xác thực email qua mã OTP 6 số.

## Luồng hoạt động

### 1. Người dùng đăng ký
- Nhập email vào form "Đăng ký thành viên" ở trang chủ
- Click "Đăng ký nhận tin"
- Hệ thống kiểm tra:
  - Email đã tồn tại chưa?
  - Nếu chưa: Tạo mới subscription
  - Nếu có nhưng chưa verify: Gửi lại mã mới
  - Nếu đã verify: Báo lỗi "Email đã được đăng ký"

### 2. Gửi mã xác thực
- Tạo mã OTP 6 số ngẫu nhiên
- Lưu vào database với thời gian hết hạn 15 phút
- Gửi email chứa mã (hiện tại log ra console)
- Hiển thị modal nhập mã

### 3. Xác thực mã
- Người dùng nhập mã 6 số
- Hệ thống kiểm tra:
  - Mã có đúng không?
  - Mã đã hết hạn chưa?
  - Email đã verify chưa?
- Nếu hợp lệ:
  - Đánh dấu subscription là verified
  - Gửi email chào mừng
  - Hiển thị thông báo thành công

## Database

### Bảng: newsletter_subscriptions
```sql
CREATE TABLE newsletter_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    phone VARCHAR(20),
    verification_code VARCHAR(6) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    expires_at TIMESTAMP NOT NULL
);
```

## Backend Files

### 1. Model
- `NewsletterSubscription.java` - Entity với các trường cần thiết

### 2. Repository
- `NewsletterSubscriptionRepository.java` - JPA repository với custom queries

### 3. Services
- `EmailService.java` - Gửi email (hiện tại log ra console)
- `NewsletterService.java` - Logic đăng ký và xác thực

### 4. Controller
- `NewsletterController.java` - 2 endpoints:
  - POST `/api/newsletter/subscribe` - Đăng ký
  - POST `/api/newsletter/verify` - Xác thực mã

## Frontend

### HomePage.js
- State management cho newsletter
- Form input email
- Modal xác thực mã
- Handlers:
  - `handleNewsletterSubscribe()` - Gửi request đăng ký
  - `handleVerifyCode()` - Xác thực mã

## API Endpoints

### 1. Đăng ký nhận tin
```
POST http://localhost:8080/api/newsletter/subscribe
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "Nguyen Van A",
  "phone": "0123456789"
}

Response:
{
  "message": "Mã xác nhận đã được gửi đến email của bạn!",
  "email": "user@example.com"
}
```

### 2. Xác thực mã
```
POST http://localhost:8080/api/newsletter/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}

Response:
{
  "message": "Đăng ký thành công! Bạn sẽ nhận được các thông báo ưu đãi qua email.",
  "subscription": { ... }
}
```

## Tính năng

✅ Đăng ký với email
✅ Tạo mã OTP 6 số ngẫu nhiên
✅ Mã có thời hạn 15 phút
✅ Gửi email xác thực (log ra console)
✅ Modal nhập mã xác thực
✅ Kiểm tra mã hợp lệ
✅ Kiểm tra mã hết hạn
✅ Gửi email chào mừng sau khi verify
✅ Xử lý trường hợp email đã tồn tại
✅ Gửi lại mã nếu chưa verify

## Cấu hình Email thật (TODO)

Hiện tại email chỉ log ra console. Để gửi email thật, cần:

### 1. Thêm dependencies vào pom.xml
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

### 2. Cấu hình trong application.yml
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-app-password
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
```

### 3. Uncomment code trong EmailService.java
- Phần gửi email thật đã được comment sẵn
- Chỉ cần uncomment và cấu hình SMTP

## Test

1. Mở trang chủ: http://localhost:3000
2. Scroll xuống phần "Đăng ký thành viên"
3. Nhập email
4. Click "Đăng ký nhận tin"
5. Kiểm tra console backend để lấy mã OTP
6. Nhập mã vào modal
7. Click "Xác nhận"
8. Thấy thông báo thành công

## Lưu ý

- Mã OTP có hiệu lực 15 phút
- Email đã verify không thể đăng ký lại
- Email chưa verify có thể gửi lại mã mới
- Mã mới sẽ thay thế mã cũ
- Cần cấu hình SMTP để gửi email thật

## Files đã tạo

### Database
- `database/create_newsletter_subscriptions.sql`

### Backend
- `backend/src/main/java/com/doctorappointment/model/NewsletterSubscription.java`
- `backend/src/main/java/com/doctorappointment/repository/NewsletterSubscriptionRepository.java`
- `backend/src/main/java/com/doctorappointment/service/EmailService.java`
- `backend/src/main/java/com/doctorappointment/service/NewsletterService.java`
- `backend/src/main/java/com/doctorappointment/controller/NewsletterController.java`

### Frontend
- Cập nhật `frontend/src/pages/HomePage.js`

### Documentation
- `NEWSLETTER_SUBSCRIPTION_COMPLETE.md`
