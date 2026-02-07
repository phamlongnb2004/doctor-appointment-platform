# Quick Fix: Newsletter 404 Error

## 🚀 3 Bước Fix Nhanh

### Bước 1: Test (30 giây)
1. Mở file: `test-newsletter-simple.html`
2. Click nút "Test Subscribe"
3. Xem kết quả

### Bước 2: Fix Database (2 phút)
1. Vào Railway → Database → Query
2. Copy paste và chạy:
```sql
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    phone VARCHAR(20),
    verification_code VARCHAR(6) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    expires_at TIMESTAMP NOT NULL,
    INDEX idx_email (email),
    INDEX idx_verification_code (verification_code),
    INDEX idx_is_verified (is_verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Bước 3: Redeploy Backend (3 phút)
1. Vào Render Dashboard
2. Chọn backend service
3. Click "Manual Deploy"
4. Click "Deploy latest commit"
5. Đợi deploy xong

### Bước 4: Test Lại
Mở lại `test-newsletter-simple.html` và test

## ✅ Kết quả mong đợi
```json
{
  "message": "Mã xác nhận đã được gửi đến email của bạn!",
  "email": "test@test.com"
}
```

## 📁 Files quan trọng

**Test nhanh:**
- `test-newsletter-simple.html` ⭐

**Fix database:**
- `debug_newsletter_404.sql` ⭐
- `verify_newsletter_table.sql`

**Hướng dẫn chi tiết:**
- `NEWSLETTER_404_FIX_SUMMARY.md`
- `NEWSLETTER_404_COMPLETE_DEBUG.md`
- `NEWSLETTER_DEBUG_FLOWCHART.md`

## 🔍 Nếu vẫn lỗi

### Lỗi 404
→ Backend chưa deploy
→ Làm Bước 3 (Redeploy)

### Lỗi 500
→ Bảng chưa có
→ Làm Bước 2 (Fix Database)

### Lỗi CORS
→ Đã fix trong code
→ Clear browser cache và thử lại

## 💡 Lưu ý
- Email có thể không gửi được (không sao)
- Mã xác nhận sẽ in ra Render logs
- Endpoint public, không cần login
- Mã có hiệu lực 15 phút

## 🎯 Tóm tắt
1. Test → Xem lỗi gì
2. Fix database → Tạo bảng
3. Redeploy → Deploy code mới
4. Test lại → Xong!

Thời gian: ~5 phút
