# Cart Merge & Login Requirement - HOÀN THÀNH ✅

## Tổng quan
Đã hoàn thành tính năng:
1. **Bắt buộc đăng nhập** trước khi thanh toán
2. **Merge giỏ hàng** từ localStorage vào database khi đăng nhập
3. **Redirect** về trang checkout sau khi đăng nhập

## Các thay đổi đã thực hiện

### 1. Backend - Cart Merge Endpoint

#### `CartService.java`
- Thêm method `mergeCart(userId, sessionId)`:
  - Lấy giỏ hàng session (guest cart)
  - Lấy hoặc tạo giỏ hàng user
  - Merge items từ session cart vào user cart
  - Nếu item đã tồn tại → cộng dồn số lượng
  - Nếu item chưa có → thêm mới
  - Xóa session cart sau khi merge
  - Trả về giỏ hàng đã merge

#### `CartController.java`
- Thêm endpoint `POST /cart/merge`:
  ```java
  @PostMapping("/merge")
  public ResponseEntity<CartResponse> mergeCart(
      @RequestParam Long userId,
      @RequestParam String sessionId)
  ```

### 2. Frontend - Cart Context

#### `CartContext.js`
- Thêm function `mergeCart(userId)`:
  - Lấy sessionId từ localStorage
  - Gọi API `/cart/merge` với userId và sessionId
  - Cập nhật cart state với dữ liệu đã merge
  - Xóa sessionId khỏi localStorage sau khi merge
  - Fallback: nếu merge lỗi, fetch user cart bình thường
- Export `mergeCart` trong context value

### 3. Frontend - Login Page

#### `LoginPage.js`
- Import `useCart` hook
- Gọi `mergeCart(userData.id)` sau khi login thành công
- Xử lý redirect:
  - Kiểm tra `redirect_after_login` trong localStorage
  - Nếu có → redirect về path đó (ví dụ: `/checkout`)
  - Nếu không → redirect về home hoặc admin dashboard
  - Xóa `redirect_after_login` sau khi redirect

### 4. Frontend - Checkout Page

#### `CheckoutPage.js` (đã có sẵn)
- useEffect kiểm tra login:
  - Nếu chưa login → hiển thị warning
  - Lưu path hiện tại vào `redirect_after_login`
  - Redirect về `/login`

## Luồng hoạt động

### Scenario 1: Guest thêm sản phẩm → Checkout → Login
1. Guest thêm sản phẩm vào giỏ (lưu với sessionId)
2. Guest click "Thanh toán"
3. CheckoutPage kiểm tra → chưa login
4. Lưu `redirect_after_login = '/checkout'`
5. Redirect về `/login`
6. User đăng nhập thành công
7. **Merge cart**: items từ sessionId → userId
8. Xóa sessionId khỏi localStorage
9. Redirect về `/checkout`
10. User thấy giỏ hàng đã có sản phẩm từ trước khi login

### Scenario 2: User đã login thêm sản phẩm → Checkout
1. User đã login thêm sản phẩm (lưu với userId)
2. User click "Thanh toán"
3. CheckoutPage kiểm tra → đã login
4. Hiển thị form checkout bình thường

### Scenario 3: Guest thêm sản phẩm → Login từ menu
1. Guest thêm sản phẩm vào giỏ (lưu với sessionId)
2. Guest click "Đăng nhập" từ menu
3. User đăng nhập thành công
4. **Merge cart**: items từ sessionId → userId
5. Redirect về home (không có redirect_after_login)
6. User vào giỏ hàng → thấy sản phẩm đã merge

## API Endpoints

### POST /api/cart/merge
**Request:**
```
POST /api/cart/merge?userId=123&sessionId=session_abc123
```

**Response:**
```json
{
  "id": 456,
  "items": [
    {
      "id": 789,
      "serviceId": 1,
      "serviceTitle": "Khám tổng quát",
      "quantity": 2,
      "price": 500000,
      "subtotal": 1000000
    }
  ],
  "totalItems": 2,
  "totalAmount": 1000000
}
```

## Testing

### Test Case 1: Merge cart khi login
1. Logout (nếu đang login)
2. Thêm 2-3 sản phẩm vào giỏ hàng
3. Click "Thanh toán"
4. Đăng nhập
5. ✅ Kiểm tra: redirect về checkout
6. ✅ Kiểm tra: giỏ hàng vẫn có sản phẩm
7. ✅ Kiểm tra: localStorage không còn `cart_session_id`

### Test Case 2: Merge cart với giỏ hàng đã có
1. Login với tài khoản có sẵn giỏ hàng
2. Logout
3. Thêm sản phẩm khác vào giỏ
4. Login lại
5. ✅ Kiểm tra: giỏ hàng có cả sản phẩm cũ và mới
6. ✅ Kiểm tra: số lượng được cộng dồn nếu trùng sản phẩm

### Test Case 3: Checkout yêu cầu login
1. Logout
2. Thêm sản phẩm vào giỏ
3. Click "Thanh toán"
4. ✅ Kiểm tra: hiển thị message "Vui lòng đăng nhập"
5. ✅ Kiểm tra: redirect về /login
6. ✅ Kiểm tra: localStorage có `redirect_after_login = '/checkout'`

## Files đã thay đổi

### Backend
- `backend/src/main/java/com/doctorappointment/service/CartService.java`
- `backend/src/main/java/com/doctorappointment/controller/CartController.java`

### Frontend
- `frontend/src/contexts/CartContext.js`
- `frontend/src/pages/LoginPage.js`
- `frontend/src/pages/CheckoutPage.js` (đã có sẵn)

## Deployment

### Backend
```bash
cd backend
mvn clean package
# Deploy to Render
```

### Frontend
```bash
cd frontend
npm run build
# Deploy to Render
```

## Notes
- Session cart được tự động xóa sau khi merge
- Nếu không có session cart, merge vẫn hoạt động bình thường
- Nếu merge lỗi, user vẫn có thể sử dụng giỏ hàng của mình
- Redirect chỉ hoạt động khi có `redirect_after_login` trong localStorage

## Status: ✅ HOÀN THÀNH
- ✅ Backend merge endpoint
- ✅ Frontend merge function
- ✅ Login integration
- ✅ Checkout login requirement
- ✅ Redirect after login
- ✅ No syntax errors
