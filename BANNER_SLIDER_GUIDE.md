# Hướng dẫn Banner Slider - Trang chủ

## Tổng quan

Hệ thống Banner Slider cho phép admin quản lý các banner hiển thị ở đầu trang chủ với khả năng:
- ✅ Tự động chuyển slide (autoplay)
- ✅ Upload ảnh cho mỗi banner
- ✅ Tùy chỉnh màu nền, màu chữ
- ✅ Thêm/sửa/xóa/sắp xếp banners
- ✅ Bật/tắt banner

## Cài đặt

### Bước 1: Chạy SQL

**Cách 1: Sử dụng batch script**
```bash
run_create_banners.bat
```

**Cách 2: MySQL Workbench**
1. Mở MySQL Workbench
2. Connect tới `doctor_appointment_db`
3. File → Open SQL Script → Chọn `database/create_banners_table.sql`
4. Execute

**Cách 3: Command line**
```bash
mysql -u root -p doctor_appointment_db < database/create_banners_table.sql
```

### Bước 2: Restart Backend

Backend đã có sẵn:
- ✅ Model: Banner.java
- ✅ Repository: BannerRepository.java
- ✅ Service methods trong CMSService
- ✅ Controller endpoints trong CMSController

Restart để load Banner model:
```bash
# Backend đang chạy, cần restart
```

### Bước 3: Cập nhật HomePage.js

Thay thế phần Hero Banner cũ bằng BannerSlider component.

**TÌM (dòng ~200-350):**
```javascript
{/* Hero Banner - Exact Medlatec Style */}
<div style={{ 
  background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
  minHeight: '600px',
  ...
}}>
  ...
</div>
```

**THAY BẰNG:**
```javascript
{/* Banner Slider */}
<BannerSlider banners={banners} />
```

**Thêm import ở đầu file:**
```javascript
import BannerSlider from '../components/BannerSlider';
```

**Thêm state:**
```javascript
const [banners, setBanners] = useState([]);
```

**Cập nhật fetchAllData:**
```javascript
const [
  doctorsResponse,
  heroResponse,
  servicesResponse,
  newsResponse,
  testimonialsResponse,
  statisticsResponse,
  featuresResponse,
  specialtiesResponse,
  statisticsDataResponse,
  certificationsResponse,
  bannersResponse  // Thêm dòng này
] = await Promise.all([
  doctorAPI.getActiveDoctors(),
  cmsAPI.getHomePageContentBySection('hero').catch(() => ({ data: null })),
  cmsAPI.getServices().catch(() => ({ data: [] })),
  cmsAPI.getLatestNews(4).catch(() => ({ data: [] })),
  cmsAPI.getFeaturedTestimonials(3).catch(() => ({ data: [] })),
  cmsAPI.getHomePageContentBySection('statistics').catch(() => ({ data: null })),
  cmsAPI.getFeatures().catch(() => ({ data: [] })),
  cmsAPI.getSpecialties().catch(() => ({ data: [] })),
  cmsAPI.getStatistics().catch(() => ({ data: [] })),
  cmsAPI.getCertifications().catch(() => ({ data: [] })),
  cmsAPI.getBanners().catch(() => ({ data: [] }))  // Thêm dòng này
]);

// Thêm dòng này
setBanners(bannersResponse.data || []);
```

### Bước 4: Cập nhật AdminCMSPage.js

Thêm tab "Banners" để quản lý.

**Thêm state:**
```javascript
const [banners, setBanners] = useState([]);
```

**Cập nhật fetchAllData:**
```javascript
const [homePageRes, servicesRes, newsRes, testimonialsRes, doctorArticlesRes, bannersRes] = await Promise.all([
  cmsAPI.getHomePageContent(),
  cmsAPI.getServices(),
  cmsAPI.getLatestNews(20),
  cmsAPI.getTestimonials(),
  cmsAPI.getAllArticlesForAdmin(),
  cmsAPI.getBanners()  // Thêm dòng này
]);

setBanners(bannersRes.data || []);  // Thêm dòng này
```

**Thêm columns:**
```javascript
const bannerColumns = [
  { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
  { title: 'Phụ đề', dataIndex: 'subtitle', key: 'subtitle' },
  { 
    title: 'Hình ảnh', 
    dataIndex: 'imageUrl', 
    key: 'imageUrl',
    render: (url) => url ? <img src={url} alt="banner" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : 'Không có'
  },
  { 
    title: 'Trạng thái', 
    dataIndex: 'isActive', 
    key: 'isActive',
    render: (isActive) => <Switch checked={isActive} disabled />
  },
  { title: 'Thứ tự', dataIndex: 'displayOrder', key: 'displayOrder' },
  {
    title: 'Hành động',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDelete(record.id, 'banners')}
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </Space>
    ),
  },
];
```

**Thêm tab:**
```javascript
<TabPane tab="Banners" key="banners">
  <div style={{ marginBottom: 16 }}>
    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
      Thêm banner
    </Button>
  </div>
  <Table
    columns={bannerColumns}
    dataSource={banners}
    rowKey="id"
    loading={loading}
  />
</TabPane>
```

**Thêm form fields:**
```javascript
case 'banners':
  return (
    <>
      <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="subtitle" label="Phụ đề">
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Mô tả">
        <TextArea rows={3} />
      </Form.Item>
      <Form.Item name="imageUrl" label="URL Hình ảnh">
        <Input placeholder="https://example.com/image.jpg" />
      </Form.Item>
      <Form.Item name="buttonText" label="Text Button">
        <Input />
      </Form.Item>
      <Form.Item name="buttonUrl" label="URL Button">
        <Input />
      </Form.Item>
      <Form.Item name="backgroundColor" label="Màu nền">
        <Input placeholder="linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)" />
      </Form.Item>
      <Form.Item name="textColor" label="Màu chữ">
        <Input placeholder="#ffffff" />
      </Form.Item>
      <Form.Item name="displayOrder" label="Thứ tự hiển thị">
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
        <Switch />
      </Form.Item>
    </>
  );
```

**Cập nhật handleDelete và handleSubmit:**
```javascript
// Trong handleDelete, thêm case:
case 'banners':
  await cmsAPI.deleteBanner(id);
  break;

// Trong handleSubmit, thêm case:
case 'banners':
  await cmsAPI.createBanner(data);  // hoặc updateBanner
  break;
```

## Cấu trúc Database

```sql
banners
├── id (BIGINT, PK)
├── title (VARCHAR(255))
├── subtitle (VARCHAR(255))
├── description (TEXT)
├── image_url (VARCHAR(500))
├── button_text (VARCHAR(100))
├── button_url (VARCHAR(500))
├── background_color (VARCHAR(50))
├── text_color (VARCHAR(50))
├── is_active (BOOLEAN)
├── display_order (INT)
├── created_at (DATETIME)
└── updated_at (DATETIME)
```

## API Endpoints

- `GET /api/cms/banners` - Lấy danh sách banners active (public)
- `POST /api/cms/admin/banners` - Tạo banner mới (admin)
- `PUT /api/cms/admin/banners/{id}` - Cập nhật banner (admin)
- `DELETE /api/cms/admin/banners/{id}` - Xóa banner (admin)

## Tính năng

### 1. Auto Slide
- Tự động chuyển slide sau 5 giây
- Effect: fade (mượt mà)
- Có thể tạm dừng khi hover

### 2. Responsive
- Desktop: 2 cột (text + image)
- Mobile: 1 cột (text trên, image dưới)

### 3. Tùy chỉnh
- Màu nền: Gradient hoặc solid color
- Màu chữ: Tùy chỉnh cho mỗi banner
- Hình ảnh: Upload hoặc URL
- Button: Text và link tùy chỉnh

### 4. Quản lý
- Thêm/sửa/xóa qua Admin CMS
- Sắp xếp thứ tự hiển thị
- Bật/tắt banner

## Upload ảnh

Để upload ảnh, bạn có 2 cách:

**Cách 1: Sử dụng URL**
- Upload ảnh lên hosting (Imgur, Cloudinary, etc.)
- Copy URL và paste vào field "URL Hình ảnh"

**Cách 2: Sử dụng ImageController (đã có)**
- Sử dụng endpoint `/api/images/articles` để upload
- Backend sẽ lưu vào `uploads/articles/`
- Trả về URL để paste vào banner

## Ví dụ Banner

```json
{
  "title": "SỨC KHỎE ĐỊNH KỲ",
  "subtitle": "Khám SỨC KHỎE ĐỊNH KỲ",
  "description": "Bảo vệ sức khỏe của đội ngũ - Gia tăng doanh nghiệp",
  "imageUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500",
  "buttonText": "Đăng ký ngay: 1900 56 56 56",
  "buttonUrl": "/doctors",
  "backgroundColor": "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
  "textColor": "#ffffff",
  "isActive": true,
  "displayOrder": 1
}
```

## Kết quả

Sau khi hoàn thành:
- ✅ Slider tự động chuyển ở trang chủ
- ✅ Admin quản lý banners qua CMS
- ✅ Upload ảnh dễ dàng
- ✅ Tùy chỉnh màu sắc, nội dung
- ✅ Responsive trên mọi thiết bị

## Bước tiếp theo

1. Chạy SQL: `run_create_banners.bat`
2. Restart backend
3. Cập nhật HomePage.js (thay Hero Banner bằng BannerSlider)
4. Cập nhật AdminCMSPage.js (thêm tab Banners)
5. Test và enjoy! 🎉
