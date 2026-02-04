# Fix Lỗi 500 Khi Lưu Feature/Icon Sau Upload

## Vấn Đề
Khi upload ảnh icon và lưu trong Admin CMS, gặp lỗi 500:
```
Failed to load resource: the server responded with a status of 500 ()
Lỗi khi lưu: Request failed with status code 500
```

## Nguyên Nhân
Có 2 nguyên nhân chính:

### 1. Trường DateTime không được xử lý đúng
Khi frontend gửi dữ liệu lên backend, các trường `createdAt` và `updatedAt` có thể được gửi dưới dạng string thay vì LocalDateTime, gây lỗi khi Hibernate cố gắng lưu vào database.

### 2. Dữ liệu không hợp lệ
Frontend có thể gửi các trường null hoặc không đúng format.

## Giải Pháp Đã Áp Dụng

### 1. Thêm JsonFormat và PrePersist vào Feature Model
File: `backend/src/main/java/com/doctorappointment/model/Feature.java`

```java
import com.fasterxml.jackson.annotation.JsonFormat;

@Column(nullable = false)
@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
private LocalDateTime createdAt = LocalDateTime.now();

@Column(nullable = false)
@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
private LocalDateTime updatedAt = LocalDateTime.now();

@PrePersist
public void prePersist() {
    if (this.createdAt == null) {
        this.createdAt = LocalDateTime.now();
    }
    if (this.updatedAt == null) {
        this.updatedAt = LocalDateTime.now();
    }
}
```

### 2. Thêm Logging vào CMSController
File: `backend/src/main/java/com/doctorappointment/controller/CMSController.java`

```java
@PostMapping("/admin/features")
public ResponseEntity<Feature> createFeature(@RequestBody Feature feature) {
    try {
        System.out.println("=== CREATE FEATURE ===");
        System.out.println("Feature data: " + feature);
        Feature saved = cmsService.saveFeature(feature);
        System.out.println("Created successfully: " + saved);
        return ResponseEntity.ok(saved);
    } catch (Exception e) {
        System.err.println("Error creating feature: " + e.getMessage());
        e.printStackTrace();
        throw e;
    }
}

@PutMapping("/admin/features/{id}")
public ResponseEntity<Feature> updateFeature(@PathVariable Long id, @RequestBody Feature feature) {
    try {
        System.out.println("=== UPDATE FEATURE ===");
        System.out.println("ID: " + id);
        System.out.println("Feature data: " + feature);
        feature.setId(id);
        Feature updated = cmsService.saveFeature(feature);
        System.out.println("Updated successfully: " + updated);
        return ResponseEntity.ok(updated);
    } catch (Exception e) {
        System.err.println("Error updating feature: " + e.getMessage());
        e.printStackTrace();
        throw e;
    }
}
```

## Cách Test

### 1. Restart Backend
Backend đã được restart với code mới.

### 2. Test Upload và Lưu
1. Mở Admin CMS: http://localhost:3000/admin/cms
2. Chọn tab "Tại sao chọn MEDLATEC?" (Features)
3. Click "Thêm tính năng" hoặc "Edit" một feature
4. Upload một ảnh icon
5. Điền các trường khác
6. Click "OK" để lưu

### 3. Kiểm Tra Log
Nếu vẫn gặp lỗi, kiểm tra log backend để xem thông báo lỗi chi tiết:
- Log sẽ hiển thị dữ liệu được gửi lên
- Log sẽ hiển thị lỗi cụ thể nếu có

## Giải Pháp Thay Thế

Nếu vẫn gặp lỗi, có thể thử các cách sau:

### 1. Không Gửi createdAt/updatedAt từ Frontend
Sửa `AdminCMSPage.js` để loại bỏ các trường này trước khi gửi:

```javascript
const handleSubmit = async (values) => {
  try {
    const data = { ...values };
    
    // Loại bỏ các trường datetime
    delete data.createdAt;
    delete data.updatedAt;
    
    if (editingItem) {
      // Update logic...
    }
  } catch (error) {
    message.error('Lỗi khi lưu: ' + error.message);
  }
};
```

### 2. Sử Dụng @JsonIgnore
Thêm annotation vào Feature model:

```java
import com.fasterxml.jackson.annotation.JsonIgnore;

@JsonIgnore
@Column(nullable = false)
private LocalDateTime createdAt = LocalDateTime.now();

@JsonIgnore
@Column(nullable = false)
private LocalDateTime updatedAt = LocalDateTime.now();
```

### 3. Tạo DTO Riêng
Tạo một DTO class để nhận dữ liệu từ frontend, không bao gồm các trường datetime:

```java
@Data
public class FeatureRequest {
    private String title;
    private String description;
    private String icon;
    private String color;
    private Boolean isActive;
    private Integer displayOrder;
}
```

## Trạng Thái
✅ Đã áp dụng fix vào Feature model
✅ Đã thêm logging vào controller
✅ Backend đã restart
⏳ Đang chờ test lại

## Lưu Ý
- Cùng một vấn đề có thể xảy ra với các model khác (Specialty, Statistic, Certification, Banner, etc.)
- Nếu fix này hoạt động, cần áp dụng tương tự cho các model khác
- Luôn kiểm tra backend log để xác định nguyên nhân chính xác của lỗi 500
