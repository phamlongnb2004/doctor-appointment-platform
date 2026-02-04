# Hướng dẫn cấu hình Email thật với Gmail

## Bước 1: Tạo App Password cho Gmail

### 1.1. Bật xác thực 2 bước (2FA)
1. Đăng nhập vào tài khoản Google: https://myaccount.google.com/
2. Vào **Security** (Bảo mật)
3. Tìm **2-Step Verification** (Xác minh 2 bước)
4. Bật tính năng này nếu chưa bật

### 1.2. Tạo App Password
1. Vào **Security** > **2-Step Verification**
2. Kéo xuống dưới, tìm **App passwords** (Mật khẩu ứng dụng)
3. Click vào **App passwords**
4. Chọn:
   - **Select app**: Mail
   - **Select device**: Other (Custom name)
   - Nhập tên: "MEDLATEC Newsletter"
5. Click **Generate**
6. **Lưu lại mật khẩu 16 ký tự** (dạng: xxxx xxxx xxxx xxxx)

## Bước 2: Cấu hình trong application.yml

### Cách 1: Cấu hình trực tiếp (Không khuyến khích)

Mở file `backend/src/main/resources/application.yml` và thay đổi:

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com  # Thay bằng email của bạn
    password: xxxx xxxx xxxx xxxx    # Thay bằng App Password 16 ký tự
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
            required: true
          connectiontimeout: 5000
          timeout: 5000
          writetimeout: 5000
    default-encoding: UTF-8
```

### Cách 2: Sử dụng Environment Variables (Khuyến khích)

File `application.yml` đã được cấu hình sẵn để đọc từ environment variables:

```yaml
spring:
  mail:
    username: ${MAIL_USERNAME:your-email@gmail.com}
    password: ${MAIL_PASSWORD:your-app-password}
```

#### Windows (PowerShell):
```powershell
$env:MAIL_USERNAME="your-email@gmail.com"
$env:MAIL_PASSWORD="xxxx xxxx xxxx xxxx"
```

#### Windows (CMD):
```cmd
set MAIL_USERNAME=your-email@gmail.com
set MAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

#### Linux/Mac:
```bash
export MAIL_USERNAME="your-email@gmail.com"
export MAIL_PASSWORD="xxxx xxxx xxxx xxxx"
```

## Bước 3: Restart Backend

Sau khi cấu hình, restart backend:

```bash
cd backend
mvn spring-boot:run
```

Hoặc nếu đang chạy, stop và start lại process.

## Bước 4: Test

1. Vào trang chủ: http://localhost:3000
2. Scroll xuống phần "Đăng ký thành viên"
3. Nhập email thật của bạn
4. Click "Đăng ký nhận tin"
5. Kiểm tra email (cả inbox và spam folder)
6. Nhập mã OTP vào modal
7. Kiểm tra email chào mừng

## Kiểm tra Log

Khi gửi email thành công, backend sẽ log:
```
✅ Verification email sent successfully to: user@example.com
✅ Welcome email sent successfully to: user@example.com
```

Nếu có lỗi:
```
❌ Failed to send verification email to: user@example.com
```

## Troubleshooting

### Lỗi: Authentication failed
- Kiểm tra lại email và App Password
- Đảm bảo đã bật 2FA
- Đảm bảo sử dụng App Password, không phải mật khẩu thường

### Lỗi: Connection timeout
- Kiểm tra firewall/antivirus
- Kiểm tra kết nối internet
- Thử port 465 với SSL thay vì 587 với TLS:
  ```yaml
  spring:
    mail:
      port: 465
      properties:
        mail:
          smtp:
            ssl:
              enable: true
  ```

### Email vào Spam
- Thêm địa chỉ gửi vào danh sách an toàn
- Trong production, nên sử dụng domain email riêng
- Cấu hình SPF, DKIM, DMARC records

### Không nhận được email
- Kiểm tra spam folder
- Kiểm tra log backend xem có gửi thành công không
- Thử gửi đến email khác
- Kiểm tra quota Gmail (500 emails/day cho free account)

## Giới hạn Gmail

- **Free Gmail**: 500 emails/ngày
- **Google Workspace**: 2000 emails/ngày

Nếu cần gửi nhiều hơn, nên sử dụng:
- SendGrid (100 emails/day free)
- AWS SES (62,000 emails/month free)
- Mailgun (5,000 emails/month free)

## Chuyển sang dịch vụ Email khác

### SendGrid
```yaml
spring:
  mail:
    host: smtp.sendgrid.net
    port: 587
    username: apikey
    password: YOUR_SENDGRID_API_KEY
```

### AWS SES
```yaml
spring:
  mail:
    host: email-smtp.us-east-1.amazonaws.com
    port: 587
    username: YOUR_SMTP_USERNAME
    password: YOUR_SMTP_PASSWORD
```

## Bảo mật

⚠️ **QUAN TRỌNG:**
- **KHÔNG** commit file `application.yml` có chứa email/password thật lên Git
- Sử dụng environment variables
- Hoặc tạo file `application-local.yml` và thêm vào `.gitignore`
- Trong production, sử dụng secret management (AWS Secrets Manager, Azure Key Vault, etc.)

## Template Email

Email đã được thiết kế với:
- ✅ Responsive design
- ✅ HTML đẹp mắt với gradient
- ✅ Mã OTP nổi bật
- ✅ Thông tin đầy đủ
- ✅ Footer chuyên nghiệp

Bạn có thể tùy chỉnh template trong `EmailService.java`:
- `buildVerificationEmailContent()` - Email xác thực
- `buildWelcomeEmailContent()` - Email chào mừng

## Fallback Mode

Nếu không cấu hình email, hệ thống sẽ tự động fallback về console mode:
- Email sẽ được log ra console
- Vẫn có thể test được flow
- Phù hợp cho development

## Production Checklist

- [ ] Sử dụng domain email riêng (noreply@yourdomain.com)
- [ ] Cấu hình SPF, DKIM, DMARC
- [ ] Sử dụng dịch vụ email chuyên nghiệp (SendGrid, AWS SES)
- [ ] Lưu credentials trong secret manager
- [ ] Thiết lập monitoring và alerting
- [ ] Cấu hình retry logic
- [ ] Thêm rate limiting
- [ ] Thiết lập email queue
