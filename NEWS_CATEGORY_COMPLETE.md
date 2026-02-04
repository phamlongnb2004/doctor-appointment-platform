# Hệ thống Quản lý Danh mục Tin tức - Hoàn thành ✅

## Tổng quan

Đã hoàn thành việc triển khai hệ thống quản lý danh mục tin tức động, cho phép:
- ✅ Admin tạo/sửa/xóa danh mục tin tức
- ✅ Bác sĩ chọn danh mục từ dropdown động khi đăng bài
- ✅ Danh mục được quản lý trong database, không hardcode
- ✅ Mỗi danh mục có: tên, slug, mô tả, màu sắc, thứ tự hiển thị, trạng thái

## Đã hoàn thành

### 1. Database ✅
- Bảng `news_categories` đã được tạo
- 7 danh mục mặc định đã được thêm:
  1. Tin tức y khoa
  2. Sức khỏe tổng quát
  3. Dinh dưỡng
  4. Chuyên khoa
  5. Phòng bệnh
  6. Làm đẹp
  7. Sức khỏe tâm thần

### 2. Backend ✅
**Model:**
- `NewsCategory.java` - Entity với các trường: id, name, slug, description, icon, color, displayOrder, isActive

**Repository:**
- `NewsCategoryRepository.java` - JPA repository với custom queries

**Service:**
- `CMSService.java` - Các methods:
  - `getAllNewsCategories()` - Lấy tất cả categories
  - `getActiveNewsCategories()` - Lấy categories đang active
  - `getNewsCategoryById(Long id)` - Lấy category theo ID
  - `getNewsCategoryBySlug(String slug)` - Lấy category theo slug
  - `saveNewsCategory(NewsCategory category)` - Tạo/cập nhật category
  - `deleteNewsCategory(Long id)` - Xóa category

**Controller:**
- `CMSController.java` - 6 endpoints mới:
  - `GET /api/cms/news-categories` - Public: Lấy categories active
  - `GET /api/cms/news-categories/{slug}` - Public: Lấy category theo slug
  - `GET /api/cms/admin/news-categories` - Admin: Lấy tất cả categories
  - `POST /api/cms/admin/news-categories` - Admin: Tạo category mới
  - `PUT /api/cms/admin/news-categories/{id}` - Admin: Cập nhật category
  - `DELETE /api/cms/admin/news-categories/{id}` - Admin: Xóa category

### 3. Frontend API ✅
**File:** `frontend/src/services/cmsApi.js`

Đã thêm 4 methods:
```javascript
getAllNewsCategories()      // Lấy tất cả categories
createNewsCategory(data)    // Tạo category mới
updateNewsCategory(id, data) // Cập nhật category
deleteNewsCategory(id)      // Xóa category
```

### 4. Admin CMS Page ✅
**File:** `frontend/src/pages/AdminCMSPage.js`

**Đã thêm:**
- State: `newsCategories`
- Fetch categories trong `fetchAllData()`
- Columns definition: `newsCategoriesColumns`
- Form fields cho news-categories (name, slug, description, color, displayOrder, isActive)
- Tab mới "Danh mục tin tức" với icon TagOutlined
- Xử lý CRUD operations trong handleDelete, handleToggleStatus, handleSubmit
- Dropdown category trong form news/doctor-articles sử dụng dữ liệu động

**Tab mới trong menu:**
```
Tin tức
├── Bài viết bác sĩ
└── Danh mục tin tức  ← MỚI
```

### 5. Doctor Articles Page ✅
**File:** `frontend/src/pages/DoctorArticlesPage.js`

**Đã thêm:**
- State: `categories`
- `fetchCategories()` - Fetch categories khi component mount
- Form field "Danh mục" với dropdown động
- Import Select component từ antd

## Cách sử dụng

### Admin - Quản lý danh mục

1. Đăng nhập với tài khoản Admin
2. Vào trang Admin CMS: `http://localhost:3000/admin/cms`
3. Click tab "Danh mục tin tức" trong menu bên trái
4. Thao tác:
   - **Thêm danh mục:** Click nút "Thêm danh mục"
   - **Sửa danh mục:** Click icon Edit
   - **Xóa danh mục:** Click icon Delete
   - **Bật/tắt:** Toggle switch trong cột "Trạng thái"

### Admin - Tạo tin tức với danh mục

1. Vào tab "Tin tức y khoa"
2. Click "Thêm tin tức"
3. Chọn danh mục từ dropdown (chỉ hiển thị categories đang active)
4. Điền thông tin và lưu

### Bác sĩ - Đăng bài với danh mục

1. Đăng nhập với tài khoản Bác sĩ
2. Vào trang "Bài viết của tôi"
3. Click "Tạo bài viết mới"
4. Chọn danh mục từ dropdown
5. Điền thông tin và đăng bài

## Cấu trúc Database

```sql
CREATE TABLE news_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    color VARCHAR(50) DEFAULT '#667eea',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### Public Endpoints

**Lấy tất cả categories active:**
```
GET /api/cms/news-categories
```

**Lấy category theo slug:**
```
GET /api/cms/news-categories/{slug}
```

### Admin Endpoints (Cần Authorization)

**Lấy tất cả categories:**
```
GET /api/cms/admin/news-categories
Authorization: Bearer {token}
```

**Tạo category mới:**
```
POST /api/cms/admin/news-categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Sức khỏe trẻ em",
  "slug": "suc-khoe-tre-em",
  "description": "Chăm sóc sức khỏe cho trẻ em",
  "color": "#52c41a",
  "displayOrder": 8,
  "isActive": true
}
```

**Cập nhật category:**
```
PUT /api/cms/admin/news-categories/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Sức khỏe trẻ em",
  "slug": "suc-khoe-tre-em",
  "description": "Chăm sóc sức khỏe toàn diện cho trẻ em",
  "color": "#52c41a",
  "displayOrder": 8,
  "isActive": true
}
```

**Xóa category:**
```
DELETE /api/cms/admin/news-categories/{id}
Authorization: Bearer {token}
```

## Các trường trong NewsCategory

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| id | Long | ID tự động tăng |
| name | String | Tên danh mục (unique) |
| slug | String | URL-friendly slug (unique) |
| description | String | Mô tả danh mục |
| icon | String | URL icon (tùy chọn) |
| color | String | Mã màu hex (mặc định: #667eea) |
| displayOrder | Integer | Thứ tự hiển thị (mặc định: 0) |
| isActive | Boolean | Trạng thái kích hoạt (mặc định: true) |
| createdAt | Timestamp | Thời gian tạo |
| updatedAt | Timestamp | Thời gian cập nhật |

## Lưu ý quan trọng

### Slug
- Phải unique trong database
- Dùng để tạo URL thân thiện SEO
- Ví dụ: "Tin tức y khoa" → "tin-tuc-y-khoa"

### Color
- Sử dụng mã hex: #1890ff
- Hiển thị trong UI để phân biệt danh mục
- Có thể dùng color picker trong form

### Display Order
- Số càng nhỏ càng hiển thị trước
- Dùng để sắp xếp danh mục trong dropdown

### isActive
- `true`: Hiển thị trong dropdown cho bác sĩ/admin
- `false`: Ẩn nhưng vẫn giữ trong database

## Kiểm tra hoạt động

### 1. Kiểm tra Backend
```bash
# Lấy tất cả categories
curl http://localhost:8080/api/cms/news-categories

# Tạo category mới (cần token)
curl -X POST http://localhost:8080/api/cms/admin/news-categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Category","slug":"test-category","color":"#ff0000"}'
```

### 2. Kiểm tra Frontend
1. Vào Admin CMS: http://localhost:3000/admin/cms
2. Click tab "Danh mục tin tức"
3. Thử thêm/sửa/xóa danh mục
4. Kiểm tra toggle trạng thái
5. Vào tab "Tin tức y khoa" và kiểm tra dropdown category

### 3. Kiểm tra Bác sĩ
1. Login với tài khoản bác sĩ
2. Vào trang "Bài viết của tôi"
3. Click "Tạo bài viết mới"
4. Kiểm tra dropdown danh mục hiển thị đúng
5. Chọn danh mục và đăng bài
6. Kiểm tra bài viết có category đúng

## Troubleshooting

### Lỗi: Không thấy tab "Danh mục tin tức"
- Hard refresh browser (Ctrl + F5)
- Kiểm tra console log có lỗi không
- Kiểm tra backend đã chạy chưa

### Lỗi: Dropdown category trống
- Kiểm tra API endpoint: http://localhost:8080/api/cms/news-categories
- Xem console log trong browser
- Kiểm tra database có dữ liệu không

### Lỗi: Không tạo được category
- Kiểm tra token authorization
- Kiểm tra slug phải unique
- Kiểm tra name phải unique
- Xem console log backend

### Lỗi: Bác sĩ không thấy danh mục
- Kiểm tra isActive = true
- Kiểm tra filter trong Select component
- Hard refresh browser

## Tóm tắt thay đổi

### Backend
- ✅ Thêm model NewsCategory
- ✅ Thêm repository NewsCategoryRepository
- ✅ Thêm methods trong CMSService
- ✅ Thêm 6 endpoints trong CMSController
- ✅ Fix duplicate method getAllNewsCategories()
- ✅ Build và chạy thành công

### Frontend
- ✅ Thêm 4 API methods trong cmsApi.js
- ✅ Thêm tab "Danh mục tin tức" trong AdminCMSPage
- ✅ Thêm columns, form fields, CRUD handlers
- ✅ Cập nhật dropdown category từ hardcode sang dynamic
- ✅ Thêm fetch categories trong DoctorArticlesPage
- ✅ Fix import Select component

### Database
- ✅ Tạo bảng news_categories
- ✅ Insert 7 danh mục mặc định

## Kết quả

Hệ thống quản lý danh mục tin tức đã hoàn thành và hoạt động tốt:
- Admin có thể quản lý danh mục linh hoạt
- Bác sĩ chọn danh mục từ dropdown động
- Không còn hardcode categories
- Dễ dàng mở rộng và bảo trì

---

**Ngày hoàn thành:** 03/02/2026  
**Trạng thái:** ✅ Hoàn thành và đang chạy
