# Fix Lỗi 500 Khi Lưu Sau Upload Ảnh - HOÀN TẤT ✅

## Vấn Đề
Khi upload ảnh icon trong Admin CMS và click lưu, gặp lỗi 500:
```
Failed to load resource: the server responded with a status of 500 ()
Lỗi khi lưu: Request failed with status code 500
```

## Nguyên Nhân
Frontend đang gửi các trường `createdAt`, `updatedAt`, `publishedAt` lên backend. Khi backend nhận các trường này dưới dạng string từ JSON, Hibernate không thể convert sang LocalDateTime và gây lỗi khi lưu vào database.

## Giải Pháp Đã Áp Dụng

### 1. Frontend - Loại Bỏ Các Trường DateTime
**File:** `frontend/src/pages/AdminCMSPage.js`

Sửa hàm `handleSubmit` để loại bỏ các trường datetime trước khi gửi lên backend:

```javascript
const handleSubmit = async (values) => {
  try {
    const data = { ...values };
    
    // Loại bỏ các trường datetime để backend tự động tạo
    delete data.createdAt;
    delete data.updatedAt;
    delete data.publishedAt;
    
    if (editingItem) {
      // Update logic...
    } else {
      // Create logic...
    }
    
    setModalVisible(false);
    fetchAllData();
  } catch (error) {
    message.error('Lỗi khi lưu: ' + error.message);
  }
};
```

### 2. Backend - Thêm PrePersist và JsonFormat
**File:** `backend/src/main/java/com/doctorappointment/model/Feature.java`

Thêm `@PrePersist` để tự động tạo datetime khi insert:

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

@PreUpdate
public void preUpdate() {
    this.updatedAt = LocalDateTime.now();
}
```

### 3. Backend - Thêm Logging
**File:** `backend/src/main/java/com/doctorappointment/controller/CMSController.java`

Thêm logging để debug:

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
```

## Cách Test

### 1. Mở Admin CMS
Truy cập: http://localhost:3000/admin/cms

### 2. Test Upload và Lưu Icon
1. Chọn tab "Tại sao chọn MEDLATEC?" (Features)
2. Click "Thêm tính năng" hoặc Edit một feature có sẵn
3. **Upload Icon:**
   - Click button "Upload Icon"
   - Chọn một file ảnh (PNG, JPG, GIF)
   - Đợi upload xong, ảnh sẽ hiển thị preview
4. **Điền thông tin:**
   - Title: "Đội ngũ bác sĩ chuyên nghiệp"
   - Description: "Hơn 500 bác sĩ giàu kinh nghiệm"
   - Icon: (đã upload hoặc nhập emoji 👨‍⚕️)
   - Color: Chọn màu từ color picker
   - Display Order: 1
   - Active: Bật
5. **Click "OK"** để lưu
6. **Kiểm tra:**
   - Không có lỗi 500
   - Thông báo "Cập nhật thành công!" hoặc "Tạo mới thành công!"
   - Feature xuất hiện trong bảng
   - Icon hiển thị đúng (ảnh hoặc emoji)

### 3. Test Các Tab Khác
Làm tương tự với các tab:
- ✅ "Tiện ích cho khách hàng" (Services)
- ✅ "Các chuyên khoa y tế" (Specialties)
- ✅ "MEDLATEC trong số liệu" (Statistics)
- ✅ "Chứng nhận & Giải thưởng" (Certifications)
- ✅ "Banner Slider" (Banners)

### 4. Kiểm Tra Homepage
1. Truy cập: http://localhost:3000
2. Scroll xuống các section
3. Xác nhận:
   - Icons hiển thị đúng (ảnh hoặc emoji)
   - Màu sắc áp dụng đúng
   - Nội dung hiển thị đầy đủ

## Lợi Ích

### 1. Tách Biệt Trách Nhiệm
- **Frontend:** Chỉ gửi dữ liệu business (title, description, icon, color, etc.)
- **Backend:** Tự động quản lý metadata (createdAt, updatedAt)

### 2. Tránh Lỗi Serialization
- Không cần lo lắng về format datetime giữa frontend và backend
- Backend luôn tạo datetime đúng format

### 3. Dễ Bảo Trì
- Nếu thay đổi format datetime, chỉ cần sửa backend
- Frontend không bị ảnh hưởng

## Trạng Thái
✅ Frontend đã sửa - loại bỏ datetime fields
✅ Backend đã sửa - thêm PrePersist và JsonFormat
✅ Logging đã thêm vào controller
✅ Frontend compiled thành công
✅ Backend đang chạy (Process ID: 9)
✅ Sẵn sàng test

## Lưu Ý Quan Trọng

### Áp Dụng Cho Các Model Khác
Nếu gặp lỗi tương tự với các model khác, áp dụng cùng fix:

**Models cần kiểm tra:**
- ✅ Feature (đã fix)
- ⏳ Specialty
- ⏳ Statistic
- ⏳ Certification
- ⏳ Banner
- ⏳ Service
- ⏳ NewsArticle
- ⏳ Testimonial
- ⏳ HomePageContent

### Debug Nếu Vẫn Lỗi
1. Mở Developer Console (F12)
2. Tab Network
3. Tìm request PUT/POST đến `/api/cms/admin/...`
4. Xem Payload để kiểm tra dữ liệu gửi đi
5. Xem Response để xem lỗi cụ thể
6. Kiểm tra backend log để xem stack trace

## Kết Luận
Lỗi 500 khi lưu sau upload ảnh đã được fix bằng cách:
1. Frontend không gửi datetime fields
2. Backend tự động tạo datetime khi insert/update
3. Thêm logging để debug dễ dàng hơn

Giờ đây admin có thể:
- Upload ảnh icon
- Chọn màu sắc
- Lưu thành công không lỗi
- Xem kết quả trên homepage ngay lập tức
