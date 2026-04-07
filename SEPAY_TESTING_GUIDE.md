# Hướng dẫn Test SePay Integration

## 🎯 Mục tiêu
Kiểm tra xem lỗi 500 đã được fix chưa và SePay hoạt động đúng

## 📋 Các bước test

### Bước 1: Kiểm tra Deploy trên Render

1. Vào: https://dashboard.render.com
2. Chọn service: `doctor-appointment-backend-mq2p`
3. Tab **Events** - Xem deploy status
4. Đợi đến khi thấy: ✅ "Deploy live"
5. Thời gian deploy: ~3-5 phút

### Bước 2: Test qua Browser (Cách dễ nhất)

#### 2.1. Mở Developer Tools
- Chrome/Edge: `F12` hoặc `Ctrl+Shift+I`
- Tab **Console** và **Network**

#### 2.2. Thực hiện thanh toán
1. Vào: https://doctor-appointment-frontend-ujug.onrender.com
2. Đăng nhập (nếu cần):
   - Email: `admin@doctor.com`
   - Password: `password123`
3. Thêm dịch vụ vào giỏ hàng
4. Vào trang **Checkout**
5. Điền thông tin khách hàng
6. Chọn phương thức: **SePay**
7. Click **"Thanh toán"**

#### 2.3. Kiểm tra kết quả

**✅ Thành công nếu:**
- Không thấy lỗi 500 trong Console
- Được chuyển đến trang SePay
- Thấy form thanh toán với QR code
- Network tab hiển thị:
  ```
  POST /api/orders/sepay/checkout
  Status: 200 OK
  ```

**❌ Thất bại nếu:**
- Thấy lỗi 500 trong Console
- Không chuyển trang
- Network tab hiển thị:
  ```
  POST /api/orders/sepay/checkout
  Status: 500 Internal Server Error
  ```

### Bước 3: Kiểm tra Response Data

Trong **Network tab**, click vào request `sepay/checkout`:

**Tab Response - Kiểm tra các field:**
```json
{
  "merchantId": "SP-TEST-...",
  "operation": "PURCHASE",          // ← QUAN TRỌNG: Phải có field này
  "orderInvoiceNumber": "ORD-...",
  "orderAmount": 100000,
  "currency": "VND",
  "orderDescription": "...",
  "successUrl": "...",
  "errorUrl": "...",
  "cancelUrl": "...",
  "signature": "...",
  "checkout_url": "https://pay.sepay.vn/v1/checkout/init"
}
```

**Kiểm tra:**
- ✅ Có field `operation` với giá trị `"PURCHASE"`
- ✅ Tất cả field dùng **camelCase** (không có underscore)
- ✅ Có đầy đủ các field bắt buộc

### Bước 4: Test với Postman/Thunder Client (Optional)

#### 4.1. Tạo request mới
```
Method: POST
URL: https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/checkout
Headers:
  Content-Type: application/json
Body (JSON):
{
  "items": [
    {
      "serviceId": 1,
      "quantity": 1
    }
  ],
  "customerName": "Nguyen Van Test",
  "customerEmail": "test@example.com",
  "customerPhone": "0123456789",
  "shippingAddress": "123 Test Street"
}
```

#### 4.2. Gửi request và kiểm tra
- Status code: `200 OK`
- Response có đầy đủ field như trên

### Bước 5: Test IPN Endpoint

#### 5.1. Tạo request IPN test
```
Method: POST
URL: https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn
Headers:
  Content-Type: application/json
Body (JSON):
{
  "timestamp": 1759134682,
  "notification_type": "ORDER_PAID",
  "order": {
    "id": "test-order-id",
    "order_id": "NQD-TEST123",
    "order_status": "CAPTURED",
    "order_currency": "VND",
    "order_amount": "100000.00",
    "order_invoice_number": "ORD-123456",
    "order_description": "Test payment"
  },
  "transaction": {
    "id": "test-transaction-id",
    "payment_method": "BANK_TRANSFER",
    "transaction_status": "APPROVED",
    "transaction_amount": "100000"
  }
}
```

#### 5.2. Kiểm tra response
```json
{
  "success": true,
  "message": "IPN received"
}
```

### Bước 6: Kiểm tra Logs trên Render

1. Vào Render Dashboard
2. Service: `doctor-appointment-backend-mq2p`
3. Tab **Logs**
4. Tìm dòng log:
   ```
   Received SePay IPN: {...}
   ```
5. Kiểm tra không có error

## 🐛 Troubleshooting

### Vẫn bị lỗi 500?

**Kiểm tra:**
1. Deploy đã xong chưa?
2. Environment variables đã set đúng chưa?
   - `SEPAY_MERCHANT_ID`
   - `SEPAY_SECRET_KEY`
3. Xem logs để biết lỗi cụ thể

### Không chuyển đến trang SePay?

**Kiểm tra:**
1. Response có field `checkout_url` không?
2. Frontend có submit form đúng không?
3. Xem Console log trong browser

### IPN không hoạt động?

**Kiểm tra:**
1. IPN URL có public không?
2. SecurityConfig đã permit `/orders/sepay/ipn` chưa?
3. Format JSON từ SePay có đúng không?

## ✅ Checklist

- [ ] Deploy trên Render đã xong
- [ ] Test checkout không còn lỗi 500
- [ ] Response có field `operation`
- [ ] Tất cả field dùng camelCase
- [ ] Chuyển đến trang SePay thành công
- [ ] IPN endpoint trả về 200 OK
- [ ] Logs không có error

## 📞 Liên hệ

Nếu vẫn gặp vấn đề:
1. Chụp màn hình Console log
2. Chụp màn hình Network tab
3. Copy logs từ Render
4. Gửi cho team để debug
