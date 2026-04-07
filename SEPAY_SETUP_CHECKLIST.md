# ✅ Checklist: Cấu hình SePay trên Production

## 📋 Các bước thực hiện

### 1. ✅ Code đã được push lên Git
- [x] Backend: SePayConfig, SePayService, OrderController
- [x] Frontend: SePayCheckoutPage, SePayTestPage, CheckoutPage
- [x] Documentation: SEPAY_INTEGRATION.md, RENDER_SEPAY_CONFIG.md

### 2. 🔧 Cấu hình trên Render Backend

Truy cập: https://dashboard.render.com → Backend Service → Environment

Thêm các Environment Variables sau:

```bash
# SePay Configuration
SEPAY_MERCHANT_ID=<your_merchant_id>
SEPAY_SECRET_KEY=<your_secret_key>
SEPAY_ENV=sandbox
SEPAY_CHECKOUT_URL=https://sandbox.sepay.vn/v1/checkout/init
SEPAY_IPN_URL=https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn

# Frontend URL
FRONTEND_URL=https://doctor-appointment-frontend-ujug.onrender.com
```

**Sau khi thêm → Nhấn "Save Changes" → Service sẽ tự động redeploy**

### 3. 🏦 Đăng ký và cấu hình SePay

#### Bước 3.1: Đăng ký tài khoản
1. Truy cập: https://my.sepay.vn/register
2. Đăng ký tài khoản mới
3. Xác thực email

#### Bước 3.2: Kích hoạt Cổng thanh toán
1. Đăng nhập vào https://my.sepay.vn
2. Vào mục "CỔNG THANH TOÁN" → "Đăng ký"
3. Chọn "Quét mã QR chuyển khoản ngân hàng"
4. Chọn "Bắt đầu với Sandbox"
5. Chọn phương thức tích hợp: "API"

#### Bước 3.3: Lấy thông tin tích hợp
1. Copy MERCHANT_ID
2. Copy SECRET_KEY
3. Paste vào Environment Variables trên Render (Bước 2)

#### Bước 3.4: Cấu hình IPN
1. Tại màn hình thông tin tích hợp
2. Điền IPN URL:
   ```
   https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn
   ```
3. Lưu cấu hình

### 4. 🧪 Test trên Production

#### Test 1: Trang test trực tiếp
1. Truy cập: https://doctor-appointment-frontend-ujug.onrender.com/sepay-test
2. Nhập thông tin test
3. Nhấn "Tạo Test Checkout"
4. Kiểm tra response có `status: "success"` và `checkout_url`
5. Nhấn "Chuyển đến SePay"
6. Thực hiện thanh toán test trên SePay

#### Test 2: Flow đầy đủ
1. Truy cập: https://doctor-appointment-frontend-ujug.onrender.com/services
2. Chọn một dịch vụ → Thêm vào giỏ hàng
3. Vào giỏ hàng → Checkout
4. Chọn "Thanh toán qua SePay"
5. Điền thông tin giao hàng
6. Đặt hàng
7. Kiểm tra redirect đến SePay
8. Thực hiện thanh toán test

#### Test 3: Kiểm tra IPN
1. Sau khi thanh toán thành công trên SePay
2. Kiểm tra logs backend trên Render
3. Tìm log: "Payment confirmed"
4. Kiểm tra đơn hàng đã được cập nhật trạng thái

### 5. 📊 Kiểm tra trên SePay Dashboard

1. Truy cập: https://my.sepay.vn/pg/transactions
2. Xem danh sách giao dịch test
3. Kiểm tra trạng thái giao dịch
4. Xem chi tiết IPN callback

### 6. 🚀 Go Live (Khi sẵn sàng)

#### Bước 6.1: Chuyển sang Production trên SePay
1. Vào SePay Dashboard
2. Chọn "Chuyển sang Production"
3. Liên kết tài khoản ngân hàng thật
4. Nhận MERCHANT_ID và SECRET_KEY production

#### Bước 6.2: Cập nhật Environment Variables
```bash
SEPAY_MERCHANT_ID=<production_merchant_id>
SEPAY_SECRET_KEY=<production_secret_key>
SEPAY_ENV=production
SEPAY_CHECKOUT_URL=https://pay.sepay.vn/v1/checkout/init
```

#### Bước 6.3: Cập nhật IPN URL production
Trên SePay Dashboard, cập nhật IPN URL sang production endpoint

#### Bước 6.4: Redeploy
Render sẽ tự động redeploy sau khi save environment variables

## 🔍 Troubleshooting

### Lỗi: "Invalid signature"
- ✅ Kiểm tra SECRET_KEY có đúng không
- ✅ Kiểm tra MERCHANT_ID có đúng không
- ✅ Xem logs backend để debug

### Lỗi: "IPN không nhận được"
- ✅ Kiểm tra IPN URL có public không
- ✅ Kiểm tra firewall/security settings
- ✅ Xem logs trên SePay Dashboard

### Lỗi: "Checkout URL không hoạt động"
- ✅ Kiểm tra SEPAY_CHECKOUT_URL
- ✅ Kiểm tra request format
- ✅ Xem response error từ SePay API

## 📞 Support

- **SePay Documentation**: https://developer.sepay.vn
- **SePay Support**: support@sepay.vn
- **Render Support**: https://render.com/docs

## 📝 Notes

- Sandbox environment dùng để test, không có giao dịch thật
- Production environment cần liên kết tài khoản ngân hàng thật
- IPN URL phải là HTTPS và public
- Signature verification rất quan trọng cho bảo mật
- Luôn test kỹ trên Sandbox trước khi go live

---

**Tạo bởi**: Kiro AI Assistant
**Ngày**: 2024-04-08
**Version**: 1.0.0
