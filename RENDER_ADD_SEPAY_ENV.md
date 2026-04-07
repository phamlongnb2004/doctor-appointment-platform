# Thêm biến môi trường SePay trên Render

## Lỗi hiện tại
```
POST /api/orders/sepay/checkout 500 (Internal Server Error)
```

Nguyên nhân: Thiếu biến môi trường SePay trên Render.

## Các bước thực hiện

### 1. Truy cập Render Dashboard
- Đi tới: https://dashboard.render.com
- Chọn service: `doctor-appointment-backend-mq2p`

### 2. Thêm Environment Variables

Vào tab **Environment** và thêm các biến sau:

```bash
# SePay Payment Gateway Configuration
SEPAY_MERCHANT_ID=YOUR_MERCHANT_ID_HERE
SEPAY_SECRET_KEY=YOUR_SECRET_KEY_HERE
SEPAY_ENV=sandbox
SEPAY_CHECKOUT_URL=https://sandbox.sepay.vn/v1/checkout/init
SEPAY_IPN_URL=https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn
```

### 3. Lấy thông tin SePay

Nếu bạn chưa có tài khoản SePay:

1. Đăng ký tại: https://sepay.vn
2. Vào Dashboard → Settings → API Keys
3. Copy `Merchant ID` và `Secret Key`

### 4. Cấu hình cho Production

Khi chuyển sang production, thay đổi:

```bash
SEPAY_ENV=production
SEPAY_CHECKOUT_URL=https://api.sepay.vn/v1/checkout/init
```

### 5. Lưu và Deploy lại

- Click **Save Changes**
- Render sẽ tự động deploy lại backend
- Đợi khoảng 2-3 phút

### 6. Kiểm tra

Sau khi deploy xong, thử checkout lại:
- Vào: https://doctor-appointment-frontend-ujug.onrender.com/checkout
- Thêm sản phẩm vào giỏ hàng
- Chọn phương thức thanh toán SePay
- Click "Thanh toán"

## Lưu ý quan trọng

1. **IPN URL phải là HTTPS**: SePay chỉ chấp nhận IPN URL với HTTPS
2. **Merchant ID và Secret Key**: Phải lấy từ SePay Dashboard
3. **Sandbox vs Production**: 
   - Sandbox: Dùng để test, không thanh toán thật
   - Production: Thanh toán thật

## Nếu không có tài khoản SePay

Bạn có thể dùng các giá trị test sau (chỉ cho sandbox):

```bash
SEPAY_MERCHANT_ID=TEST_MERCHANT_123
SEPAY_SECRET_KEY=test_secret_key_456
SEPAY_ENV=sandbox
SEPAY_CHECKOUT_URL=https://sandbox.sepay.vn/v1/checkout/init
SEPAY_IPN_URL=https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn
```

**Lưu ý**: Giá trị test này chỉ để kiểm tra code, không thể thanh toán thật.

## Kiểm tra logs

Sau khi thêm biến môi trường, kiểm tra logs:

1. Vào Render Dashboard
2. Chọn service backend
3. Vào tab **Logs**
4. Tìm dòng log liên quan đến SePay

Nếu thấy lỗi như:
```
Could not resolve placeholder 'sepay.merchant-id'
```

→ Biến môi trường chưa được load đúng, cần deploy lại.

## Tài liệu tham khảo

- SePay API Documentation: https://developer.sepay.vn
- Render Environment Variables: https://render.com/docs/environment-variables
