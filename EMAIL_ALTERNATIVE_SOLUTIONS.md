# Giải pháp thay thế Gmail cho gửi Email

## Giải pháp 1: Mailtrap (Miễn phí - Cho Development)

### Ưu điểm:
- ✅ Hoàn toàn miễn phí
- ✅ Không cần App Password
- ✅ Xem email trong web interface đẹp
- ✅ Test email mà không spam người dùng thật
- ✅ Hỗ trợ HTML preview

### Cách setup:

1. **Đăng ký tài khoản:**
   - Vào https://mailtrap.io/
   - Đăng ký miễn phí (có thể dùng Google/GitHub)

2. **Lấy SMTP credentials:**
   - Vào **Email Testing** > **Inboxes**
   - Click vào inbox (hoặc tạo mới)
   - Chọn tab **SMTP Settings**
   - Chọn **Spring Boot** trong dropdown
   - Copy thông tin

3. **Cấu hình application.yml:**
```yaml
spring:
  mail:
    host: sandbox.smtp.mailtrap.io
    port: 2525
    username: your-mailtrap-username
    password: your-mailtrap-password
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
    default-encoding: UTF-8
```

4. **Test:**
   - Gửi email từ app
   - Vào Mailtrap inbox để xem email
   - Email sẽ không gửi đến người dùng thật

### Giới hạn:
- 500 emails/tháng (free tier)
- Chỉ dùng cho testing, không gửi email thật

---

## Giải pháp 2: Brevo (Sendinblue) - Miễn phí 300 emails/ngày

### Ưu điểm:
- ✅ Gửi email thật
- ✅ 300 emails/ngày miễn phí
- ✅ Không cần credit card
- ✅ Dashboard theo dõi email

### Cách setup:

1. **Đăng ký:**
   - Vào https://www.brevo.com/
   - Đăng ký tài khoản miễn phí

2. **Lấy SMTP credentials:**
   - Vào **Settings** > **SMTP & API**
   - Click **Generate a new SMTP key**
   - Copy thông tin

3. **Cấu hình application.yml:**
```yaml
spring:
  mail:
    host: smtp-relay.brevo.com
    port: 587
    username: your-brevo-email@example.com
    password: your-smtp-key
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
    default-encoding: UTF-8
```

### Giới hạn:
- 300 emails/ngày (free tier)
- Cần verify domain để tăng reputation

---

## Giải pháp 3: Mailgun - Miễn phí 5,000 emails/tháng

### Ưu điểm:
- ✅ Gửi email thật
- ✅ 5,000 emails/tháng miễn phí (3 tháng đầu)
- ✅ API mạnh mẽ
- ✅ Tracking và analytics

### Cách setup:

1. **Đăng ký:**
   - Vào https://www.mailgun.com/
   - Đăng ký (cần credit card nhưng không charge)

2. **Lấy SMTP credentials:**
   - Vào **Sending** > **Domain settings**
   - Chọn **SMTP credentials**
   - Tạo SMTP user mới

3. **Cấu hình application.yml:**
```yaml
spring:
  mail:
    host: smtp.mailgun.org
    port: 587
    username: postmaster@your-domain.mailgun.org
    password: your-smtp-password
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
    default-encoding: UTF-8
```

### Giới hạn:
- 5,000 emails/tháng (3 tháng đầu)
- Sau đó: 1,000 emails/tháng free

---

## Giải pháp 4: Resend - Miễn phí 3,000 emails/tháng

### Ưu điểm:
- ✅ Modern, dễ dùng
- ✅ 3,000 emails/tháng miễn phí
- ✅ Không cần credit card
- ✅ React Email templates

### Cách setup:

1. **Đăng ký:**
   - Vào https://resend.com/
   - Đăng ký miễn phí

2. **Lấy API key:**
   - Vào **API Keys**
   - Tạo API key mới

3. **Sử dụng API thay vì SMTP:**
   - Resend khuyến khích dùng API
   - Cần thêm dependency và code riêng

---

## Giải pháp 5: Ethereal Email - Miễn phí hoàn toàn

### Ưu điểm:
- ✅ Hoàn toàn miễn phí
- ✅ Không cần đăng ký
- ✅ Tạo tài khoản tạm thời ngay lập tức
- ✅ Xem email trong web

### Cách setup:

1. **Tạo tài khoản tạm:**
   - Vào https://ethereal.email/
   - Click **Create Ethereal Account**
   - Lưu lại username và password

2. **Cấu hình application.yml:**
```yaml
spring:
  mail:
    host: smtp.ethereal.email
    port: 587
    username: your-ethereal-username
    password: your-ethereal-password
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
    default-encoding: UTF-8
```

3. **Xem email:**
   - Vào https://ethereal.email/messages
   - Đăng nhập với username/password
   - Xem tất cả email đã gửi

### Giới hạn:
- Tài khoản tạm thời (expire sau vài ngày)
- Chỉ dùng cho testing

---

## So sánh các giải pháp

| Dịch vụ | Miễn phí | Email thật | Giới hạn | Khuyến nghị |
|---------|----------|------------|----------|-------------|
| **Mailtrap** | ✅ | ❌ | 500/tháng | Development |
| **Brevo** | ✅ | ✅ | 300/ngày | Production nhỏ |
| **Mailgun** | ✅ | ✅ | 5,000/tháng | Production |
| **Resend** | ✅ | ✅ | 3,000/tháng | Modern apps |
| **Ethereal** | ✅ | ❌ | Unlimited | Quick testing |

---

## Khuyến nghị cho dự án của bạn

### Cho Development/Testing:
**Sử dụng Mailtrap hoặc Ethereal**
- Không spam email thật
- Xem được email đã gửi
- Hoàn toàn miễn phí

### Cho Production:
**Sử dụng Brevo (Sendinblue)**
- 300 emails/ngày đủ cho app nhỏ
- Gửi email thật
- Không cần credit card
- Dễ setup

---

## Cấu hình nhanh với Mailtrap

1. Đăng ký: https://mailtrap.io/
2. Vào inbox, copy SMTP settings
3. Cập nhật `application.yml`:

```yaml
spring:
  mail:
    host: sandbox.smtp.mailtrap.io
    port: 2525
    username: <your-username>
    password: <your-password>
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
    default-encoding: UTF-8
```

4. Restart backend
5. Test gửi email
6. Vào Mailtrap inbox để xem email

---

## Nếu vẫn muốn dùng Gmail

### Cách khắc phục "Không tạo được App Password":

1. **Kiểm tra 2FA:**
   - Vào https://myaccount.google.com/security
   - Đảm bảo **2-Step Verification** đã BẬT
   - Nếu chưa, bật lên

2. **Đợi vài phút:**
   - Sau khi bật 2FA, đợi 5-10 phút
   - Refresh trang

3. **Thử lại:**
   - Vào **Security** > **2-Step Verification**
   - Scroll xuống **App passwords**
   - Nếu vẫn không thấy, thử browser khác

4. **Tài khoản mới:**
   - Tài khoản Gmail mới có thể bị giới hạn
   - Thử với tài khoản Gmail cũ hơn

5. **Google Workspace:**
   - Nếu dùng Google Workspace, admin có thể đã tắt tính năng này
   - Liên hệ admin để bật

---

## Kết luận

**Khuyến nghị:**
1. **Development**: Dùng **Mailtrap** (miễn phí, dễ dùng)
2. **Production**: Dùng **Brevo** (300 emails/ngày miễn phí)
3. **Quick test**: Dùng **Ethereal** (không cần đăng ký)

Tất cả đều không cần App Password và dễ setup hơn Gmail!
