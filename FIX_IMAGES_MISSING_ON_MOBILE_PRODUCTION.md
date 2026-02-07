# ✅ Sửa Lỗi Mất Hình Ảnh Trên Mobile/Production

## 🔴 VẤN ĐỀ
Khi truy cập từ điện thoại hoặc production, **TẤT CẢ hình ảnh/icon đều mất**.

### Nguyên Nhân
Backend có **hardcoded đường dẫn Windows tuyệt đối** trong code:
```java
// ❌ SAI - Chỉ hoạt động trên máy local Windows
String filePath = "D:/DoAn/doctor-appointment-platform/uploads/...";
```

Đường dẫn này:
- ✅ Hoạt động trên máy local Windows
- ❌ KHÔNG hoạt động trên production (Render Linux)
- ❌ KHÔNG hoạt động khi deploy lên bất kỳ server nào khác

## ✅ GIẢI PHÁP ĐÃ THỰC HIỆN

### 1. Sửa `ImageService.java`
Thay thế TẤT CẢ hardcoded paths bằng biến `uploadPath`:

**Trước:**
```java
String folderPath = "D:/DoAn/doctor-appointment-platform/uploads/articles";
Path uploadDir = Paths.get(folderPath).toAbsolutePath().normalize();
```

**Sau:**
```java
Path uploadDir = Paths.get(uploadPath, "articles").toAbsolutePath().normalize();
```

**Các method đã sửa:**
- ✅ `uploadArticleImage()` - Upload hình article
- ✅ `uploadImage()` - Upload profile/cover images
- ✅ `saveBase64Image()` - Save base64 images
- ✅ `deleteImage()` - Delete images
- ✅ `getImage()` - Get image bytes

### 2. Sửa `ImageController.java`
Thêm `@Value` annotation và sử dụng `uploadPath`:

**Thêm vào class:**
```java
@Value("${app.upload.path:uploads}")
private String uploadPath;
```

**Các method đã sửa:**
- ✅ `getProfileImage()` - Serve profile images
- ✅ `getCoverImage()` - Serve cover images
- ✅ `getArticleImage()` - Serve article images

**Trước:**
```java
String filePath = "D:/DoAn/doctor-appointment-platform/uploads/profiles/" + userId + "/" + fileName;
java.io.File file = new java.io.File(filePath);
```

**Sau:**
```java
java.nio.file.Path filePath = java.nio.file.Paths.get(uploadPath, "profiles", userId.toString(), fileName);
java.io.File file = filePath.toFile();
```

### 3. Cập nhật `application-prod.yml`
Set default value cho `APP_BASE_URL`:

```yaml
app:
  upload:
    path: /tmp/uploads
  base-url: ${APP_BASE_URL:https://doctor-appointment-backend-mq2p.onrender.com}
```

## 📋 CẤU HÌNH THEO MÔI TRƯỜNG

### Local Development (`application.yml`)
```yaml
app:
  upload:
    path: D:/DoAn/doctor-appointment-platform/uploads
  base-url: http://localhost:8080
```

### Production (`application-prod.yml`)
```yaml
app:
  upload:
    path: /tmp/uploads
  base-url: ${APP_BASE_URL:https://doctor-appointment-backend-mq2p.onrender.com}
```

## ⚠️ LƯU Ý QUAN TRỌNG VỀ RENDER

### Vấn Đề: Ephemeral Filesystem
Render sử dụng **ephemeral filesystem** - nghĩa là:
- ✅ Upload được file khi app đang chạy
- ❌ File sẽ **MẤT** khi app restart/redeploy
- ❌ File không được lưu vĩnh viễn

### Giải Pháp Dài Hạn

#### Option 1: Cloud Storage (KHUYẾN NGHỊ) ⭐
Sử dụng dịch vụ lưu trữ cloud:
- **AWS S3** - Phổ biến nhất, có free tier
- **Cloudinary** - Chuyên cho images, có free tier
- **Google Cloud Storage** - Tốt, có free tier
- **Azure Blob Storage** - Tốt cho enterprise

**Ưu điểm:**
- ✅ Lưu trữ vĩnh viễn
- ✅ CDN tích hợp (load nhanh)
- ✅ Không mất khi restart
- ✅ Scalable

#### Option 2: Render Persistent Disk (TRẢ PHÍ)
Render cung cấp persistent disk:
- 💰 Tính phí theo GB/tháng
- ✅ Lưu trữ vĩnh viễn
- ✅ Không mất khi restart

#### Option 3: Giải Pháp Tạm Thời
Nếu chỉ test:
1. Upload hình vào database (base64) - KHÔNG khuyến nghị cho production
2. Sử dụng external image hosting (Imgur, etc.)
3. Copy file uploads lên server sau mỗi lần deploy

## 🚀 TRIỂN KHAI LÊN PRODUCTION

### Bước 1: Set Environment Variables trên Render
Vào Render Dashboard → Backend Service → Environment:

```bash
APP_BASE_URL=https://doctor-appointment-backend-mq2p.onrender.com
SPRING_PROFILES_ACTIVE=prod
```

### Bước 2: Deploy Code Mới
```bash
cd backend
git add .
git commit -m "Fix: Remove hardcoded Windows paths for image uploads"
git push
```

Render sẽ tự động deploy.

### Bước 3: Test
1. Truy cập từ điện thoại: https://doctor-appointment-frontend-ujug.onrender.com
2. Kiểm tra xem hình ảnh có hiển thị không
3. Thử upload hình mới
4. Kiểm tra lại

## 🔍 KIỂM TRA SAU KHI SỬA

### Test Local
```bash
cd backend
mvn clean package
java -jar target/*.jar
```

Kiểm tra:
- ✅ Upload profile image
- ✅ Upload cover image
- ✅ Upload article image
- ✅ View images

### Test Production
1. Deploy lên Render
2. Truy cập từ mobile
3. Kiểm tra console logs trên Render
4. Test upload và view images

## 📊 TỔNG KẾT

### Files Đã Sửa
1. ✅ `backend/src/main/java/com/doctorappointment/service/ImageService.java`
   - Loại bỏ 5 chỗ hardcoded paths
   - Sử dụng `uploadPath` variable

2. ✅ `backend/src/main/java/com/doctorappointment/controller/ImageController.java`
   - Thêm `@Value` annotation
   - Loại bỏ 3 chỗ hardcoded paths
   - Sử dụng `uploadPath` variable

3. ✅ `backend/src/main/resources/application-prod.yml`
   - Thêm default value cho `APP_BASE_URL`

### Kết Quả
- ✅ Code giờ hoạt động trên cả Windows và Linux
- ✅ Có thể deploy lên bất kỳ server nào
- ✅ Cấu hình linh hoạt qua environment variables
- ⚠️ Cần giải pháp lưu trữ vĩnh viễn cho production (S3/Cloudinary)

## 🎯 BƯỚC TIẾP THEO

### Ngắn Hạn (Test)
1. Deploy code mới lên Render
2. Test từ mobile
3. Xác nhận hình ảnh hiển thị

### Dài Hạn (Production)
1. Chọn cloud storage provider (khuyến nghị Cloudinary cho images)
2. Tạo account và lấy credentials
3. Tích hợp vào code
4. Migrate existing images lên cloud
5. Update database URLs

---

**Ngày tạo:** 2026-02-08  
**Trạng thái:** ✅ Code đã sửa, chờ deploy và test
