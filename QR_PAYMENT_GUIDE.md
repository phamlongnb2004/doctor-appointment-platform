# Hướng dẫn thanh toán QR Code

## Tính năng đã hoàn thành

### 1. Frontend - CheckoutPage
- ✅ Thêm tùy chọn thanh toán "Chuyển khoản ngân hàng" và "Ví MoMo"
- ✅ Tự động tạo mã QR khi chọn phương thức chuyển khoản
- ✅ Hiển thị modal QR code với đầy đủ thông tin:
  - Mã QR để quét
  - Thông tin ngân hàng (MB Bank)
  - Số tài khoản: 0123456789
  - Chủ tài khoản: MEDLATEC
  - Số tiền chính xác
  - Nội dung chuyển khoản (MEDLATEC + Mã đơn hàng)
- ✅ Tự động kiểm tra trạng thái thanh toán mỗi 5 giây
- ✅ Chuyển hướng tự động khi thanh toán thành công

### 2. Backend - OrderController & OrderService
- ✅ Endpoint cập nhật trạng thái thanh toán: `PUT /api/orders/{id}/payment-status`
- ✅ Webhook nhận thông báo từ ngân hàng: `POST /api/orders/webhook/payment`
- ✅ Tự động xác nhận đơn hàng khi thanh toán thành công
- ✅ Cập nhật thời gian thanh toán (paidAt)

### 3. Trang Test - PaymentTestPage
- ✅ Trang giả lập xác nhận thanh toán (thay thế webhook thật)
- ✅ Truy cập tại: `http://localhost:3000/payment-test`
- ✅ Nhập mã đơn hàng và số tiền để xác nhận

## Cách sử dụng

### Quy trình thanh toán QR

1. **Khách hàng đặt hàng:**
   - Vào trang giỏ hàng
   - Nhấn "Thanh toán"
   - Điền thông tin giao hàng
   - Chọn "Chuyển khoản ngân hàng"
   - Nhấn "Đặt hàng"

2. **Hiển thị QR Code:**
   - Modal tự động hiện lên với mã QR
   - Thông tin ngân hàng đầy đủ
   - Số tiền và nội dung chuyển khoản tự động điền

3. **Khách hàng thanh toán:**
   - Mở app ngân hàng
   - Quét mã QR
   - Xác nhận chuyển khoản

4. **Xác nhận tự động:**
   - Hệ thống kiểm tra trạng thái mỗi 5 giây
   - Khi phát hiện thanh toán thành công → Tự động chuyển trang
   - Đơn hàng chuyển sang trạng thái "Đã xác nhận"

### Test thanh toán (Development)

**Cách 1: Sử dụng trang test**
1. Tạo đơn hàng với phương thức "Chuyển khoản ngân hàng"
2. Copy mã đơn hàng từ modal QR (ví dụ: ORD20260207023045001)
3. Mở trang test: `http://localhost:3000/payment-test`
4. Nhập mã đơn hàng và số tiền
5. Nhấn "Xác nhận thanh toán"
6. Quay lại modal QR → Tự động chuyển trang sau vài giây

**Cách 2: Gọi API trực tiếp**
```bash
curl -X POST http://localhost:8080/api/orders/webhook/payment \
  -H "Content-Type: application/json" \
  -d '{
    "orderNumber": "ORD20260207023045001",
    "status": "SUCCESS",
    "transactionId": "TXN123456",
    "amount": 500000
  }'
```

## API Endpoints

### 1. Cập nhật trạng thái thanh toán
```
PUT /api/orders/{orderId}/payment-status
Body: { "paymentStatus": "PAID" }
```

### 2. Webhook thanh toán
```
POST /api/orders/webhook/payment
Body: {
  "orderNumber": "ORD20260207023045001",
  "status": "SUCCESS",
  "transactionId": "TXN123456",
  "amount": 500000
}
```

### 3. Lấy thông tin đơn hàng theo mã
```
GET /api/orders/number/{orderNumber}
```

## Tích hợp thực tế

### Với VietQR API
- Đã sử dụng VietQR API để tạo mã QR: `https://img.vietqr.io/image/`
- Mã QR tự động chứa:
  - Số tài khoản ngân hàng
  - Số tiền chính xác
  - Nội dung chuyển khoản
- Khách hàng chỉ cần quét và xác nhận

### Với Webhook ngân hàng (Production)
1. Đăng ký webhook URL với ngân hàng
2. Ngân hàng gửi thông báo khi có giao dịch
3. Backend nhận webhook và xác nhận tự động
4. Frontend tự động cập nhật trạng thái

### Với API kiểm tra giao dịch
1. Gọi API ngân hàng để kiểm tra giao dịch
2. So sánh số tiền và nội dung
3. Tự động xác nhận nếu khớp

## Cấu hình

### Thông tin ngân hàng (có thể lưu trong CMS)
```javascript
const bankId = 'MB'; // Mã ngân hàng
const accountNo = '0123456789'; // Số tài khoản
const accountName = 'MEDLATEC'; // Tên tài khoản
```

### Thời gian kiểm tra
```javascript
const CHECK_INTERVAL = 5000; // 5 giây
```

## Lưu ý

1. **Bảo mật:**
   - Webhook cần xác thực signature từ ngân hàng
   - Kiểm tra số tiền và nội dung chuyển khoản
   - Log tất cả giao dịch

2. **UX:**
   - Cho phép khách hàng "Thanh toán sau"
   - Hiển thị hướng dẫn rõ ràng
   - Thông báo khi đang chờ xác nhận

3. **Production:**
   - Thay thông tin ngân hàng thật
   - Tích hợp webhook thật từ ngân hàng
   - Thêm logging và monitoring
   - Xử lý timeout và retry

## Files đã thay đổi

### Frontend
- `frontend/src/pages/CheckoutPage.js` - Thêm QR payment
- `frontend/src/pages/PaymentTestPage.js` - Trang test (mới)
- `frontend/src/App.js` - Thêm route

### Backend
- `backend/src/main/java/com/doctorappointment/controller/OrderController.java` - Thêm endpoints
- `backend/src/main/java/com/doctorappointment/service/OrderService.java` - Thêm logic xác nhận

## Hoàn thành! 🎉

Hệ thống thanh toán QR code đã sẵn sàng sử dụng với đầy đủ tính năng:
- ✅ Tạo QR tự động
- ✅ Hiển thị thông tin đầy đủ
- ✅ Kiểm tra trạng thái tự động
- ✅ Xác nhận thanh toán tự động
- ✅ Trang test để development
