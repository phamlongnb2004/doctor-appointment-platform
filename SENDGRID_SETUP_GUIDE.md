# SendGrid Setup Guide

## Bước 1: Đăng ký SendGrid

1. Vào https://signup.sendgrid.com/
2. Đăng ký tài khoản miễn phí (Free tier: 100 emails/ngày)
3. Xác nhận email

## Bước 2: Tạo API Key

1. Đăng nhập SendGrid
2. Vào **Settings** → **API Keys**
3. Click **Create API Key**
4. Chọn **Full Access** hoặc **Restricted Access** (chỉ cần Mail Send)
5. Copy API Key (chỉ hiện 1 lần!)

## Bước 3: Verify Sender Identity

### Option A: Single Sender Verification (Dễ nhất - Khuyên dùng)
1. Vào **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Điền thông tin:
   - From Name: `MEDLATEC`
   - From Email Address: `your-email@gmail.com` (email thật của bạn)
   - Reply To: Same as From Email
   - Company Address: Địa chỉ công ty
4. Click **Create**
5. Check email và click link xác nhận

### Option B: Domain Authentication (Chuyên nghiệp hơn)
- Cần có domain riêng (medlatec.com)
- Cần config DNS records
- Phức tạp hơn nhưng professional

## Bước 4: Config Local (Test)

Thêm vào `backend/src/main/resources/application.yml`:

```yaml
sendgrid:
  api-key: SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  from-email: your-verified-email@gmail.com
  from-name: MEDLATEC
```

## Bước 5: Config Production (Render)

1. Vào Render Dashboard
2. Chọn backend service
3. Click **Environment** tab
4. Add environment variables:

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=your-verified-email@gmail.com
SENDGRID_FROM_NAME=MEDLATEC
```

5. Click **Save Changes**
6. Service sẽ tự động redeploy

## Bước 6: Test

### Test Local:
```bash
cd backend
mvn spring-boot:run
```

Gọi API subscribe và check email

### Test Production:
Sau khi deploy, test trên production URL

## Lưu ý quan trọng

### ✅ Ưu điểm SendGrid:
- **Không bị block** trên Render (dùng API, không phải SMTP)
- **Free 100 emails/ngày** (đủ cho testing và small projects)
- **Delivery rate cao** (99%+)
- **Tracking**: Xem email đã gửi, mở, click
- **Professional**: Không bị spam folder

### ⚠️ Giới hạn Free Tier:
- 100 emails/ngày
- Không có dedicated IP
- SendGrid branding trong email

### 🔒 Bảo mật:
- **KHÔNG commit API key** vào git
- Dùng environment variables
- API key có thể revoke và tạo mới

## Troubleshooting

### Lỗi: "The from address does not match a verified Sender Identity"
→ Chưa verify sender email. Làm Bước 3.

### Lỗi: "Unauthorized"
→ API key sai hoặc đã bị revoke. Tạo API key mới.

### Email không nhận được:
1. Check spam folder
2. Check SendGrid Activity Feed (xem email đã gửi chưa)
3. Verify sender email đúng chưa

### Email vào spam:
- Dùng Domain Authentication (Option B)
- Tránh từ ngữ spam ("free", "click here", quá nhiều link)
- Warm up domain (gửi ít email trước, tăng dần)

## SendGrid Dashboard

Sau khi setup, vào SendGrid Dashboard để:
- **Activity Feed**: Xem lịch sử email đã gửi
- **Stats**: Xem số liệu (sent, delivered, opened, clicked)
- **Suppressions**: Xem email bị bounce/spam

## Nâng cấp (Optional)

Nếu cần gửi nhiều hơn 100 emails/ngày:
- **Essentials**: $19.95/tháng - 50,000 emails
- **Pro**: $89.95/tháng - 100,000 emails

## Alternative (Nếu không dùng SendGrid)

- **Mailgun**: 5,000 emails/tháng free
- **Brevo (Sendinblue)**: 300 emails/ngày free
- **Resend**: 3,000 emails/tháng free
- **Amazon SES**: $0.10/1000 emails (cần AWS account)

## Summary

1. ✅ Đăng ký SendGrid
2. ✅ Tạo API Key
3. ✅ Verify Sender Email
4. ✅ Add API Key vào Render Environment Variables
5. ✅ Deploy và test

**Thời gian setup**: ~10 phút
**Cost**: Free (100 emails/ngày)
