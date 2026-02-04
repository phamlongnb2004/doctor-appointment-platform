# Banner Slider cho Trang Tin tức - Hoàn thành ✅

## Tổng quan

Đã triển khai thành công hệ thống banner slider riêng cho trang tin tức, cho phép Admin quản lý banner theo từng trang.

## Đã hoàn thành

### 1. Database ✅
- Thêm cột `page` vào bảng `banners`
- Giá trị mặc định: 'home'
- Các giá trị: 'home', 'news', 'doctors', etc.
- Thêm 2 banner mẫu cho trang tin tức

### 2. Backend ✅

**Model (Banner.java):**
- Thêm field `page` (String, length 50, default "home")

**Repository (BannerRepository.java):**
- `findByPageAndIsActiveTrueOrderByDisplayOrderAsc(String page)` - Lấy banner active theo page
- `findByPageOrderByDisplayOrderAsc(String page)` - Lấy tất cả banner theo page

**Service (CMSService.java):**
- `getActiveBannersByPage(String page)` - Lấy banner active theo page

**Controller (CMSController.java):**
- `GET /api/cms/banners/{page}` - Public endpoint lấy banner theo page

### 3. Frontend ✅

**API (cmsApi.js):**
- `getBannersByPage(page)` - Method mới để lấy banner theo page

**Admin CMS (AdminCMSPage.js):**
- Thêm trường "Trang hiển thị" vào form banner
- Dropdown với 3 options: Trang chủ, Trang tin tức, Trang bác sĩ
- Thêm cột "Trang" vào bảng banner với Tag màu sắc:
  - Trang chủ: màu xanh (blue)
  - Tin tức: màu xanh lá (green)
  - Bác sĩ: màu tím (purple)

**News List Page (NewsListPage.js):**
- Import BannerSlider component
- Fetch banners cho page 'news'
- Hiển thị BannerSlider ở đầu trang (nếu có banner)

## Cách sử dụng

### Admin - Quản lý Banner

1. **Vào Admin CMS → Tab "Banner Slider"**
2. **Thêm banner mới:**
   - Click "Thêm banner"
   - Upload hình ảnh
   - Chọn "Trang hiển thị": Trang tin tức
   - Nhập thứ tự hiển thị
   - Bật "Kích hoạt"
   - Click "Lưu"

3. **Chỉnh sửa banner:**
   - Click icon Edit
   - Thay đổi trang hiển thị nếu cần
   - Click "Cập nhật"

4. **Xem banner theo trang:**
   - Cột "Trang" hiển thị banner thuộc trang nào
   - Filter hoặc sort theo cột này

### Người dùng - Xem Banner

**Trang chủ:**
- Hiển thị banner có `page = 'home'`

**Trang tin tức:**
- Vào http://localhost:3000/news
- Banner slider hiển thị ở đầu trang
- Chỉ hiển thị banner có `page = 'news'` và `isActive = true`

## Cấu trúc Database

```sql
ALTER TABLE banners 
ADD COLUMN page VARCHAR(50) DEFAULT 'home' AFTER display_order;

CREATE INDEX idx_banners_page ON banners(page);
```

## API Endpoints

### Public Endpoint

**Lấy banner theo page:**
```
GET /api/cms/banners/{page}

Example:
GET /api/cms/banners/news
GET /api/cms/banners/home
GET /api/cms/banners/doctors
```

Response:
```json
[
  {
    "id": 1,
    "imageUrl": "https://...",
    "page": "news",
    "displayOrder": 1,
    "isActive": true,
    "createdAt": "2026-02-03T...",
    "updatedAt": "2026-02-03T..."
  }
]
```

### Admin Endpoints

**Tạo/Cập nhật banner:**
```
POST /api/cms/admin/banners
PUT /api/cms/admin/banners/{id}

Body:
{
  "imageUrl": "https://...",
  "page": "news",
  "displayOrder": 1,
  "isActive": true
}
```

## Các trang có thể có banner

| Page Value | Tên hiển thị | Màu Tag | Trang |
|------------|--------------|---------|-------|
| home | Trang chủ | Blue | / |
| news | Tin tức | Green | /news |
| doctors | Bác sĩ | Purple | /doctors |

## Mở rộng

### Thêm banner cho trang khác

1. **Thêm option vào dropdown trong AdminCMSPage:**
```javascript
<Option value="services">Trang dịch vụ</Option>
```

2. **Thêm màu tag:**
```javascript
const pageMap = {
  'home': { text: 'Trang chủ', color: 'blue' },
  'news': { text: 'Tin tức', color: 'green' },
  'doctors': { text: 'Bác sĩ', color: 'purple' },
  'services': { text: 'Dịch vụ', color: 'orange' }
};
```

3. **Thêm BannerSlider vào trang đó:**
```javascript
// Trong ServicesPage.js
const [banners, setBanners] = useState([]);

useEffect(() => {
  fetchBanners();
}, []);

const fetchBanners = async () => {
  const response = await cmsAPI.getBannersByPage('services');
  setBanners(response.data || []);
};

// Trong render
{banners.length > 0 && <BannerSlider banners={banners} />}
```

## Lưu ý

- Banner chỉ hiển thị khi `isActive = true`
- Thứ tự hiển thị theo `displayOrder` (ASC)
- Mỗi trang có thể có nhiều banner (slider)
- Nếu không có banner, trang vẫn hiển thị bình thường (không có slider)

## Kiểm tra

1. **Vào Admin CMS:**
   - Thêm 2-3 banner cho "Trang tin tức"
   - Kiểm tra cột "Trang" hiển thị đúng

2. **Vào trang tin tức:**
   - http://localhost:3000/news
   - Kiểm tra banner slider hiển thị ở đầu trang
   - Kiểm tra slider tự động chuyển

3. **Kiểm tra trang chủ:**
   - Banner trang chủ vẫn hiển thị bình thường
   - Không bị ảnh hưởng bởi banner trang tin tức

## Tóm tắt thay đổi

### Database
- ✅ Thêm cột `page` vào bảng `banners`
- ✅ Thêm 2 banner mẫu cho trang tin tức

### Backend
- ✅ Cập nhật Banner model
- ✅ Thêm methods trong BannerRepository
- ✅ Thêm method trong CMSService
- ✅ Thêm endpoint trong CMSController
- ✅ Build và restart thành công

### Frontend
- ✅ Thêm API method `getBannersByPage()`
- ✅ Thêm trường "Trang hiển thị" vào form banner
- ✅ Thêm cột "Trang" vào bảng banner
- ✅ Thêm BannerSlider vào NewsListPage
- ✅ Fetch và hiển thị banner theo page

## Kết quả

Hệ thống banner đã hoàn chỉnh với khả năng:
- Admin quản lý banner riêng cho từng trang
- Mỗi trang có banner slider riêng
- Dễ dàng mở rộng cho các trang khác
- Không ảnh hưởng đến banner trang chủ hiện tại

---

**Ngày hoàn thành:** 03/02/2026  
**Trạng thái:** ✅ Hoàn thành và đang chạy
