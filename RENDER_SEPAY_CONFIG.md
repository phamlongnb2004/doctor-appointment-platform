# Cấu hình SePay trên Render

## Environment Variables cần thêm trên Render

Truy cập Render Dashboard → Backend Service → Environment → Add Environment Variable

### 1. SePay Configuration (Sandbox - Test)

```
SEPAY_MERCHANT_ID=YOUR_MERCHANT_ID_FROM_SEPAY
SEPAY_SECRET_KEY=YOUR_SECRET_KEY_FROM_SEPAY
SEPAY_ENV=sandbox
SEPAY_CHECKOUT_URL=https://sandbox.sepay.vn/v1/checkout/init
SEPAY_IPN_URL=https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn
```

### 2. Frontend URL

```
FRONTEND_URL=https://doctor-appointment-frontend-ujug.onrender.com
```

## Lấy thông tin từ SePay

1. Đăng ký tài khoản tại: https://my.sepay.vn/register
2. Kích hoạt Cổng thanh toán → Chọn Sandbox
3. Làm theo hướng dẫn tích hợp
4. Copy MERCHANT_ID và SECRET_KEY
5. Paste vào Environment Variables trên Render

## Cấu hình IPN trên SePay Dashboard

1. Truy cập https://my.sepay.vn/pg/payment-methods
2. Vào phần "Cấu hình IPN"
3. Nhập URL:
   ```
   https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn
   ```
4. Lưu cấu hình

## Test trên Production

1. Truy cập: https://doctor-appointment-frontend-ujug.onrender.com/sepay-test
2. Nhập thông tin test
3. Nhấn "Tạo Test Checkout"
4. Kiểm tra response
5. Nhấn "Chuyển đến SePay" để test thanh toán

## Chuyển sang Production (Go Live)

Khi sẵn sàng go live:

1. Trên SePay Dashboard, chọn "Chuyển sang Production"
2. Nhận MERCHANT_ID và SECRET_KEY production
3. Cập nhật Environment Variables trên Render:
   ```
   SEPAY_MERCHANT_ID=<production_merchant_id>
   SEPAY_SECRET_KEY=<production_secret_key>
   SEPAY_ENV=production
   SEPAY_CHECKOUT_URL=https://pay.sepay.vn/v1/checkout/init
   ```
4. Cập nhật IPN URL trên SePay Dashboard (production)
5. Redeploy service trên Render

## Kiểm tra logs

Trên Render Dashboard → Backend Service → Logs

Tìm các log liên quan đến SePay:
- `SePayService` - Tạo checkout
- `OrderController` - IPN callback
- `OrderService` - Cập nhật trạng thái đơn hàng

## Troubleshooting

### IPN không nhận được
- Kiểm tra IPN URL có đúng không
- Kiểm tra logs backend
- Verify signature có đúng không

### Signature verification failed
- Kiểm tra SECRET_KEY
- Kiểm tra encoding (UTF-8)
- Kiểm tra thứ tự sort parameters

### Checkout URL không hoạt động
- Kiểm tra MERCHANT_ID
- Kiểm tra API endpoint URL
- Kiểm tra request data format

## Support

- SePay Documentation: https://developer.sepay.vn
- SePay Support: support@sepay.vn
