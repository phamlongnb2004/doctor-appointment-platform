# LUỒNG THANH TOÁN SEPAY - CHI TIẾT

## Sơ đồ tổng quan

```
Khách hàng → Website Merchant → SePay Gateway → Ngân hàng/Thẻ
```

## Chi tiết từng bước

### 1. Khách hàng chọn sản phẩm & thanh toán
- **File**: `frontend/src/pages/CheckoutPage.js`
- **Action**: Khách hàng điền thông tin và chọn phương thức "Thanh toán qua SePay"
- **Code**:
```javascript
if (paymentMethod === 'SEPAY') {
  const response = await axios.post(
    `${API_BASE_URL}/orders/sepay/checkout`,
    checkoutData,
    { params }
  );
  navigate('/sepay-checkout', { state: { sePayResponse } });
}
```

### 2. Website Merchant tạo đơn hàng
- **File**: `backend/src/main/java/com/doctorappointment/controller/OrderController.java`
- **Endpoint**: `POST /api/orders/sepay/checkout`
- **Action**: 
  - Tạo đơn hàng trong database
  - Gọi SePayService để tạo form checkout
- **Code**:
```java
@PostMapping("/sepay/checkout")
public ResponseEntity<Map<String, Object>> createSePayCheckout(
    @RequestParam(required = false) Long userId,
    @RequestBody CheckoutRequest request) {
    
    // Tạo đơn hàng trước
    OrderResponse order = orderService.createOrder(userId, request);
    
    // Tạo form data để submit đến SePay
    Map<String, Object> formData = sePayService.createCheckoutFormData(
        orderService.getOrderEntity(order.getId()),
        successUrl, errorUrl, cancelUrl
    );
    
    return ResponseEntity.ok(formData);
}
```

### 3. Tạo form checkout với signature
- **File**: `backend/src/main/java/com/doctorappointment/service/SePayService.java`
- **Action**: Tạo các field theo thứ tự alphabet và ký HMAC-SHA256
- **Fields bắt buộc**:
  - `cancelUrl` - URL khi khách hàng hủy
  - `currency` - "VND"
  - `customerEmail` (optional)
  - `customerName` (optional)
  - `customerPhone` (optional)
  - `errorUrl` - URL khi thanh toán lỗi
  - `merchantId` - Mã merchant từ SePay
  - `operation` - "PURCHASE"
  - `orderAmount` - Số tiền (integer)
  - `orderDescription` - Mô tả đơn hàng
  - `orderInvoiceNumber` - Mã đơn hàng (unique)
  - `paymentMethod` - "BANK_TRANSFER"
  - `successUrl` - URL khi thanh toán thành công
  - `signature` - Chữ ký HMAC-SHA256

- **Code**:
```java
public Map<String, Object> createCheckoutFormData(Order order, ...) {
    Map<String, Object> requestData = new LinkedHashMap<>();
    // Thêm các field theo thứ tự alphabet
    requestData.put("cancelUrl", cancelUrl);
    requestData.put("currency", "VND");
    // ... các field khác
    
    // Generate signature
    String signature = generateSignature(requestData);
    requestData.put("signature", signature);
    
    return requestData;
}
```

### 4. POST /v1/checkout/init
- **File**: `frontend/src/pages/SePayCheckoutPage.js`
- **Action**: Frontend tự động submit form POST đến SePay Gateway
- **URL**: `https://pay.sepay.vn/v1/checkout/init` (production) hoặc `https://pay-sandbox.sepay.vn/v1/checkout/init` (sandbox)
- **Code**:
```javascript
<form 
  ref={formRef}
  method="POST" 
  action={sePayResponse.checkout_url}
>
  <input type="hidden" name="merchantId" value={sePayResponse.merchantId} />
  <input type="hidden" name="operation" value={sePayResponse.operation} />
  <input type="hidden" name="orderInvoiceNumber" value={sePayResponse.orderInvoiceNumber} />
  <input type="hidden" name="orderAmount" value={sePayResponse.orderAmount} />
  <input type="hidden" name="currency" value={sePayResponse.currency} />
  <input type="hidden" name="orderDescription" value={sePayResponse.orderDescription} />
  <input type="hidden" name="paymentMethod" value={sePayResponse.paymentMethod} />
  <input type="hidden" name="successUrl" value={sePayResponse.successUrl} />
  <input type="hidden" name="errorUrl" value={sePayResponse.errorUrl} />
  <input type="hidden" name="cancelUrl" value={sePayResponse.cancelUrl} />
  <input type="hidden" name="signature" value={sePayResponse.signature} />
</form>
```

### 5. SePay Gateway xác thực signature
- **Action**: SePay kiểm tra chữ ký để đảm bảo request hợp lệ
- **Nếu sai**: Trả về lỗi 400/500
- **Nếu đúng**: Chuyển sang bước 6

### 6. Chuyển hướng đến trang thanh toán
- **Action**: SePay hiển thị trang thanh toán cho khách hàng
- **Khách hàng chọn**: Ngân hàng, thẻ, ví điện tử, v.v.

### 7. Khách hàng chọn phương thức thanh toán
- **Action**: Khách hàng chọn ngân hàng/thẻ và nhập thông tin

### 8. Xử lý thanh toán
- **Action**: SePay Gateway gửi request đến ngân hàng/thẻ

### 9. Kết quả thanh toán
- **Action**: Ngân hàng/thẻ trả về kết quả (thành công/thất bại)

---

## [Thanh toán thành công]

### 10a. Callback success_url
- **URL**: `https://doctor-appointment-frontend-ujug.onrender.com/order-success/{orderNumber}`
- **Action**: SePay redirect khách hàng về trang success
- **File**: `frontend/src/pages/OrderSuccessPage.js`

### 11a. IPN notification
- **Endpoint**: `POST /api/orders/sepay/ipn`
- **File**: `backend/src/main/java/com/doctorappointment/controller/OrderController.java`
- **Action**: SePay gửi thông báo thanh toán thành công (server-to-server)
- **JSON Format**:
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

- **Code xử lý**:
```java
@PostMapping("/sepay/ipn")
public ResponseEntity<Map<String, Object>> sePayIpn(@RequestBody Map<String, Object> ipnData) {
    String notificationType = (String) ipnData.get("notification_type");
    
    if ("ORDER_PAID".equals(notificationType)) {
        Map<String, Object> orderData = (Map<String, Object>) ipnData.get("order");
        String orderInvoiceNumber = (String) orderData.get("order_invoice_number");
        String orderStatus = (String) orderData.get("order_status");
        
        if ("CAPTURED".equals(orderStatus)) {
            orderService.confirmPayment(orderInvoiceNumber);
        }
    }
    
    // Luôn trả về 200 OK
    return ResponseEntity.ok(Map.of("success", true));
}
```

### 12a. Chuyển hướng về trang thành công
- **Action**: Hiển thị thông báo đơn hàng thành công
- **File**: `frontend/src/pages/OrderSuccessPage.js`

---

## [Thanh toán thất bại]

### 10b. Callback error_url
- **URL**: `https://doctor-appointment-frontend-ujug.onrender.com/checkout?error=payment_failed&order={orderNumber}`
- **Action**: SePay redirect về trang checkout với thông báo lỗi

### 12b. Chuyển hướng về trang lỗi
- **Action**: Hiển thị thông báo thanh toán thất bại
- **File**: `frontend/src/pages/CheckoutPage.js`

---

## [Khách hàng hủy]

### 10c. Callback cancel_url
- **URL**: `https://doctor-appointment-frontend-ujug.onrender.com/checkout?cancelled=true&order={orderNumber}`
- **Action**: SePay redirect về trang checkout

### 11c. Chuyển hướng về trang hủy
- **Action**: Hiển thị thông báo khách hàng đã hủy thanh toán
- **File**: `frontend/src/pages/CheckoutPage.js`

---

## 13. Hiển thị kết quả cuối cùng
- **Thành công**: Trang OrderSuccessPage với thông tin đơn hàng
- **Thất bại**: Trang CheckoutPage với thông báo lỗi
- **Hủy**: Trang CheckoutPage với thông báo hủy

---

## Cấu hình quan trọng

### Backend - application.yml
```yaml
sepay:
  merchant-id: ${SEPAY_MERCHANT_ID}
  secret-key: ${SEPAY_SECRET_KEY}
  env: sandbox  # hoặc production
  checkout-url: https://pay.sepay.vn/v1/checkout/init
  ipn-url: ${APP_BASE_URL}/api/orders/sepay/ipn
```

### Frontend - .env.production
```
REACT_APP_API_URL=https://doctor-appointment-backend-mq2p.onrender.com/api
```

### Render.com Environment Variables
```
SEPAY_MERCHANT_ID=SP-TEST-PT873684
SEPAY_SECRET_KEY=spsk_test_YtN9NC2N9adiW58jM8CUnBNd95pVtZUK
SEPAY_ENV=sandbox
SEPAY_CHECKOUT_URL=https://pay.sepay.vn/v1/checkout/init
SEPAY_IPN_URL=https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn
```

---

## Security Config

IPN endpoint phải được permit trong SecurityConfig (không cần authentication):

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/orders/sepay/ipn").permitAll()  // ✅ Cho phép SePay gọi IPN
            // ... các endpoint khác
        );
    return http.build();
}
```

---

## Testing

### Test local (với ngrok)
1. Cài ngrok: `npm install -g ngrok`
2. Chạy backend local: `mvn spring-boot:run`
3. Expose backend: `ngrok http 8080`
4. Cập nhật IPN URL trong SePay dashboard với URL ngrok
5. Test thanh toán

### Test production
1. Deploy backend lên Render
2. Cập nhật IPN URL trong SePay dashboard: `https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn`
3. Test thanh toán trên production

---

## Troubleshooting

### Lỗi 500 khi submit form
- ✅ Kiểm tra tất cả field names phải là camelCase
- ✅ Đảm bảo có field `operation: "PURCHASE"`
- ✅ Đảm bảo có field `paymentMethod: "BANK_TRANSFER"`
- ✅ Kiểm tra signature được tính đúng

### IPN không được gọi
- ✅ Kiểm tra IPN URL có public và accessible từ internet
- ✅ Kiểm tra SecurityConfig đã permit endpoint `/orders/sepay/ipn`
- ✅ Kiểm tra logs backend để xem có nhận được request không

### Thanh toán thành công nhưng đơn hàng không cập nhật
- ✅ Kiểm tra IPN endpoint có trả về 200 OK không
- ✅ Kiểm tra logic xử lý IPN có đúng không
- ✅ Kiểm tra `order_status` phải là "CAPTURED"

---

## Tài liệu tham khảo
- Tài liệu SePay: https://docs.sepay.vn
- Node.js SDK: https://docs.sepay.vn/nodejs-sdk
- PHP SDK: https://docs.sepay.vn/php-sdk
