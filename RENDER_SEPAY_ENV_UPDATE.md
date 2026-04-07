# CẬP NHẬT ENVIRONMENT VARIABLES CHO SEPAY TRÊN RENDER

## Vấn đề hiện tại
Frontend đang gửi đến URL production `https://pay.sepay.vn/v1/checkout/init` thay vì sandbox.

## Nguyên nhân
Backend trên Render chưa có environment variable `SEPAY_CHECKOUT_URL` hoặc đang dùng giá trị cũ.

## Giải pháp

### Bước 1: Vào Render Dashboard
1. Truy cập: https://dashboard.render.com
2. Chọn service: `doctor-appointment-backend-mq2p`
3. Vào tab **Environment**

### Bước 2: Thêm/Cập nhật Environment Variables

Thêm hoặc cập nhật các biến sau:

```
SEPAY_MERCHANT_ID=SP-TEST-PT873684
SEPAY_SECRET_KEY=spsk_test_YtN9NC2N9adiW58jM8CUnBNd95pVtZUK
SEPAY_ENV=sandbox
SEPAY_CHECKOUT_URL=https://pay-sandbox.sepay.vn/v1/checkout/init
SEPAY_IPN_URL=https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn
```

### Bước 3: Save Changes
Click **Save Changes** - Backend sẽ tự động redeploy

### Bước 4: Đợi Deploy hoàn tất
Đợi khoảng 2-3 phút để backend rebuild và restart

### Bước 5: Test lại
Thử thanh toán lại trên website

---

## Kiểm tra nhanh

Sau khi deploy xong, kiểm tra logs trên Render xem có log nào về SePay không:

1. Vào tab **Logs**
2. Tìm kiếm: `SePay` hoặc `checkout`
3. Xem có lỗi gì không

---

## Nếu vẫn lỗi

### Option 1: Manual Deploy
1. Vào tab **Manual Deploy**
2. Click **Deploy latest commit**
3. Đợi deploy xong

### Option 2: Kiểm tra code
Xem file `application-prod.yml` có đúng không:

```yaml
sepay:
  merchant-id: ${SEPAY_MERCHANT_ID:YOUR_MERCHANT_ID}
  secret-key: ${SEPAY_SECRET_KEY:YOUR_MERCHANT_SECRET_KEY}
  env: ${SEPAY_ENV:sandbox}
  checkout-url: ${SEPAY_CHECKOUT_URL:https://pay-sandbox.sepay.vn/v1/checkout/init}
  ipn-url: ${SEPAY_IPN_URL:https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn}
```

---

## Lưu ý quan trọng

### Sandbox vs Production URLs

**Sandbox (Test):**
- Checkout URL: `https://pay-sandbox.sepay.vn/v1/checkout/init`
- Merchant ID: `SP-TEST-PT873684`
- Secret Key: `spsk_test_YtN9NC2N9adiW58jM8CUnBNd95pVtZUK`

**Production (Live):**
- Checkout URL: `https://pay.sepay.vn/v1/checkout/init`
- Merchant ID: Lấy từ SePay dashboard (production)
- Secret Key: Lấy từ SePay dashboard (production)

Hiện tại đang dùng **Sandbox** để test!

---

## Debug: Kiểm tra response từ backend

Mở DevTools (F12) → Network tab → Tìm request `/orders/sepay/checkout`

Xem response có field `checkout_url` là gì:
- ✅ Đúng: `https://pay-sandbox.sepay.vn/v1/checkout/init`
- ❌ Sai: `https://pay.sepay.vn/v1/checkout/init`

Nếu sai → Backend chưa được update environment variables
