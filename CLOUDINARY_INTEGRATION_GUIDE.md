# ☁️ Tích Hợp Cloudinary - Giải Pháp Lưu Trữ Ảnh Vĩnh Viễn

## 🎯 TẠI SAO CẦN CLOUDINARY?

### Vấn Đề Hiện Tại
- ❌ Render dùng ephemeral filesystem
- ❌ Upload ảnh → Lưu vào `/tmp/uploads`
- ❌ Render restart → **Ảnh bị xóa hết**
- ❌ User upload ảnh nhưng mất sau vài giờ

### Giải Pháp: Cloudinary
- ✅ **Miễn phí**: 25GB storage, 25GB bandwidth/tháng
- ✅ **Vĩnh viễn**: Ảnh không bao giờ mất
- ✅ **CDN toàn cầu**: Load nhanh từ mọi nơi
- ✅ **Tự động optimize**: Resize, compress ảnh
- ✅ **Dễ tích hợp**: 30 phút setup

## 📋 BƯỚC 1: ĐĂNG KÝ CLOUDINARY

### 1.1. Tạo Account
1. Truy cập: https://cloudinary.com/users/register/free
2. Đăng ký với email (hoặc Google/GitHub)
3. Xác nhận email

### 1.2. Lấy Credentials
1. Đăng nhập: https://cloudinary.com/console
2. Vào **Dashboard**
3. Copy thông tin:
   ```
   Cloud name: your-cloud-name
   API Key: 123456789012345
   API Secret: abcdefghijklmnopqrstuvwxyz
   ```

**LƯU Ý:** Giữ API Secret bí mật!

## 📦 BƯỚC 2: THÊM DEPENDENCY

### 2.1. Update `pom.xml`
Thêm vào `<dependencies>`:

```xml
<!-- Cloudinary -->
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-http44</artifactId>
    <version>1.36.0</version>
</dependency>
```

### 2.2. Reload Maven
```bash
cd backend
mvn clean install
```

## 🔧 BƯỚC 3: TẠO CLOUDINARY SERVICE

### 3.1. Tạo File `CloudinaryService.java`
Tạo file: `backend/src/main/java/com/doctorappointment/service/CloudinaryService.java`

```java
package com.doctorappointment.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret
    ) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
        log.info("Cloudinary initialized with cloud name: {}", cloudName);
    }

    /**
     * Upload image to Cloudinary
     * @param file MultipartFile to upload
     * @param folder Folder name in Cloudinary (e.g., "profiles", "covers", "articles")
     * @return Secure URL of uploaded image
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }

        // Validate file size (max 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size must be less than 10MB");
        }

        try {
            // Generate unique public ID
            String publicId = folder + "/" + UUID.randomUUID().toString();

            // Upload to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "folder", folder,
                            "resource_type", "image",
                            "transformation", ObjectUtils.asMap(
                                    "quality", "auto",
                                    "fetch_format", "auto"
                            )
                    )
            );

            String secureUrl = (String) uploadResult.get("secure_url");
            log.info("Image uploaded successfully to Cloudinary: {}", secureUrl);
            return secureUrl;

        } catch (Exception e) {
            log.error("Error uploading image to Cloudinary", e);
            throw new IOException("Failed to upload image: " + e.getMessage());
        }
    }

    /**
     * Delete image from Cloudinary
     * @param imageUrl Full URL of the image
     * @return true if deleted successfully
     */
    public boolean deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return false;
        }

        try {
            // Extract public ID from URL
            // URL format: https://res.cloudinary.com/cloud-name/image/upload/v123456/folder/filename.jpg
            String publicId = extractPublicId(imageUrl);
            if (publicId == null) {
                return false;
            }

            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            String resultStatus = (String) result.get("result");
            
            log.info("Image deletion result: {}", resultStatus);
            return "ok".equals(resultStatus);

        } catch (Exception e) {
            log.error("Error deleting image from Cloudinary", e);
            return false;
        }
    }

    /**
     * Extract public ID from Cloudinary URL
     */
    private String extractPublicId(String imageUrl) {
        try {
            // URL format: https://res.cloudinary.com/cloud-name/image/upload/v123456/folder/filename.jpg
            String[] parts = imageUrl.split("/upload/");
            if (parts.length < 2) {
                return null;
            }
            
            String afterUpload = parts[1];
            // Remove version (v123456/)
            String withoutVersion = afterUpload.replaceFirst("v\\d+/", "");
            // Remove file extension
            return withoutVersion.replaceFirst("\\.[^.]+$", "");
            
        } catch (Exception e) {
            log.error("Error extracting public ID from URL: {}", imageUrl, e);
            return null;
        }
    }
}
```

### 3.2. Update `ImageService.java`
Thay thế logic upload bằng Cloudinary:

```java
@Service
@RequiredArgsConstructor
public class ImageService {

    private final CloudinaryService cloudinaryService;

    @Value("${app.use-cloudinary:true}")
    private boolean useCloudinary;

    /**
     * Upload profile image for user
     */
    public String uploadProfileImage(Long userId, MultipartFile file) throws IOException {
        if (useCloudinary) {
            return cloudinaryService.uploadImage(file, "profiles");
        } else {
            // Fallback to local storage (for development)
            return uploadImageLocal(userId, file, "profile");
        }
    }

    /**
     * Upload cover image for user
     */
    public String uploadCoverImage(Long userId, MultipartFile file) throws IOException {
        if (useCloudinary) {
            return cloudinaryService.uploadImage(file, "covers");
        } else {
            return uploadImageLocal(userId, file, "cover");
        }
    }

    /**
     * Upload article image
     */
    public String uploadArticleImage(MultipartFile file) throws IOException {
        if (useCloudinary) {
            return cloudinaryService.uploadImage(file, "articles");
        } else {
            return uploadArticleImageLocal(file);
        }
    }

    /**
     * Delete image
     */
    public boolean deleteImage(String imageUrl) {
        if (useCloudinary && imageUrl.contains("cloudinary.com")) {
            return cloudinaryService.deleteImage(imageUrl);
        } else {
            return deleteImageLocal(imageUrl);
        }
    }

    // Keep existing local methods as fallback...
}
```

## ⚙️ BƯỚC 4: CẤU HÌNH

### 4.1. Update `application.yml` (Local)
```yaml
cloudinary:
  cloud-name: your-cloud-name
  api-key: your-api-key
  api-secret: your-api-secret

app:
  use-cloudinary: false  # Use local storage for development
```

### 4.2. Update `application-prod.yml` (Production)
```yaml
cloudinary:
  cloud-name: ${CLOUDINARY_CLOUD_NAME}
  api-key: ${CLOUDINARY_API_KEY}
  api-secret: ${CLOUDINARY_API_SECRET}

app:
  use-cloudinary: true  # Use Cloudinary for production
```

### 4.3. Set Environment Variables trên Render
Vào Render Dashboard → Backend Service → Environment:

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

## 🚀 BƯỚC 5: DEPLOY

### 5.1. Commit Changes
```bash
git add .
git commit -m "feat: Integrate Cloudinary for permanent image storage

- Add Cloudinary dependency
- Create CloudinaryService for image upload/delete
- Update ImageService to use Cloudinary in production
- Add configuration for Cloudinary credentials
- Images now stored permanently, not lost on restart"

git push origin main
```

### 5.2. Verify Deployment
1. Xem Render logs
2. Tìm dòng: `Cloudinary initialized with cloud name: your-cloud-name`
3. Chờ deploy xong

### 5.3. Test
1. Upload ảnh từ mobile
2. Kiểm tra URL ảnh (phải có `cloudinary.com`)
3. Restart Render service
4. Kiểm tra ảnh vẫn hiển thị

## ✅ KẾT QUẢ MONG ĐỢI

### Trước (Local Storage)
```
URL: https://doctor-appointment-backend-mq2p.onrender.com/api/images/profiles/13/abc123.jpg
Vấn đề: File mất khi restart
```

### Sau (Cloudinary)
```
URL: https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/profiles/abc-def-ghi.jpg
Ưu điểm: 
- ✅ Lưu vĩnh viễn
- ✅ CDN toàn cầu
- ✅ Tự động optimize
- ✅ Không mất khi restart
```

## 📊 SO SÁNH

| Feature | Local Storage | Cloudinary |
|---------|--------------|------------|
| Lưu trữ vĩnh viễn | ❌ Mất khi restart | ✅ Vĩnh viễn |
| Tốc độ load | ⚠️ Chậm | ✅ Nhanh (CDN) |
| Optimize ảnh | ❌ Không | ✅ Tự động |
| Chi phí | ✅ Free | ✅ Free (25GB) |
| Setup | ✅ Đơn giản | ⚠️ Cần config |
| Production ready | ❌ Không | ✅ Có |

## 🎯 TIMELINE

- **Đăng ký Cloudinary:** 5 phút
- **Thêm dependency:** 2 phút
- **Tạo CloudinaryService:** 10 phút
- **Update ImageService:** 10 phút
- **Config & deploy:** 5 phút
- **Test:** 3 phút

**Tổng:** ~35 phút

## 📞 HỖ TRỢ

Nếu cần giúp:
1. Tôi có thể tạo code cho bạn
2. Tôi có thể giúp debug
3. Tôi có thể giúp test

Bạn có muốn tôi tích hợp Cloudinary ngay không?

---

**Khuyến nghị:** Làm ngay để fix vấn đề ảnh mất vĩnh viễn! 🚀
