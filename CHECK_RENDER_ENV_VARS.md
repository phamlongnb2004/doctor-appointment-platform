# ✅ Kiểm Tra Environment Variables Trên Render

## 🔍 QUAN TRỌNG: Phải Set Environment Variable

Sau khi deploy, bạn **BẮT BUỘC** phải kiểm tra và set environment variable `APP_BASE_URL` trên Render.

## 📋 CÁCH KIỂM TRA

### Bước 1: Truy Cập Render Dashboard
1. Mở: https://dashboard.render.com
2. Đăng nhập với tài khoản của bạn
3. Chọn service: **doctor-appointment-backend-mq2p**

### Bước 2: Kiểm Tra Environment Variables
1. Click vào tab **Environment** (bên trái)
2. Tìm các biến sau:

#### Biến Đã Có (Kiểm tra)
```
SPRING_DATASOURCE_URL=jdbc:mysql://gondola.proxy.rlwy.net:43703/railway?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&useUnicode=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=<your-password>
SPRING_PROFILES_ACTIVE=prod
```

#### Biến Cần Thêm (Nếu chưa có)
```
APP_BASE_URL=https://doctor-appointment-backend-mq2p.onrender.com
```

### Bước 3: Thêm APP_BASE_URL (Nếu Chưa Có)
1. Click nút **Add Environment Variable**
2. Key: `APP_BASE_URL`
3. Value: `https://doctor-appointment-backend-mq2p.onrender.com`
4. Click **Save Changes**

**LƯU Ý:** Render sẽ tự động restart service sau khi save.

## 🔍 KIỂM TRA DEPLOYMENT

### Xem Logs
1. Vào tab **Logs** trên Render Dashboard
2. Theo dõi quá trình build và deploy
3. Chờ đến khi thấy:
   ```
   ==> Starting service with 'java -Dserver.port=$PORT $JAVA_OPTS -jar target/*.jar'
   ...
   Started DoctorAppointmentPlatformApplication in X.XXX seconds
   ```

### Kiểm Tra Config Đã Load
Trong logs, tìm các dòng:
```
app.upload.path=/tmp/uploads
app.base-url=https://doctor-appointment-backend-mq2p.onrender.com
```

Nếu thấy → ✅ Config đã load đúng
Nếu không thấy hoặc thấy `localhost` → ❌ Chưa set environment variable

## 🧪 TEST SAU KHI DEPLOY

### Test 1: API Health Check
Mở browser hoặc dùng curl:
```
https://doctor-appointment-backend-mq2p.onrender.com/api/test
```

Kết quả mong đợi: `Backend is running!`

### Test 2: Truy Cập Frontend Từ Desktop
```
https://doctor-appointment-frontend-ujug.onrender.com
```

Kiểm tra:
- ✅ Trang load được
- ✅ Không có lỗi trong Console (F12)
- ✅ Hình ảnh hiển thị (nếu có data)

### Test 3: Truy Cập Từ Mobile (QUAN TRỌNG)
1. Mở điện thoại
2. Truy cập: `https://doctor-appointment-frontend-ujug.onrender.com`
3. Kiểm tra:
   - ✅ Logo/icons hiển thị
   - ✅ Banner images hiển thị
   - ✅ Không có broken images

### Test 4: Upload Image (Nếu Có Tài Khoản)
1. Đăng nhập với tài khoản doctor
2. Vào profile
3. Thử upload profile image
4. Kiểm tra xem image có hiển thị ngay không

## ⚠️ NẾU IMAGES VẪN KHÔNG HIỂN THỊ

### Kiểm Tra 1: Environment Variable
Xem logs, tìm dòng:
```
app.base-url=...
```

- Nếu thấy `localhost` → Chưa set `APP_BASE_URL`
- Nếu thấy production URL → OK

### Kiểm Tra 2: Image URLs
Mở Developer Console (F12) → Network tab:
- Xem URL của images
- Nếu URL là `localhost` → Frontend chưa dùng đúng `REACT_APP_API_URL`
- Nếu URL là production nhưng 404 → Backend chưa tìm thấy file

### Kiểm Tra 3: Logs Khi Load Image
Trong Render logs, khi load image sẽ thấy:
```
=== getProfileImage called ===
userId: 13, fileName: abc123.jpg
Looking for file at: /tmp/uploads/profiles/13/abc123.jpg
File exists: true/false
```

- Nếu `File exists: false` → File chưa được upload hoặc đã mất (ephemeral filesystem)
- Nếu `File exists: true` → OK, file có thể serve được

## 📊 TIMELINE DEPLOYMENT

### Sau Khi Push Code
1. **0-2 phút:** Render detect changes và bắt đầu build
2. **2-5 phút:** Maven build backend
3. **5-7 phút:** Deploy và start service
4. **7-8 phút:** Service ready, có thể test

**Tổng thời gian:** Khoảng 8-10 phút

## 🎯 CHECKLIST

- [ ] Code đã push lên GitHub ✅ (Đã xong)
- [ ] Render đã detect và bắt đầu build
- [ ] Kiểm tra `APP_BASE_URL` environment variable
- [ ] Xem logs không có lỗi
- [ ] Test API health check
- [ ] Test frontend từ desktop
- [ ] Test frontend từ mobile
- [ ] Test upload image (nếu có tài khoản)

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Xem logs trên Render Dashboard
2. Xem Browser Console (F12)
3. Xem Network tab để check image URLs
4. Đọc file `FIX_IMAGES_MISSING_ON_MOBILE_PRODUCTION.md`

---

**Trạng thái hiện tại:** ✅ Code đã push, ⏳ Đang chờ Render deploy
**Thời gian ước tính:** 8-10 phút
