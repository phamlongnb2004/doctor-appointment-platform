# ✅ Deployment Checklist - Render + SePay

## 📋 Tổng quan

Hệ thống đã được cập nhật để:
- ✅ Hỗ trợ PostgreSQL (miễn phí trên Render)
- ✅ Tích hợp SePay Payment Gateway
- ✅ Sẵn sàng deploy lên production

## 🎯 Các bước thực hiện (Theo thứ tự)

### Phase 1: Setup Database (15 phút)

- [ ] **1.1** Tạo PostgreSQL database trên Render
  - Truy cập: https://dashboard.render.com
  - New + → PostgreSQL
  - Name: `doctor-appointment-db`
  - Region: Singapore
  - Plan: Free
  
- [ ] **1.2** Lấy connection info
  - Copy Internal Database URL
  - Copy Username
  - Copy Password
  
- [ ] **1.3** Đọc hướng dẫn chi tiết
  - File: `SETUP_POSTGRESQL_RENDER.md`

### Phase 2: Cấu hình Backend (10 phút)

- [ ] **2.1** Vào Backend Service trên Render
  - URL: https://dashboard.render.com/web/doctor-appointment-backend
  
- [ ] **2.2** Thêm Database Environment Variables
  ```
  SPRING_DATASOURCE_URL=<Internal Database URL>
  SPRING_DATASOURCE_USERNAME=<username>
  SPRING_DATASOURCE_PASSWORD=<password>
  SPRING_DATASOURCE_DRIVER=org.postgresql.Driver
  HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
  ```
  
- [ ] **2.3** Thêm App Environment Variables
  ```
  APP_BASE_URL=https://doctor-appointment-backend-mq2p.onrender.com
  FRONTEND_URL=https://doctor-appointment-frontend-ujug.onrender.com
  PORT=8080
  ```
  
- [ ] **2.4** Click "Save Changes"

### Phase 3: Deploy Backend (5-10 phút)

- [ ] **3.1** Render tự động redeploy sau khi save env vars
  
- [ ] **3.2** Theo dõi logs
  - Backend Service → Logs tab
  - Đợi thấy: "Started DoctorAppointmentApplication"
  
- [ ] **3.3** Test backend
  - Truy cập: https://doctor-appointment-backend-mq2p.onrender.com/api/test
  - Nếu có response → Backend OK!

### Phase 4: Setup SePay (20 phút)

- [ ] **4.1** Đăng ký tài khoản SePay
  - Truy cập: https://my.sepay.vn/register
  - Xác thực email
  
- [ ] **4.2** Kích hoạt Cổng thanh toán
  - Vào "CỔNG THANH TOÁN" → "Đăng ký"
  - Chọn "Quét mã QR chuyển khoản ngân hàng"
  - Chọn "Bắt đầu với Sandbox"
  - Chọn phương thức: "API"
  
- [ ] **4.3** Lấy thông tin tích hợp
  - Copy MERCHANT_ID
  - Copy SECRET_KEY
  
- [ ] **4.4** Cấu hình IPN trên SePay
  - Điền IPN URL:
    ```
    https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn
    ```
  - Lưu cấu hình
  
- [ ] **4.5** Thêm SePay Environment Variables trên Render
  ```
  SEPAY_MERCHANT_ID=<your_merchant_id>
  SEPAY_SECRET_KEY=<your_secret_key>
  SEPAY_ENV=sandbox
  SEPAY_CHECKOUT_URL=https://sandbox.sepay.vn/v1/checkout/init
  SEPAY_IPN_URL=https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn
  ```
  
- [ ] **4.6** Save và đợi redeploy

- [ ] **4.7** Đọc hướng dẫn chi tiết
  - File: `SEPAY_SETUP_CHECKLIST.md`

### Phase 5: Test System (15 phút)

- [ ] **5.1** Test Frontend
  - Truy cập: https://doctor-appointment-frontend-ujug.onrender.com
  - Kiểm tra trang load được không
  
- [ ] **5.2** Test Backend API
  - Truy cập: https://doctor-appointment-backend-mq2p.onrender.com/api/test
  - Kiểm tra response
  
- [ ] **5.3** Test Database Connection
  - Login vào hệ thống
  - Tạo appointment test
  - Kiểm tra data được lưu
  
- [ ] **5.4** Test SePay Integration
  - Truy cập: https://doctor-appointment-frontend-ujug.onrender.com/sepay-test
  - Nhập thông tin test
  - Nhấn "Tạo Test Checkout"
  - Kiểm tra response có `status: "success"`
  - Nhấn "Chuyển đến SePay"
  - Thực hiện thanh toán test
  
- [ ] **5.5** Test Full Checkout Flow
  - Vào /services → Chọn dịch vụ
  - Thêm vào giỏ hàng
  - Checkout → Chọn "Thanh toán qua SePay"
  - Điền thông tin → Đặt hàng
  - Kiểm tra redirect đến SePay
  - Thực hiện thanh toán
  - Kiểm tra IPN callback (xem logs backend)
  - Kiểm tra đơn hàng được cập nhật

### Phase 6: Monitoring & Logs (Ongoing)

- [ ] **6.1** Setup monitoring
  - Render Dashboard → Backend Service → Metrics
  - Theo dõi CPU, Memory, Response time
  
- [ ] **6.2** Kiểm tra logs định kỳ
  - Backend logs: Errors, warnings
  - Database logs: Slow queries
  - SePay logs: Payment status
  
- [ ] **6.3** Setup alerts (Optional)
  - Email alerts cho errors
  - Slack/Discord webhooks

## 📚 Tài liệu tham khảo

1. **SETUP_POSTGRESQL_RENDER.md** - Setup database chi tiết
2. **SEPAY_SETUP_CHECKLIST.md** - Setup SePay từng bước
3. **SEPAY_INTEGRATION.md** - Chi tiết kỹ thuật SePay
4. **RENDER_SEPAY_CONFIG.md** - Cấu hình Render
5. **FIX_DATABASE_CONNECTION.md** - Troubleshooting database

## 🚨 Troubleshooting

### Backend không start
- ✅ Kiểm tra logs: Backend Service → Logs
- ✅ Kiểm tra env vars: Đã set đủ chưa?
- ✅ Kiểm tra database: Connection string đúng chưa?

### Database connection failed
- ✅ Xem: `FIX_DATABASE_CONNECTION.md`
- ✅ Kiểm tra PostgreSQL database đã tạo chưa
- ✅ Kiểm tra connection string

### SePay không hoạt động
- ✅ Xem: `SEPAY_SETUP_CHECKLIST.md`
- ✅ Kiểm tra MERCHANT_ID và SECRET_KEY
- ✅ Kiểm tra IPN URL đã cấu hình chưa

### Frontend không load
- ✅ Kiểm tra REACT_APP_API_URL
- ✅ Kiểm tra CORS settings
- ✅ Clear browser cache

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **SePay Docs**: https://developer.sepay.vn
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

## ✨ Sau khi hoàn thành

Hệ thống của bạn sẽ có:
- ✅ Backend chạy trên Render với PostgreSQL
- ✅ Frontend chạy trên Render
- ✅ SePay payment gateway hoạt động
- ✅ Database persistent và reliable
- ✅ Sẵn sàng cho production

## 🎉 Go Live Checklist (Khi sẵn sàng)

- [ ] Chuyển SePay từ Sandbox sang Production
- [ ] Cập nhật SEPAY_ENV=production
- [ ] Cập nhật SEPAY_CHECKOUT_URL
- [ ] Liên kết tài khoản ngân hàng thật
- [ ] Test kỹ trên production
- [ ] Thông báo cho users
- [ ] Monitor closely trong 24h đầu

---

**Tạo bởi**: Kiro AI Assistant  
**Ngày**: 2024-04-08  
**Version**: 1.0.0

**Ước tính thời gian hoàn thành**: 60-75 phút
