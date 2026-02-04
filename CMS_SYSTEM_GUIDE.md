# Hướng Dẫn Sử Dụng Hệ Thống CMS

## ✅ HOÀN THÀNH

Hệ thống CMS đã được triển khai thành công! Tất cả nội dung trên trang chủ giờ đây được lấy từ database và có thể chỉnh sửa qua giao diện admin.

## 🎯 Tính Năng

### 1. **Nội Dung Động Từ Database**
- ✅ Tất cả nội dung trang chủ được lấy từ database
- ✅ Không còn hardcode trong code
- ✅ Admin có thể chỉnh sửa mọi thứ qua giao diện web

### 2. **Các Loại Nội Dung Quản Lý**

#### a) **Homepage Content** (Nội dung trang chủ)
- Hero banner (banner chính)
- Statistics (thống kê)
- Các section khác

#### b) **Services** (Dịch vụ)
- 7 dịch vụ mặc định
- Có icon, màu sắc, mô tả
- Thứ tự hiển thị tùy chỉnh

#### c) **News Articles** (Tin tức)
- 4 bài viết mẫu
- Có ảnh, tác giả, nội dung
- Đánh dấu nổi bật

#### d) **Testimonials** (Đánh giá khách hàng)
- 6 đánh giá mẫu
- Có ảnh, tên, chức danh
- Rating 1-5 sao

## 📊 Database

### Bảng Dữ Liệu
```
- homepage_content (2 records)
- services (7 records)
- news_articles (4 records)
- testimonials (6 records)
```

### Dữ Liệu Mẫu
Đã được khởi tạo với nội dung tiếng Việt theo phong cách MEDLATEC.

## 🔧 API Endpoints

### Public Endpoints (Không cần đăng nhập)
```
GET /api/cms/homepage-content          - Lấy tất cả nội dung trang chủ
GET /api/cms/homepage-content/{key}    - Lấy nội dung theo section key
GET /api/cms/services                  - Lấy tất cả dịch vụ
GET /api/cms/news                      - Lấy tin tức (limit=4)
GET /api/cms/news/featured             - Lấy tin nổi bật
GET /api/cms/testimonials              - Lấy tất cả đánh giá
GET /api/cms/testimonials/featured     - Lấy đánh giá nổi bật
```

### Admin Endpoints (Cần đăng nhập Admin)
```
POST   /api/cms/admin/homepage-content     - Tạo nội dung mới
PUT    /api/cms/admin/homepage-content/:id - Cập nhật nội dung
DELETE /api/cms/admin/homepage-content/:id - Xóa nội dung

POST   /api/cms/admin/services             - Tạo dịch vụ mới
PUT    /api/cms/admin/services/:id         - Cập nhật dịch vụ
DELETE /api/cms/admin/services/:id         - Xóa dịch vụ

POST   /api/cms/admin/news                 - Tạo tin tức mới
PUT    /api/cms/admin/news/:id             - Cập nhật tin tức
DELETE /api/cms/admin/news/:id             - Xóa tin tức

POST   /api/cms/admin/testimonials         - Tạo đánh giá mới
PUT    /api/cms/admin/testimonials/:id     - Cập nhật đánh giá
DELETE /api/cms/admin/testimonials/:id     - Xóa đánh giá
```

## 🖥️ Giao Diện Admin

### Truy Cập
1. Đăng nhập với tài khoản admin: `admin@doctor.com` / `password123`
2. Vào Admin Dashboard
3. Click menu "Quản lý nội dung" hoặc truy cập `/admin/cms`

### Chức Năng
- ✅ Xem danh sách tất cả nội dung
- ✅ Thêm mới nội dung
- ✅ Chỉnh sửa nội dung
- ✅ Xóa nội dung
- ✅ Bật/tắt hiển thị
- ✅ Sắp xếp thứ tự hiển thị

### Các Tab Quản Lý
1. **Nội dung trang chủ** - Quản lý hero, statistics, etc.
2. **Dịch vụ** - Quản lý các dịch vụ y tế
3. **Tin tức** - Quản lý bài viết tin tức
4. **Đánh giá khách hàng** - Quản lý testimonials

## 🎨 Frontend Integration

### HomePage.js
```javascript
// Tự động fetch dữ liệu từ API
const [services, setServices] = useState([]);
const [newsArticles, setNewsArticles] = useState([]);
const [testimonials, setTestimonials] = useState([]);

// Fetch khi component mount
useEffect(() => {
  fetchAllData();
}, []);
```

### Fallback Content
- Nếu API không có dữ liệu, sẽ hiển thị nội dung mặc định
- Đảm bảo trang web luôn hoạt động

## 🚀 Cách Sử Dụng

### 1. Chỉnh Sửa Hero Banner
1. Vào Admin CMS
2. Tab "Nội dung trang chủ"
3. Tìm section "hero"
4. Click Edit
5. Thay đổi tiêu đề, phụ đề, hình ảnh, button
6. Save

### 2. Thêm Dịch Vụ Mới
1. Vào Admin CMS
2. Tab "Dịch vụ"
3. Click "Thêm dịch vụ"
4. Điền thông tin:
   - Tiêu đề
   - Mô tả
   - Icon class (calendar, file-text, dollar, etc.)
   - Màu sắc
   - URL button
5. Save

### 3. Thêm Tin Tức
1. Vào Admin CMS
2. Tab "Tin tức"
3. Click "Thêm tin tức"
4. Điền thông tin:
   - Tiêu đề
   - Tóm tắt
   - Nội dung đầy đủ
   - Hình ảnh URL
   - Tác giả
   - Đánh dấu nổi bật (nếu muốn)
5. Save

### 4. Thêm Đánh Giá Khách Hàng
1. Vào Admin CMS
2. Tab "Đánh giá khách hàng"
3. Click "Thêm đánh giá"
4. Điền thông tin:
   - Tên khách hàng
   - Chức danh
   - Ảnh khách hàng URL
   - Nội dung đánh giá
   - Rating (1-5 sao)
   - Đánh dấu nổi bật
5. Save

## 🔍 Kiểm Tra

### Test API
```bash
# Test homepage content
curl http://localhost:8080/api/cms/homepage-content

# Test services
curl http://localhost:8080/api/cms/services

# Test news
curl http://localhost:8080/api/cms/news

# Test testimonials
curl http://localhost:8080/api/cms/testimonials
```

### Test Frontend
1. Mở http://localhost:3000
2. Xem trang chủ - tất cả nội dung từ database
3. Đăng nhập admin
4. Vào CMS, thay đổi nội dung
5. Refresh trang chủ - thấy thay đổi ngay lập tức

## ⚠️ Lưu Ý Quan Trọng

### CORS Configuration
- ❌ KHÔNG dùng `@CrossOrigin(origins = "*")` với `allowCredentials=true`
- ✅ Dùng CORS configuration global trong SecurityConfig
- ✅ Chỉ định rõ allowed origins

### Database
- Tất cả bảng CMS đã được tạo tự động bởi JPA
- Dữ liệu mẫu đã được insert
- Có thể thêm/sửa/xóa qua giao diện admin

### Security
- Public endpoints: Ai cũng có thể xem
- Admin endpoints: Chỉ admin mới được thêm/sửa/xóa
- JWT authentication được áp dụng

## 📝 Cấu Trúc Code

### Backend
```
backend/src/main/java/com/doctorappointment/
├── model/
│   ├── HomePageContent.java
│   ├── Service.java
│   ├── NewsArticle.java
│   └── Testimonial.java
├── repository/
│   ├── HomePageContentRepository.java
│   ├── ServiceRepository.java
│   ├── NewsArticleRepository.java
│   └── TestimonialRepository.java
├── service/
│   └── CMSService.java
└── controller/
    └── CMSController.java
```

### Frontend
```
frontend/src/
├── pages/
│   ├── HomePage.js (sử dụng CMS data)
│   └── AdminCMSPage.js (giao diện quản lý)
└── services/
    └── cmsApi.js (API calls)
```

## 🎉 Kết Quả

✅ **Không còn hardcode!**
- Tất cả nội dung từ database
- Admin có thể chỉnh sửa mọi thứ
- Thay đổi hiển thị ngay lập tức
- Dễ dàng mở rộng thêm nội dung mới

✅ **Giao diện admin hoàn chỉnh!**
- CRUD đầy đủ cho tất cả loại nội dung
- UI thân thiện với Ant Design
- Validation và error handling
- Responsive design

✅ **API RESTful chuẩn!**
- Public endpoints cho frontend
- Admin endpoints có bảo mật
- CORS configuration đúng
- Error handling tốt

## 🔄 Workflow

1. **Admin thêm/sửa nội dung** → Giao diện CMS
2. **Lưu vào database** → MySQL
3. **Frontend fetch data** → API call
4. **Hiển thị trên trang chủ** → Real-time update

---

**Hệ thống CMS đã sẵn sàng sử dụng!** 🚀
