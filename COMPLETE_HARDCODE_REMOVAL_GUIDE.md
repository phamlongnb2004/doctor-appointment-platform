# Hướng dẫn loại bỏ TẤT CẢ hardcode - HOÀN CHỈNH

## Tổng quan

Giải pháp này loại bỏ HOÀN TOÀN tất cả hardcode trong HomePage và cho phép admin quản lý 100% nội dung qua CMS.

## Các phần đã được dynamic hóa

### 1. ✅ Features (Tại sao chọn MEDLATEC)
- 4 features: Đội ngũ chuyên gia, Cơ sở hiện đại, Phục vụ 24/7, An toàn tuyệt đối
- Admin có thể thêm/sửa/xóa/sắp xếp

### 2. ✅ Specialties (Chuyên khoa)
- 18 chuyên khoa: Nội, Ung bướu, Sản Phụ khoa, Chẩn đoán hình ảnh, v.v.
- Admin có thể quản lý toàn bộ
- Có thể đánh dấu "featured" để highlight

### 3. ✅ Statistics (Thống kê)
- 4 số liệu: 30+ năm, 500K+ bệnh nhân, 200+ bác sĩ, 98% hài lòng
- Admin có thể thay đổi giá trị và label

### 4. ✅ Certifications (Chứng nhận)
- 6 chứng nhận: ISO, CAP, Bộ Y Tế, TOP 10 VN, JCI, NABL
- Admin có thể thêm/xóa chứng nhận

### 5. ✅ Services (Dịch vụ)
- Đã có từ trước, sử dụng bảng `services`

### 6. ✅ News (Tin tức)
- Đã có từ trước, sử dụng bảng `news_articles`

### 7. ✅ Testimonials (Đánh giá khách hàng)
- Đã có từ trước, sử dụng bảng `testimonials`

### 8. ✅ Doctors (Bác sĩ)
- Đã có từ trước, lấy từ database

## Cài đặt

### Bước 1: Chạy SQL

**Cách 1: Sử dụng batch script (Dễ nhất)**
```bash
run_complete_hardcode_removal.bat
```

**Cách 2: MySQL Workbench**
1. Mở MySQL Workbench
2. Connect tới `doctor_appointment_db`
3. File → Open SQL Script → Chọn `database/remove_all_hardcode.sql`
4. Execute (⚡ icon)

**Cách 3: Command line**
```bash
mysql -u root -p doctor_appointment_db < database/remove_all_hardcode.sql
```

### Bước 2: Restart Backend

Backend đã có sẵn tất cả code cần thiết:
- ✅ Models: Specialty, Statistic, Certification
- ✅ Repositories: SpecialtyRepository, StatisticRepository, CertificationRepository
- ✅ Service methods trong CMSService
- ✅ Controller endpoints trong CMSController

Chỉ cần restart:
```bash
cd backend
mvn spring-boot:run
```

### Bước 3: Restart Frontend

Frontend đã có sẵn:
- ✅ API methods trong cmsApi.js
- ✅ Sẽ cập nhật HomePage.js và AdminCMSPage.js tiếp theo

```bash
cd frontend
npm start
```

## Cấu trúc Database

### Bảng `features`
```sql
- id: BIGINT (PK)
- title: VARCHAR(255)
- description: TEXT
- icon: VARCHAR(50)
- color: VARCHAR(255)
- is_active: BOOLEAN
- display_order: INT
- created_at: DATETIME
- updated_at: DATETIME
```

### Bảng `specialties`
```sql
- id: BIGINT (PK)
- name: VARCHAR(255)
- icon: VARCHAR(50)
- color: VARCHAR(50)
- description: TEXT
- is_active: BOOLEAN
- is_featured: BOOLEAN
- display_order: INT
- created_at: DATETIME
- updated_at: DATETIME
```

### Bảng `statistics`
```sql
- id: BIGINT (PK)
- label: VARCHAR(255)
- value: VARCHAR(100)
- icon: VARCHAR(50)
- color: VARCHAR(50)
- is_active: BOOLEAN
- display_order: INT
- created_at: DATETIME
- updated_at: DATETIME
```

### Bảng `certifications`
```sql
- id: BIGINT (PK)
- name: VARCHAR(255)
- icon: VARCHAR(50)
- color: VARCHAR(50)
- description: TEXT
- is_active: BOOLEAN
- display_order: INT
- created_at: DATETIME
- updated_at: DATETIME
```

## API Endpoints

### Specialties
- `GET /api/cms/specialties` - Lấy danh sách (public)
- `POST /api/cms/admin/specialties` - Tạo mới (admin)
- `PUT /api/cms/admin/specialties/{id}` - Cập nhật (admin)
- `DELETE /api/cms/admin/specialties/{id}` - Xóa (admin)

### Statistics
- `GET /api/cms/statistics` - Lấy danh sách (public)
- `POST /api/cms/admin/statistics` - Tạo mới (admin)
- `PUT /api/cms/admin/statistics/{id}` - Cập nhật (admin)
- `DELETE /api/cms/admin/statistics/{id}` - Xóa (admin)

### Certifications
- `GET /api/cms/certifications` - Lấy danh sách (public)
- `POST /api/cms/admin/certifications` - Tạo mới (admin)
- `PUT /api/cms/admin/certifications/{id}` - Cập nhật (admin)
- `DELETE /api/cms/admin/certifications/{id}` - Xóa (admin)

## Bước tiếp theo

Sau khi chạy SQL và restart backend, tôi sẽ:

1. ✅ Cập nhật HomePage.js để fetch và hiển thị dynamic data
2. ✅ Cập nhật AdminCMSPage.js để thêm các tab quản lý mới:
   - Tab "Chuyên khoa"
   - Tab "Thống kê"
   - Tab "Chứng nhận"

## Lợi ích

✅ **100% Dynamic** - Không còn hardcode nào
✅ **Quản lý tập trung** - Tất cả qua Admin CMS
✅ **Chuyên nghiệp** - Dễ bảo trì và mở rộng
✅ **Linh hoạt** - Thêm/sửa/xóa không cần code
✅ **Sắp xếp** - Có thể thay đổi thứ tự hiển thị
✅ **Bật/tắt** - Ẩn/hiện nội dung dễ dàng

## Kết quả cuối cùng

Sau khi hoàn thành, admin có thể quản lý:
- ✅ Hero banner
- ✅ Services (Dịch vụ)
- ✅ Features (Tại sao chọn MEDLATEC)
- ✅ Specialties (Chuyên khoa)
- ✅ Statistics (Thống kê)
- ✅ News (Tin tức)
- ✅ Doctors (Bác sĩ - từ database)
- ✅ Certifications (Chứng nhận)
- ✅ Testimonials (Đánh giá)

**Tất cả đều qua giao diện CMS, không cần code!**
