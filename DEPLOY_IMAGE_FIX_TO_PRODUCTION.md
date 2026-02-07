# 🚀 Hướng Dẫn Deploy Fix Hình Ảnh Lên Production

## 📋 CHUẨN BỊ

### Đã Hoàn Thành
- ✅ Sửa `ImageService.java` - loại bỏ hardcoded paths
- ✅ Sửa `ImageController.java` - loại bỏ hardcoded paths  
- ✅ Cập nhật `application-prod.yml` - thêm default base URL
- ✅ Test compile thành công

### Cần Làm
1. Set environment variables trên Render
2. Deploy code mới
3. Test từ mobile

## 🔧 BƯỚC 1: CẤU HÌNH RENDER

### Truy cập Render Dashboard
1. Đăng nhập: https://dashboard.render.com
2. Chọn service: **doctor-appointment-backend-mq2p**
3. Vào tab **Environment**

### Thêm/Kiểm tra Environment Variables

Đảm bảo có các biến sau:

```bash
# Database (đã có)
SPRING_DATASOURCE_URL=jdbc:mysql://gondola.proxy.rlwy.net:43703/railway?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&useUnicode=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=<your-password>

# Profile (đã có)
SPRING_PROFILES_ACTIVE=prod

# Base URL (THÊM MỚI hoặc kiểm tra)
APP_BASE_URL=https://doctor-appointment-backend-mq2p.onrender.com
```

**Lưu ý:** Nếu `APP_BASE_URL` chưa có, thêm vào. Nếu đã có, kiểm tra giá trị đúng.

### Lưu Thay Đổi
Click **Save Changes** - Render sẽ tự động restart service.

## 📦 BƯỚC 2: DEPLOY CODE MỚI

### Option A: Deploy qua Git (Khuyến nghị)

```bash
# 1. Commit changes
git add backend/src/main/java/com/doctorappointment/service/ImageService.java
git add backend/src/main/java/com/doctorappointment/controller/ImageController.java
git add backend/src/main/resources/application-prod.yml
git add FIX_IMAGES_MISSING_ON_MOBILE_PRODUCTION.md
git add DEPLOY_IMAGE_FIX_TO_PRODUCTION.md

git commit -m "Fix: Remove hardcoded Windows paths for production image serving

- Replace all D:/DoAn/... hardcoded paths with configurable uploadPath
- Update ImageService.java to use @Value uploadPath variable
- Update ImageController.java to use @Value uploadPath variable
- Add default APP_BASE_URL in application-prod.yml
- Images now work on both Windows (local) and Linux (production)
- Fixes issue where images were missing on mobile/production"

# 2. Push to repository
git push origin main
```

### Option B: Manual Deploy trên Render
1. Vào Render Dashboard
2. Chọn service **doctor-appointment-backend-mq2p**
3. Click **Manual Deploy** → **Deploy latest commit**

## 🔍 BƯỚC 3: THEO DÕI DEPLOYMENT

### Xem Logs
1. Trên Render Dashboard, vào tab **Logs**
2. Theo dõi quá trình build và deploy
3. Chờ đến khi thấy:
   ```
   Started DoctorAppointmentPlatformApplication
   ```

### Kiểm Tra Build
Đảm bảo không có lỗi:
- ✅ Maven build success
- ✅ Spring Boot started
- ✅ Database connected
- ✅ No errors in logs

## 🧪 BƯỚC 4: TEST

### Test 1: API Health Check
```bash
curl https://doctor-appointment-backend-mq2p.onrender.com/api/test
```

Kết quả mong đợi: `Backend is running!`

### Test 2: Truy Cập Từ Desktop
1. Mở browser: https://doctor-appointment-frontend-ujug.onrender.com
2. Kiểm tra xem hình ảnh có hiển thị không
3. Thử upload hình mới (nếu có tài khoản)

### Test 3: Truy Cập Từ Mobile (QUAN TRỌNG)
1. Mở điện thoại
2. Truy cập: https://doctor-appointment-frontend-ujug.onrender.com
3. Kiểm tra:
   - ✅ Logo/icons hiển thị
   - ✅ Banner images hiển thị
   - ✅ Doctor profile images hiển thị
   - ✅ Article images hiển thị
   - ✅ Service images hiển thị

### Test 4: Upload Image
1. Đăng nhập với tài khoản doctor
2. Thử upload profile image
3. Kiểm tra xem image có hiển thị ngay không

## ⚠️ XỬ LÝ LỖI

### Lỗi: Images vẫn không hiển thị

**Kiểm tra 1: Environment Variables**
```bash
# Xem logs trên Render, tìm dòng:
app.upload.path=/tmp/uploads
app.base-url=https://doctor-appointment-backend-mq2p.onrender.com
```

Nếu không thấy → Environment variables chưa được set đúng.

**Kiểm tra 2: Image URLs**
Mở Developer Console (F12) → Network tab:
- Xem URL của images
- Nếu vẫn thấy `localhost` → Frontend chưa dùng đúng API_URL
- Nếu thấy production URL nhưng 404 → Backend chưa tìm thấy file

**Kiểm tra 3: Upload Path**
Xem logs trên Render khi upload image:
```
Looking for file at: /tmp/uploads/profiles/13/abc123.jpg
File exists: true/false
```

### Lỗi: 500 Internal Server Error khi upload

**Nguyên nhân:** Không có quyền ghi vào `/tmp/uploads`

**Giải pháp:**
1. Kiểm tra logs để xem lỗi cụ thể
2. Có thể cần thay đổi upload path trong `application-prod.yml`

### Lỗi: Images mất sau khi restart

**Nguyên nhân:** Render sử dụng ephemeral filesystem

**Giải pháp tạm thời:**
- Chấp nhận rằng images sẽ mất khi restart
- Chỉ dùng để test

**Giải pháp dài hạn:**
- Tích hợp cloud storage (S3, Cloudinary)
- Xem file `FIX_IMAGES_MISSING_ON_MOBILE_PRODUCTION.md` phần "Giải Pháp Dài Hạn"

## 📊 CHECKLIST HOÀN THÀNH

### Backend
- [x] Sửa `ImageService.java`
- [x] Sửa `ImageController.java`
- [x] Cập nhật `application-prod.yml`
- [x] Test compile thành công
- [ ] Deploy lên Render
- [ ] Kiểm tra logs không có lỗi

### Frontend
- [x] Đã sử dụng `REACT_APP_API_URL` (đã làm trước đó)
- [ ] Test trên desktop
- [ ] Test trên mobile

### Testing
- [ ] API health check OK
- [ ] Images hiển thị trên desktop
- [ ] Images hiển thị trên mobile
- [ ] Upload image thành công
- [ ] View uploaded image thành công

## 🎯 KẾT QUẢ MONG ĐỢI

Sau khi hoàn thành:
- ✅ Hình ảnh hiển thị trên cả desktop và mobile
- ✅ Upload image hoạt động
- ✅ Code có thể deploy lên bất kỳ server nào (không còn phụ thuộc Windows)
- ⚠️ Images sẽ mất khi Render restart (cần cloud storage cho production thực sự)

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Kiểm tra logs trên Render Dashboard
2. Kiểm tra Browser Console (F12)
3. Kiểm tra Network tab để xem image URLs
4. Đọc file `FIX_IMAGES_MISSING_ON_MOBILE_PRODUCTION.md` để hiểu rõ hơn

---

**Ngày tạo:** 2026-02-08  
**Trạng thái:** ⏳ Chờ deploy và test
