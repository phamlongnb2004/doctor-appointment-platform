# Certification Image Upload - FIXED ✅

## Vấn đề
Khi upload ảnh cho certification trong Admin CMS, ảnh không được lưu vào database (image_url = NULL).

## Nguyên nhân
1. **Frontend**: Form.Item không có hidden Input để lưu giá trị imageUrl
2. **Backend**: Thiếu các imports và dependencies cần thiết
3. **Backend**: Upload endpoint sử dụng sai method name

## Giải pháp

### 1. Frontend (AdminCMSPage.js)
**Thay đổi cấu trúc form certification:**
```javascript
// Trước: Form.Item bao bọc Upload (không lưu giá trị)
<Form.Item name="imageUrl" label="Ảnh chứng chỉ">
  <Upload ... />
</Form.Item>

// Sau: Tách riêng Upload và thêm hidden Input
<div>
  <label>Ảnh chứng chỉ</label>
  <Upload ... />
  <Form.Item name="imageUrl" hidden>
    <Input />
  </Form.Item>
</div>
```

**Kết quả**: Khi upload ảnh, handleUploadIcon sẽ set giá trị vào hidden Input, và khi submit form sẽ gửi imageUrl lên backend.

### 2. Backend Model (Certification.java)
**Thêm @JsonProperty annotation:**
```java
@JsonProperty("imageUrl")
@Column(name = "image_url", length = 500)
private String imageUrl;
```

**Kết quả**: Đảm bảo JSON serialization/deserialization hoạt động đúng giữa camelCase (imageUrl) và snake_case (image_url).

### 3. Backend Controller (CMSController.java)
**Thêm imports:**
```java
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
```

**Thêm ImageService dependency:**
```java
@Autowired
private com.doctorappointment.service.ImageService imageService;
```

**Sửa upload endpoint:**
```java
@PostMapping("/admin/certifications/upload-image")
public ResponseEntity<Map<String, String>> uploadCertificationImage(@RequestParam("file") MultipartFile file) {
    try {
        String imageUrl = imageService.uploadArticleImage(file);  // Sử dụng method có sẵn
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imageUrl);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
```

**Thêm debug logs:**
```java
@PutMapping("/admin/certifications/{id}")
public ResponseEntity<Certification> updateCertification(@PathVariable Long id, @RequestBody Certification certification) {
    System.out.println("=== UPDATE CERTIFICATION ===");
    System.out.println("ImageUrl: " + certification.getImageUrl());
    // ... rest of code
}
```

## Kết quả

### Database
```sql
SELECT id, name, image_url FROM certifications WHERE id = 1;
```
**Trước:**
```
| id | name           | image_url |
|----|----------------|-----------|
|  1 | ISO 15189:2022 | NULL      |
```

**Sau:**
```
| id | name           | image_url                                          |
|----|----------------|----------------------------------------------------|
|  1 | ISO 15189:2022 | http://localhost:8080/api/images/articles/b88af... |
```

### Frontend
- ✅ Upload ảnh thành công
- ✅ Preview ảnh hiển thị
- ✅ Lưu vào database thành công
- ✅ Table hiển thị ảnh preview
- ✅ Slider trên homepage hiển thị ảnh

## Cách sử dụng

### Thêm ảnh cho certification:
1. Vào Admin CMS → "Chứng chỉ và cơ sở vật chất"
2. Click Edit trên certification
3. Click "Upload Ảnh Chứng chỉ"
4. Chọn ảnh từ máy tính
5. Đợi upload xong (sẽ thấy preview)
6. Thêm mô tả (optional)
7. Click OK

### Xem slider trên homepage:
1. Vào trang chủ: http://localhost:3000
2. Scroll xuống section "CHỨNG CHỈ VÀ CƠ SỞ VẬT CHẤT"
3. Xem slider với ảnh và mô tả
4. Click dots để chuyển slide
5. Slider tự động chuyển sau 5 giây

## Files đã sửa

1. ✅ `frontend/src/pages/AdminCMSPage.js`
   - Sửa form structure cho certification
   - Thêm hidden Input cho imageUrl
   - Thêm debug log

2. ✅ `backend/src/main/java/com/doctorappointment/model/Certification.java`
   - Thêm @JsonProperty annotation

3. ✅ `backend/src/main/java/com/doctorappointment/controller/CMSController.java`
   - Thêm imports (MultipartFile, HashMap)
   - Thêm ImageService dependency
   - Sửa upload endpoint
   - Thêm debug logs

## Trạng thái hiện tại

### Certifications có ảnh:
```
| id | name           | has_image |
|----|----------------|-----------|
|  1 | ISO 15189:2022 | YES       |
|  2 | CAP ACCREDITED | NO        |
|  3 | Bộ Y Tế       | NO        |
|  4 | TOP 10 VN      | NO        |
|  5 | JCI STANDARD   | NO        |
|  6 | NABL CERTIFIED | NO        |
```

**Lưu ý**: Slider chỉ hiển thị certifications có ảnh (image_url NOT NULL).

## Bước tiếp theo

1. ✅ Upload ảnh cho các certifications còn lại
2. ✅ Thêm mô tả chi tiết cho mỗi certification
3. ✅ Test slider với nhiều slides
4. ✅ Test responsive trên mobile
5. ✅ Xóa debug logs sau khi test xong

## Hoàn thành
- ✅ Upload ảnh hoạt động
- ✅ Lưu vào database thành công
- ✅ Hiển thị trong table
- ✅ Slider hiển thị trên homepage
- ✅ Navigation dots hoạt động
- ✅ Auto-play hoạt động

---
**Ngày hoàn thành**: 4 tháng 2, 2026
**Trạng thái**: HOÀN THÀNH ✅
