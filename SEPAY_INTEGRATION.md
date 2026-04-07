# Tích hợp SePay Payment Gateway

## Tổng quan

Hệ thống đã được tích hợp với SePay Payment Gateway để xử lý thanh toán trực tuyến. SePay hỗ trợ nhiều phương thức thanh toán bao gồm chuyển khoản ngân hàng và ví điện tử.

## Cấu hình

### 1. Backend Configuration

Cập nhật file `backend/src/main/resources/application.yml`:

```yaml
sepay:
  merchant-id: YOUR_MERCHANT_ID          # Thay bằng Merchant ID thực tế
  secret-key: YOUR_MERCHANT_SECRET_KEY   # Thay bằng Secret Key thực tế
  env: sandbox                           # sandbox hoặc production
  checkout-url: https://sandbox.sepay.vn/v1/checkout/init  # API endpoint
  ipn-url: http://localhost:8080/api/orders/sepay/ipn      # URL nhận IPN callback

app:
  frontend-url: http://localhost:3000    # URL frontend của bạn
```

### 2. Production Configuration

Khi deploy lên production, cập nhật file `application-prod.yml`:

```yaml
sepay:
  merchant-id: ${SEPAY_MERCHANT_ID}
  secret-key: ${SEPAY_SECRET_KEY}
  env: production
  checkout-url: https://pay.sepay.vn/v1/checkout/init
  ipn-url: ${APP_BASE_URL}/orders/sepay/ipn

app:
  frontend-url: ${FRONTEND_URL}
```

### 3. Cấu hình IPN URL trên SePay Dashboard

Đăng nhập vào SePay Dashboard và cấu hình IPN URL:

- **Development**: `http://your-dev-domain.com/api/orders/sepay/ipn`
- **Production**: `https://your-domain.com/api/orders/sepay/ipn`

**Lưu ý**: IPN URL phải là URL công khai, có thể truy cập từ internet. Nếu đang phát triển local, bạn có thể sử dụng ngrok hoặc các công cụ tương tự để tạo URL công khai.

## Luồng thanh toán

### 1. Khách hàng chọn phương thức thanh toán SePay

Trên trang checkout, khách hàng chọn "Thanh toán qua SePay" và điền thông tin giao hàng.

### 2. Backend gọi SePay API

```
POST https://sandbox.sepay.vn/v1/checkout/init
Content-Type: application/json

{
  "merchant_id": "...",
  "order_invoice_number": "ORD20240407...",
  "order_amount": 100000,
  "currency": "VND",
  "payment_method": "BANK_TRANSFER",
  "order_description": "Thanh toan don hang ORD...",
  "success_url": "http://localhost:3000/order-success/ORD...",
  "error_url": "http://localhost:3000/checkout?error=...",
  "cancel_url": "http://localhost:3000/checkout?cancelled=...",
  "customer_name": "Nguyễn Văn A",
  "customer_email": "email@example.com",
  "customer_phone": "0912345678",
  "signature": "..."
}

// Response
{
  "status": "success",
  "checkout_url": "https://pay.sepay.vn/checkout/xxx",
  "order_invoice_number": "ORD20240407...",
  ...
}
```

### 3. Frontend redirect đến SePay

Frontend nhận response và redirect user đến `checkout_url`.

### 4. Khách hàng thanh toán trên SePay

Khách hàng thực hiện thanh toán trên trang SePay với các phương thức:
- Chuyển khoản ngân hàng
- Ví điện tử (MoMo, ZaloPay, VNPay, ...)
- Thẻ ATM/Credit Card

### 5. SePay xử lý và callback

Sau khi thanh toán:
- **Thành công**: SePay redirect về `success_url` và gửi IPN đến server
- **Thất bại**: SePay redirect về `error_url`
- **Hủy**: SePay redirect về `cancel_url`

### 6. Server nhận IPN và cập nhật đơn hàng

```
POST /api/orders/sepay/ipn
Content-Type: application/json

{
  "merchant_id": "...",
  "order_invoice_number": "ORD...",
  "order_amount": 100000,
  "status": "SUCCESS",
  "transaction_id": "...",
  "signature": "...",
  ...
}
```

Server sẽ:
1. Verify signature để đảm bảo request từ SePay
2. Cập nhật trạng thái thanh toán của đơn hàng
3. Xóa giỏ hàng nếu thanh toán thành công
4. Gửi email xác nhận (nếu có)

## API Endpoints

### 1. Tạo checkout SePay

```
POST /api/orders/sepay/checkout
Authorization: Bearer {token} (optional)
Query Params: userId (optional)

Request Body:
{
  "customerName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "shippingAddress": "string",
  "shippingCity": "string",
  "shippingWard": "string",
  "shippingNotes": "string",
  "paymentMethod": "SEPAY",
  "sessionId": "string" (for guest checkout)
}

Response:
{
  "status": "success",
  "checkout_url": "https://pay.sepay.vn/checkout/xxx",
  "order_invoice_number": "ORD...",
  "merchant_id": "...",
  ...
}
```

### 2. IPN Callback (từ SePay)

```
POST /api/orders/sepay/ipn
Content-Type: application/json

Request Body:
{
  "merchant_id": "string",
  "order_invoice_number": "string",
  "order_amount": number,
  "currency": "VND",
  "status": "SUCCESS|FAILED",
  "transaction_id": "string",
  "payment_method": "string",
  "signature": "string"
}

Response:
{
  "status": "success",
  "message": "Payment confirmed"
}
```

## Security

### Signature Verification

Mọi request từ SePay đều được ký bằng HMAC-SHA256. Server sẽ verify signature trước khi xử lý:

```java
// Tạo signature
String data = "key1=value1&key2=value2&..."; // Sorted by key
String signature = HMAC_SHA256(data, secretKey);

// Verify signature
boolean isValid = calculatedSignature.equals(receivedSignature);
```

### Best Practices

1. **Không bao giờ** lưu Secret Key trong code
2. Sử dụng environment variables cho production
3. Luôn verify signature từ IPN callback
4. Log tất cả các transaction để audit
5. Xử lý idempotent cho IPN (có thể nhận nhiều lần)

## Testing

### 1. Môi trường Sandbox

SePay cung cấp môi trường sandbox để test:
- URL: `https://sandbox.sepay.vn/checkout`
- Sử dụng Merchant ID và Secret Key test

### 2. Test Cases

- ✅ Thanh toán thành công
- ✅ Thanh toán thất bại
- ✅ Hủy thanh toán
- ✅ IPN callback
- ✅ Signature verification
- ✅ Duplicate IPN handling

### 3. Test với ngrok (Local Development)

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 8080

# Cập nhật IPN URL trên SePay Dashboard
https://your-ngrok-url.ngrok.io/api/orders/sepay/ipn
```

## Troubleshooting

### 1. IPN không nhận được

- Kiểm tra IPN URL có đúng không
- Kiểm tra firewall/security group
- Kiểm tra logs của SePay Dashboard
- Verify URL có thể truy cập từ internet

### 2. Signature verification failed

- Kiểm tra Secret Key
- Kiểm tra thứ tự sort parameters
- Kiểm tra encoding (UTF-8)
- Log data string trước khi hash

### 3. Đơn hàng không cập nhật

- Kiểm tra logs backend
- Verify IPN callback có được gọi không
- Kiểm tra order number có đúng không
- Kiểm tra database connection

## Support

Nếu gặp vấn đề, liên hệ:
- SePay Support: support@sepay.vn
- Documentation: https://docs.sepay.vn

## Changelog

### Version 1.0.0 (2024-04-07)
- ✅ Tích hợp SePay Payment Gateway
- ✅ Hỗ trợ chuyển khoản ngân hàng
- ✅ IPN callback handling
- ✅ Signature verification
- ✅ Order status update
- ✅ Cart clearing after payment
