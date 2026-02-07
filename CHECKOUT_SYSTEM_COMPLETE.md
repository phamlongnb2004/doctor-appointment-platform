# HỆ THỐNG THANH TOÁN DỊCH VỤ Y TẾ - HOÀN THÀNH

## Tổng quan
Hệ thống thanh toán đầy đủ cho website đặt dịch vụ y tế, bao gồm:
- Trang thanh toán với form thông tin đầy đủ
- Xử lý đơn hàng
- Trang xác nhận đơn hàng thành công
- Quản lý đơn hàng của người dùng
- Quản lý đơn hàng cho admin (sẽ thêm vào AdminCMSPage)

## Database Schema

### Bảng `orders`
- Lưu thông tin đơn hàng
- Thông tin khách hàng (tên, email, SĐT)
- Địa chỉ giao hàng (địa chỉ, quận/huyện, phường/xã, thành phố)
- Thông tin thanh toán (tổng tiền, phí ship, giảm giá)
- Phương thức thanh toán (COD, chuyển khoản, MoMo)
- Trạng thái đơn hàng (PENDING, CONFIRMED, PROCESSING, COMPLETED, CANCELLED)

### Bảng `order_items`
- Chi tiết sản phẩm/dịch vụ trong đơn hàng
- Lưu snapshot thông tin dịch vụ tại thời điểm đặt hàng
- Số lượng và giá

### Bảng `order_status_history`
- Lịch sử thay đổi trạng thái đơn hàng
- Ghi chú và người thực hiện

## Backend API

### OrderController Endpoints

1. **POST /api/orders/checkout**
   - Tạo đơn hàng mới từ giỏ hàng
   - Params: `userId` (optional)
   - Body: CheckoutRequest
   - Response: OrderResponse

2. **GET /api/orders/{id}**
   - Lấy chi tiết đơn hàng theo ID
   - Response: OrderResponse

3. **GET /api/orders/number/{orderNumber}**
   - Lấy chi tiết đơn hàng theo mã đơn hàng
   - Response: OrderResponse

4. **GET /api/orders/user**
   - Lấy danh sách đơn hàng của user
   - Params: `userId`
   - Response: List<OrderResponse>

5. **GET /api/orders/all**
   - Lấy tất cả đơn hàng (admin)
   - Response: List<OrderResponse>

6. **PUT /api/orders/{id}/status**
   - Cập nhật trạng thái đơn hàng
   - Body: { "status": "CONFIRMED" }
   - Response: OrderResponse

## Frontend Pages

### 1. CheckoutPage (`/checkout`)
**Chức năng:**
- Form nhập thông tin khách hàng
- Form địa chỉ giao hàng
- Chọn phương thức thanh toán
- Hiển thị tóm tắt đơn hàng
- Xử lý đặt hàng

**Validation:**
- Họ tên: bắt buộc
- Email: bắt buộc, định dạng email
- Số điện thoại: bắt buộc
- Địa chỉ: bắt buộc
- Tỉnh/Thành phố: bắt buộc

**Flow:**
1. User điền form thông tin
2. Chọn phương thức thanh toán
3. Click "Đặt hàng"
4. Gọi API checkout
5. Xóa giỏ hàng
6. Redirect đến trang thành công

### 2. OrderSuccessPage (`/order-success/:orderNumber`)
**Chức năng:**
- Hiển thị thông báo đặt hàng thành công
- Chi tiết đơn hàng đầy đủ
- Thông tin khách hàng
- Danh sách dịch vụ đã đặt
- Timeline các bước tiếp theo
- Thông tin hỗ trợ

**Sections:**
- Success message với mã đơn hàng
- Chi tiết đơn hàng (trạng thái, thanh toán)
- Thông tin khách hàng
- Dịch vụ đã đặt
- Tổng tiền
- Timeline quy trình
- Hotline hỗ trợ

### 3. MyOrdersPage (`/my-orders`)
**Chức năng:**
- Danh sách đơn hàng của user
- Lọc theo trạng thái
- Xem chi tiết đơn hàng
- Theo dõi trạng thái

**Table Columns:**
- Mã đơn hàng
- Ngày đặt
- Dịch vụ (hiển thị 2 dịch vụ đầu)
- Tổng tiền
- Trạng thái (với màu sắc)
- Hành động (xem chi tiết)

## Phương thức thanh toán

### 1. COD (Cash on Delivery)
- Thanh toán khi nhận hàng
- Mặc định
- Phù hợp với dịch vụ y tế

### 2. Chuyển khoản ngân hàng
- Chuyển khoản trực tiếp
- Cần xác nhận từ admin

### 3. Ví MoMo
- Thanh toán qua ví điện tử
- Tích hợp sau

## Trạng thái đơn hàng

1. **PENDING** (Chờ xác nhận)
   - Đơn hàng mới tạo
   - Chờ admin xác nhận

2. **CONFIRMED** (Đã xác nhận)
   - Admin đã xác nhận đơn hàng
   - Chuẩn bị xử lý

3. **PROCESSING** (Đang xử lý)
   - Đang chuẩn bị dịch vụ
   - Sắp xếp lịch hẹn

4. **COMPLETED** (Hoàn thành)
   - Dịch vụ đã hoàn thành
   - Tự động đánh dấu đã thanh toán nếu COD

5. **CANCELLED** (Đã hủy)
   - Đơn hàng bị hủy
   - Ghi nhận thời gian hủy

## Quy trình đặt dịch vụ

```
1. User thêm dịch vụ vào giỏ hàng
   ↓
2. Vào trang giỏ hàng, xem lại
   ↓
3. Click "Thanh toán" → Chuyển đến /checkout
   ↓
4. Điền thông tin khách hàng và địa chỉ
   ↓
5. Chọn phương thức thanh toán
   ↓
6. Click "Đặt hàng"
   ↓
7. Backend tạo đơn hàng, xóa giỏ hàng
   ↓
8. Redirect đến /order-success/:orderNumber
   ↓
9. Hiển thị thông tin đơn hàng và hướng dẫn tiếp theo
```

## Tính năng đặc biệt

### 1. Auto-clear Cart
- Sau khi đặt hàng thành công, giỏ hàng tự động xóa
- Đảm bảo không bị trùng lặp

### 2. Order Number Generation
- Format: ORD + timestamp + random
- Ví dụ: ORD202602070145301234
- Unique và dễ tra cứu

### 3. Service Snapshot
- Lưu thông tin dịch vụ tại thời điểm đặt hàng
- Bao gồm: tên, ảnh, slug, giá
- Đảm bảo dữ liệu không thay đổi

### 4. Free Shipping
- Miễn phí vận chuyển cho tất cả đơn hàng
- Phù hợp với dịch vụ y tế

### 5. Responsive Design
- Tối ưu cho mobile
- Form dễ điền trên điện thoại

## Routes đã thêm

```javascript
// Public routes
<Route path="/checkout" element={<CheckoutPage />} />
<Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />

// Protected routes (cần đăng nhập)
<Route 
  path="/my-orders" 
  element={isAuthenticated ? <MyOrdersPage /> : <Navigate to="/login" />} 
/>
```

## Header Updates

Thêm menu item "Đơn hàng của tôi" vào user dropdown:
- Hiển thị khi user đã đăng nhập
- Link đến `/my-orders`

## Cách sử dụng

### 1. Chạy migration database
```bash
run_create_orders_tables.bat
```

### 2. Restart backend
Backend sẽ tự động load các entity mới

### 3. Test flow
1. Thêm dịch vụ vào giỏ hàng
2. Vào giỏ hàng
3. Click "Thanh toán"
4. Điền form
5. Đặt hàng
6. Xem trang success
7. Vào "Đơn hàng của tôi" để xem lịch sử

## Tính năng cần thêm (tùy chọn)

### Admin Order Management
- Thêm tab "Đơn hàng" vào AdminCMSPage
- Quản lý tất cả đơn hàng
- Cập nhật trạng thái
- Xem chi tiết
- Thống kê doanh thu

### Email Notifications
- Gửi email xác nhận đơn hàng
- Thông báo thay đổi trạng thái
- Nhắc nhở lịch hẹn

### Payment Gateway Integration
- Tích hợp VNPay
- Tích hợp MoMo
- Tích hợp ZaloPay

### Order Tracking
- Theo dõi trạng thái real-time
- Timeline chi tiết
- Thông báo push

## Files đã tạo

### Backend
- `backend/src/main/java/com/doctorappointment/model/Order.java`
- `backend/src/main/java/com/doctorappointment/model/OrderItem.java`
- `backend/src/main/java/com/doctorappointment/dto/CheckoutRequest.java`
- `backend/src/main/java/com/doctorappointment/dto/OrderResponse.java`
- `backend/src/main/java/com/doctorappointment/dto/OrderItemResponse.java`
- `backend/src/main/java/com/doctorappointment/repository/OrderRepository.java`
- `backend/src/main/java/com/doctorappointment/repository/OrderItemRepository.java`
- `backend/src/main/java/com/doctorappointment/service/OrderService.java`
- `backend/src/main/java/com/doctorappointment/controller/OrderController.java`

### Frontend
- `frontend/src/pages/CheckoutPage.js`
- `frontend/src/pages/OrderSuccessPage.js`
- `frontend/src/pages/MyOrdersPage.js`
- `frontend/src/styles/checkout.css`
- `frontend/src/styles/order.css`

### Database
- `database/create_orders_tables.sql`
- `run_create_orders_tables.bat`

### Updated Files
- `frontend/src/App.js` - Added routes
- `frontend/src/pages/CartPage.js` - Updated checkout button
- `frontend/src/components/Header.js` - Added "My Orders" menu item

## Lưu ý quan trọng

1. **Logic web khám bệnh**: Đây là hệ thống đặt dịch vụ y tế, không phải mua hàng thông thường
2. **Không có shipping thực tế**: Dịch vụ y tế được thực hiện tại cơ sở
3. **COD phù hợp nhất**: Thanh toán khi đến khám
4. **Cần xác nhận**: Admin cần xác nhận và sắp xếp lịch hẹn
5. **Follow-up**: Cần liên hệ khách hàng để xác nhận thời gian

## Hoàn thành ✅

Hệ thống thanh toán đã hoàn thành với đầy đủ chức năng:
- ✅ Database schema
- ✅ Backend API
- ✅ Checkout page
- ✅ Order success page
- ✅ My orders page
- ✅ Cart integration
- ✅ Header menu
- ✅ Responsive design
- ✅ Form validation
- ✅ Error handling
