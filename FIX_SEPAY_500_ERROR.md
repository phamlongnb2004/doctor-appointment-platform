# FIX SEPAY 500 ERROR - ĐÃ GIẢI QUYẾT ✅

## Vấn đề
Thanh toán SePay bị lỗi 500 khi submit form

## Nguyên nhân
So sánh với tài liệu chính thức của SePay, phát hiện các lỗi sau:

1. **Thiếu field `operation`**: Theo tài liệu SePay, field này là BẮT BUỘC với giá trị `'PURCHASE'`
2. **Thiếu field `paymentMethod`**: Theo tài liệu Node.js SDK mới nhất, field này là BẮT BUỘC với giá trị `'BANK_TRANSFER'`
3. **Sai tên field**: Tài liệu SePay sử dụng **camelCase** nhưng code đang dùng **snake_case**
   - ❌ `order_invoice_number` → ✅ `orderInvoiceNumber`
   - ❌ `order_amount` → ✅ `orderAmount`
   - ❌ `order_description` → ✅ `orderDescription`
   - ❌ `merchant_id` → ✅ `merchantId`
   - ❌ `success_url` → ✅ `successUrl`
   - ❌ `error_url` → ✅ `errorUrl`
   - ❌ `cancel_url` → ✅ `cancelUrl`
   - ❌ `customer_name` → ✅ `customerName`
   - ❌ `customer_email` → ✅ `customerEmail`
   - ❌ `customer_phone` → ✅ `customerPhone`
   - ❌ `payment_method` → ✅ `paymentMethod`
4. **IPN format sai**: IPN từ SePay trả về nested JSON với structure khác

## Các file đã sửa

### 1. Backend - SePayService.java
- ✅ Thêm field `operation: "PURCHASE"`
- ✅ Thêm field `paymentMethod: "BANK_TRANSFER"` (theo tài liệu Node.js SDK mới nhất)
- ✅ Đổi tất cả field names từ snake_case sang camelCase

### 2. Backend - OrderController.java
- ✅ Cập nhật IPN callback để xử lý đúng format JSON từ SePay
- ✅ Đọc `notification_type` = "ORDER_PAID"
- ✅ Đọc nested object `order.order_invoice_number` và `order.order_status`
- ✅ Kiểm tra `order_status` = "CAPTURED" để confirm payment
- ✅ Luôn trả về 200 OK để tránh SePay retry liên tục

### 3. Frontend - SePayCheckoutPage.js
- ✅ Cập nhật form HTML để submit với camelCase field names
- ✅ Thêm field `operation`
- ✅ Thêm field `paymentMethod`

## Format IPN từ SePay

Khi thanh toán thành công, SePay sẽ gửi POST request đến IPN URL với JSON:

```json
{
   "timestamp": 1759134682,
   "notification_type": "ORDER_PAID",
   "order": {
       "id": "e2c195be-c721-47eb-b323-99ab24e52d85",
       "order_id": "NQD-68DA43D73C1A5",
       "order_status": "CAPTURED",
       "order_currency": "VND",
       "order_amount": "100000.00",
       "order_invoice_number": "INV-1759134677",
       "order_description": "Test payment"
   },
   "transaction": {
       "id": "384c66dd-41e6-4316-a544-b4141682595c",
       "payment_method": "BANK_TRANSFER",
       "transaction_status": "APPROVED",
       "transaction_amount": "100000"
   }
}
```

Backend sẽ:
1. Kiểm tra `notification_type` = "ORDER_PAID"
2. Lấy `order.order_invoice_number`
3. Kiểm tra `order.order_status` = "CAPTURED"
4. Gọi `orderService.confirmPayment(orderInvoiceNumber)`
5. Trả về `{"success": true}` với status 200

## Cách test

1. **Rebuild backend:**
```bash
cd backend
mvn clean package
```

2. **Restart backend server**

3. **Test thanh toán:**
   - Vào trang checkout
   - Chọn phương thức thanh toán SePay
   - Submit form
   - Kiểm tra không còn lỗi 500

4. **Test IPN (local):**
```bash
curl -X POST http://localhost:8080/api/orders/sepay/ipn \
  -H "Content-Type: application/json" \
  -d '{
    "notification_type": "ORDER_PAID",
    "order": {
      "order_invoice_number": "ORD-123456",
      "order_status": "CAPTURED"
    }
  }'
```

## Tham khảo
- Tài liệu SePay: https://docs.sepay.vn
- Tài liệu Node.js SDK: https://docs.sepay.vn/nodejs-sdk
- Các field bắt buộc cho checkout:
  - `merchantId` (string)
  - `operation` (string) - "PURCHASE"
  - `paymentMethod` (string) - "BANK_TRANSFER"
  - `orderInvoiceNumber` (string)
  - `orderAmount` (integer)
  - `currency` (string) - "VND"
  - `orderDescription` (string)
  - `successUrl` (string)
  - `errorUrl` (string)
  - `cancelUrl` (string)
  - `signature` (string) - HMAC-SHA256

## Ghi chú
- Signature được tính dựa trên tất cả các field (trừ signature) theo thứ tự alphabet
- Sử dụng HMAC-SHA256 với secret key từ SePay
- Environment: sandbox hoặc production
- IPN endpoint phải public và accessible từ internet
- IPN endpoint đã được permit trong SecurityConfig (không cần authentication)

## Biến môi trường cần thiết

Đảm bảo các biến sau được set trong `application.yml` hoặc environment variables:

```yaml
sepay:
  merchant-id: ${SEPAY_MERCHANT_ID}
  secret-key: ${SEPAY_SECRET_KEY}
  env: sandbox
  checkout-url: https://pay.sepay.vn/v1/checkout/init
  ipn-url: ${APP_BASE_URL}/api/orders/sepay/ipn
```

Trên Render.com, thêm:
```
SEPAY_MERCHANT_ID=YOUR_MERCHANT_ID
SEPAY_SECRET_KEY=YOUR_SECRET_KEY
SEPAY_ENV=sandbox
SEPAY_CHECKOUT_URL=https://pay.sepay.vn/v1/checkout/init
SEPAY_IPN_URL=https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn
```
