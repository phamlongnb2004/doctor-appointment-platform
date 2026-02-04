# ✅ HOÀN THÀNH: Article CTA Section

## Tính năng
Thêm section "Lựa chọn dịch vụ" ở cuối mỗi trang chi tiết bài viết, có thể chỉnh sửa trong CMS.

## Đã triển khai ✅

### 1. Database
- ✅ Tạo bảng `article_cta_section`
- ✅ Insert dữ liệu mẫu

### 2. Backend
- ✅ Model: `ArticleCtaSection.java`
- ✅ Repository: `ArticleCtaSectionRepository.java`
- ✅ Service: Thêm methods vào `CMSService.java`
- ✅ Controller: Thêm endpoints vào `CMSController.java`

### 3. Frontend API
- ✅ Thêm methods vào `cmsApi.js`:
  - `getArticleCtaSection()`
  - `updateArticleCtaSection(id, data)`

### 4. Frontend Component
- ✅ Tạo `ArticleCtaSection.js`
- ✅ Responsive design
- ✅ 2 CTA items với hình ảnh, tiêu đề, mô tả, nút

### 5. NewsDetailPage
- ✅ Import component
- ✅ Thêm state `ctaSection`
- ✅ Fetch data từ API
- ✅ Render component ở cuối trang

### 6. CMS Admin
- ✅ Thêm state `articleCtaSection`
- ✅ Fetch data trong Promise.all
- ✅ Thêm menu group "Chi tiết bài viết"
- ✅ Thêm menu item "Section cuối bài viết" (desktop + mobile)
- ✅ Thêm tab content với preview
- ✅ Thêm form fields (11 fields):
  - Tiêu đề chính
  - Mô tả
  - Dịch vụ 1: Hình ảnh, Tiêu đề, Mô tả, Text nút, Link nút
  - Dịch vụ 2: Hình ảnh, Tiêu đề, Mô tả, Text nút, Link nút
  - Màu nền
- ✅ Thêm save logic
- ✅ Upload hình ảnh

### 7. Backend Restart
- ✅ Process 19 đang chạy

## Cách sử dụng

### Trong CMS Admin

1. Vào **CMS Admin** → **Chi tiết bài viết** → **Section cuối bài viết**
2. Click nút **"Chỉnh sửa"**
3. Chỉnh sửa các thông tin:
   - **Tiêu đề chính**: "Lựa chọn dịch vụ"
   - **Mô tả**: "Quý khách hàng vui lòng lựa chọn..."
   - **Dịch vụ 1**:
     - Upload hình ảnh
     - Nhập tiêu đề: "Lấy mẫu xét nghiệm tại nhà"
     - Nhập mô tả
     - Text nút: "Đặt lịch"
     - Link nút: "/appointment"
   - **Dịch vụ 2**: Tương tự
   - **Màu nền**: Chọn màu (mặc định #1890ff)
4. Click **"Lưu"**

### Xem kết quả

1. Vào bất kỳ trang chi tiết bài viết nào
2. Scroll xuống cuối trang
3. Thấy section "Lựa chọn dịch vụ" với 2 dịch vụ

## Cấu trúc Database

```sql
article_cta_section
├── id
├── title (Tiêu đề chính)
├── subtitle (Mô tả)
├── cta1_image (Hình ảnh 1)
├── cta1_title (Tiêu đề 1)
├── cta1_description (Mô tả 1)
├── cta1_button_text (Text nút 1)
├── cta1_button_url (Link nút 1)
├── cta2_image (Hình ảnh 2)
├── cta2_title (Tiêu đề 2)
├── cta2_description (Mô tả 2)
├── cta2_button_text (Text nút 2)
├── cta2_button_url (Link nút 2)
├── background_color (Màu nền)
├── is_active (Trạng thái)
├── created_at
└── updated_at
```

## API Endpoints

### Public
- `GET /api/cms/article-cta-section` - Lấy thông tin section

### Admin
- `PUT /api/cms/admin/article-cta-section/{id}` - Cập nhật section

## Files đã tạo/sửa

### Backend
1. `backend/src/main/java/com/doctorappointment/model/ArticleCtaSection.java` (NEW)
2. `backend/src/main/java/com/doctorappointment/repository/ArticleCtaSectionRepository.java` (NEW)
3. `backend/src/main/java/com/doctorappointment/service/CMSService.java` (UPDATED)
4. `backend/src/main/java/com/doctorappointment/controller/CMSController.java` (UPDATED)

### Frontend
5. `frontend/src/components/ArticleCtaSection.js` (NEW)
6. `frontend/src/services/cmsApi.js` (UPDATED)
7. `frontend/src/pages/NewsDetailPage.js` (UPDATED)
8. `frontend/src/pages/AdminCMSPage.js` (UPDATED)

### Database
9. `database/create_article_cta_section.sql` (NEW)

## Lưu ý

- Section chỉ hiển thị khi có dữ liệu (`articleCtaSection !== null`)
- Có thể tắt section bằng cách set `is_active = false` trong database
- Upload hình ảnh dùng endpoint `/api/images/upload`
- Màu nền mặc định: `#1890ff` (xanh dương MEDLATEC)
- Section responsive, tự động điều chỉnh layout trên mobile

## Test

✅ Backend đã restart (Process 19)
✅ Frontend đang chạy (Process 11)
✅ Sẵn sàng test!

Vào http://localhost:3000/admin/cms → Chi tiết bài viết → Section cuối bài viết để chỉnh sửa!
