# 🔍 Debug: Hình Ảnh Không Hiển Thị Trên Mobile

## ❌ VẤN ĐỀ
Bạn đã upload ảnh profile từ điện thoại nhưng không hiển thị.

## 🔍 NGUYÊN NHÂN CÓ THỂ

### 1. Ephemeral Filesystem (Khả năng cao nhất)
Render sử dụng ephemeral filesystem:
- ✅ Upload thành công → File lưu vào `/tmp/uploads`
- ❌ Render restart → File **BỊ XÓA**
- ❌ Khi load lại trang → File không tồn tại → Không hiển thị

**Cách kiểm tra:**
- Xem Render logs có dòng: `File exists: false`

### 2. URL Không Đúng
Frontend có thể đang dùng localhost URL thay vì production URL.

**Cách kiểm tra:**
- Mở Developer Console trên điện thoại
- Xem Network tab
- Tìm request load ảnh profile
- Xem URL có phải production không

### 3. CORS Issue
Backend chặn request từ mobile.

**Cách kiểm tra:**
- Xem Console có lỗi CORS không

## 🧪 CÁCH KIỂM TRA

### Bước 1: Kiểm Tra URL Trong Database
Truy cập Railway MySQL:
```sql
SELECT id, email, profileImage, coverImage 
FROM users 
WHERE id = <your-user-id>;
```

Xem URL có đúng format không:
```
https://doctor-appointment-backend-mq2p.onrender.com/api/images/profiles/13/abc123.jpg
```

### Bước 2: Kiểm Tra File Trên Server
Xem Render logs khi load ảnh:
```
=== getProfileImage called ===
userId: 13, fileName: abc123.jpg
Looking for file at: /tmp/uploads/profiles/13/abc123.jpg
File exists: false  <-- NẾU FALSE = FILE ĐÃ MẤT
```

### Bước 3: Test Upload Lại
1. Upload ảnh mới từ mobile
2. **NGAY LẬP TỨC** refresh trang (không đợi)
3. Xem ảnh có hiển thị không

**Nếu hiển thị ngay sau upload nhưng mất sau khi refresh:**
→ Xác nhận là do ephemeral filesystem

### Bước 4: Kiểm Tra Developer Console Trên Mobile

#### Trên Android Chrome:
1. Mở Chrome trên máy tính
2. Vào `chrome://inspect`
3. Kết nối điện thoại qua USB
4. Chọn tab của website
5. Xem Console và Network

#### Trên iOS Safari:
1. Mở Safari trên Mac
2. Vào Develop → [Tên iPhone] → [Tab website]
3. Xem Console và Network

**Tìm:**
- URL của ảnh profile
- Lỗi 404 Not Found
- Lỗi CORS

## ✅ GIẢI PHÁP

### Giải Pháp Tạm Thời (Test)
**Chấp nhận rằng ảnh sẽ mất khi Render restart.**

Để test:
1. Upload ảnh
2. Test ngay (không đợi restart)
3. Xác nhận upload và display hoạt động

### Giải Pháp Vĩnh Viễn (Production)

#### Option 1: Cloudinary (KHUYẾN NGHỊ) ⭐
Dịch vụ lưu trữ ảnh miễn phí với CDN.

**Ưu điểm:**
- ✅ Free tier: 25GB storage, 25GB bandwidth/tháng
- ✅ CDN toàn cầu (load nhanh)
- ✅ Tự động resize, optimize ảnh
- ✅ Không mất khi restart
- ✅ Dễ tích hợp

**Cách setup:**
1. Đăng ký: https://cloudinary.com
2. Lấy credentials: Cloud name, API key, API secret
3. Thêm dependency vào `pom.xml`:
```xml
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-http44</artifactId>
    <version>1.36.0</version>
</dependency>
```

4. Tạo `CloudinaryService.java`:
```java
@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;
    
    public CloudinaryService(
        @Value("${cloudinary.cloud-name}") String cloudName,
        @Value("${cloudinary.api-key}") String apiKey,
        @Value("${cloudinary.api-secret}") String apiSecret
    ) {
        cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKey,
            "api_secret", apiSecret
        ));
    }
    
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(
            file.getBytes(),
            ObjectUtils.asMap("folder", folder)
        );
        return (String) uploadResult.get("secure_url");
    }
}
```

5. Update `ImageService.java` để dùng Cloudinary thay vì local filesystem

6. Set environment variables trên Render:
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Option 2: AWS S3
Tương tự Cloudinary nhưng phức tạp hơn.

#### Option 3: Render Persistent Disk (TRẢ PHÍ)
- Tính phí: $0.25/GB/tháng
- Minimum: 1GB = $0.25/tháng

## 🔧 QUICK FIX: Kiểm Tra Ngay

### Test 1: Upload và Xem Ngay
```bash
# 1. Upload ảnh từ mobile
# 2. Mở Render logs ngay lập tức
# 3. Tìm dòng:
Looking for file at: /tmp/uploads/profiles/13/abc123.jpg
File exists: true/false
```

### Test 2: Kiểm Tra URL
Mở browser trên mobile, paste URL ảnh trực tiếp:
```
https://doctor-appointment-backend-mq2p.onrender.com/api/images/profiles/13/abc123.jpg
```

**Kết quả:**
- Hiển thị ảnh → Backend OK, vấn đề ở frontend
- 404 Not Found → File đã mất (ephemeral filesystem)
- CORS error → Cần fix CORS

## 📊 DECISION TREE

```
Upload ảnh từ mobile
    ↓
Ảnh có hiển thị ngay sau upload?
    ├─ YES → Refresh trang
    │         ↓
    │     Ảnh vẫn hiển thị?
    │         ├─ YES → ✅ OK, không có vấn đề
    │         └─ NO → ❌ Ephemeral filesystem
    │                   → Cần dùng Cloudinary/S3
    │
    └─ NO → Kiểm tra Console
              ↓
          Có lỗi gì?
              ├─ 404 → File không tồn tại
              ├─ CORS → Fix CORS config
              ├─ URL localhost → Fix frontend API_URL
              └─ Không có lỗi → Kiểm tra CSS/HTML
```

## 🎯 HÀNH ĐỘNG TIẾP THEO

### Ngay Lập Tức
1. **Upload ảnh mới từ mobile**
2. **Xem Render logs ngay** (tab Logs)
3. **Tìm dòng "File exists: true/false"**
4. **Báo lại kết quả**

### Nếu File Exists = False
→ Xác nhận là ephemeral filesystem
→ Cần tích hợp Cloudinary (tôi sẽ giúp bạn)

### Nếu File Exists = True nhưng vẫn không hiển thị
→ Vấn đề ở frontend hoặc CORS
→ Kiểm tra Developer Console trên mobile

## 📞 CẦN HỖ TRỢ

Hãy cho tôi biết:
1. **Sau khi upload, ảnh có hiển thị ngay không?**
2. **Sau khi refresh, ảnh có mất không?**
3. **Render logs có dòng "File exists: true" hay "false"?**
4. **URL của ảnh trong database là gì?** (SELECT profileImage FROM users WHERE id=...)

Với thông tin này, tôi sẽ biết chính xác vấn đề và giải pháp.

---

**Dự đoán:** 99% là do ephemeral filesystem. Giải pháp: Tích hợp Cloudinary (miễn phí, dễ setup).
