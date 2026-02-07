# Medical Services CMS Implementation Guide

## Đã hoàn thành ✅

### 1. Database
- ✅ Tạo bảng `service_categories` (danh mục dịch vụ)
- ✅ Tạo bảng `medical_services` (dịch vụ y tế)
- ✅ Thêm dữ liệu mẫu (6 danh mục, 15 dịch vụ)
- ✅ File: `database/create_medical_services_tables.sql`

### 2. Backend Models
- ✅ `ServiceCategory.java` - Model danh mục dịch vụ
- ✅ `MedicalService.java` - Model dịch vụ y tế

### 3. Backend Repositories
- ✅ `ServiceCategoryRepository.java`
- ✅ `MedicalServiceRepository.java`

### 4. Backend Service Layer
- ✅ Thêm methods vào `CMSService.java`:
  - Service Categories: getActive, getAll, getBySlug, save, delete
  - Medical Services: getActive, getAll, getByCategory, getFeatured, getBySlug, save, delete

### 5. Backend Controller
- ✅ Thêm endpoints vào `CMSController.java`:
  - **Public**: GET /cms/service-categories, /cms/medical-services
  - **Admin**: CRUD cho categories và services

### 6. Frontend API
- ✅ Thêm methods vào `cmsApi.js`:
  - Service Categories: get, getAll, create, update, delete
  - Medical Services: get, getByCategory, getFeatured, getAll, create, update, delete

### 7. Frontend ServicesPage
- ✅ Cập nhật `ServicesPage.js` để sử dụng API thực
- ✅ Lấy danh mục từ database
- ✅ Lọc dịch vụ theo danh mục
- ✅ Hiển thị giá và giảm giá từ database

### 8. Admin CMS Menu
- ✅ Thêm menu group "Dịch vụ y tế" vào `AdminCMSPage.js`
- ✅ Menu items: "Danh mục dịch vụ", "Dịch vụ y tế"

## Cần làm tiếp ⏳

### 9. Admin CMS - Service Categories Management
Cần thêm vào `AdminCMSPage.js`:

```javascript
// State
const [serviceCategories, setServiceCategories] = useState([]);
const [serviceCategoryForm, setServiceCategoryForm] = useState({});
const [serviceCategoryModalVisible, setServiceCategoryModalVisible] = useState(false);

// Fetch
const fetchServiceCategories = async () => {
  const response = await cmsAPI.getAllServiceCategories();
  setServiceCategories(response.data);
};

// CRUD operations
const handleSaveServiceCategory = async (values) => {
  if (serviceCategoryForm.id) {
    await cmsAPI.updateServiceCategory(serviceCategoryForm.id, values);
  } else {
    await cmsAPI.createServiceCategory(values);
  }
  fetchServiceCategories();
};

const handleDeleteServiceCategory = async (id) => {
  await cmsAPI.deleteServiceCategory(id);
  fetchServiceCategories();
};

// Render table with columns: name, slug, description, icon, displayOrder, isActive
// Form fields: name, slug, description, icon, displayOrder, isActive
```

### 10. Admin CMS - Medical Services Management
Cần thêm vào `AdminCMSPage.js`:

```javascript
// State
const [medicalServices, setMedicalServices] = useState([]);
const [medicalServiceForm, setMedicalServiceForm] = useState({});
const [medicalServiceModalVisible, setMedicalServiceModalVisible] = useState(false);

// Fetch
const fetchMedicalServices = async () => {
  const response = await cmsAPI.getAllMedicalServices();
  setMedicalServices(response.data);
};

// CRUD operations
const handleSaveMedicalService = async (values) => {
  if (medicalServiceForm.id) {
    await cmsAPI.updateMedicalService(medicalServiceForm.id, values);
  } else {
    await cmsAPI.createMedicalService(values);
  }
  fetchMedicalServices();
};

const handleDeleteMedicalService = async (id) => {
  await cmsAPI.deleteMedicalService(id);
  fetchMedicalServices();
};

// Render table with columns: title, category, price, discount, displayOrder, isFeatured, isActive
// Form fields: categoryId, title, slug, description, content (RichTextEditor), 
//              imageUrl, originalPrice, discountedPrice, discountPercentage,
//              buttonText, buttonUrl, color, displayOrder, isFeatured, isActive
```

### 11. Render Content
Thêm vào phần render content của AdminCMSPage:

```javascript
{selectedMenu === 'service-categories' && (
  <Card title="Quản lý danh mục dịch vụ">
    {/* Table + Modal form */}
  </Card>
)}

{selectedMenu === 'medical-services' && (
  <Card title="Quản lý dịch vụ y tế">
    {/* Table + Modal form */}
  </Card>
)}
```

## Cấu trúc dữ liệu

### ServiceCategory
```javascript
{
  id: Long,
  name: String,
  slug: String,
  description: String,
  icon: String,
  displayOrder: Integer,
  isActive: Boolean
}
```

### MedicalService
```javascript
{
  id: Long,
  categoryId: Long,
  title: String,
  slug: String,
  description: String,
  content: String (HTML),
  imageUrl: String,
  originalPrice: Decimal,
  discountedPrice: Decimal,
  discountPercentage: Integer,
  buttonText: String,
  buttonUrl: String,
  color: String,
  displayOrder: Integer,
  isFeatured: Boolean,
  isActive: Boolean
}
```

## API Endpoints

### Public
- GET /api/cms/service-categories
- GET /api/cms/service-categories/{slug}
- GET /api/cms/medical-services
- GET /api/cms/medical-services/category/{categoryId}
- GET /api/cms/medical-services/featured
- GET /api/cms/medical-services/{slug}

### Admin
- GET /api/cms/admin/service-categories
- POST /api/cms/admin/service-categories
- PUT /api/cms/admin/service-categories/{id}
- DELETE /api/cms/admin/service-categories/{id}
- GET /api/cms/admin/medical-services
- POST /api/cms/admin/medical-services
- PUT /api/cms/admin/medical-services/{id}
- DELETE /api/cms/admin/medical-services/{id}

## Phân biệt với Services hiện tại

### Services (Tiện ích khách hàng) - Trang chủ
- Bảng: `services`
- Hiển thị ở trang chủ
- Không có danh mục
- Đơn giản hơn

### Medical Services (Dịch vụ y tế) - Trang riêng
- Bảng: `medical_services` + `service_categories`
- Hiển thị ở trang /services
- Có danh mục phân loại
- Có giá, giảm giá, nội dung chi tiết
- Layout shop-style

## Testing
1. Restart backend để load models mới
2. Kiểm tra database đã có dữ liệu
3. Test API endpoints với Postman
4. Test frontend ServicesPage
5. Test CMS management (sau khi implement)

## Next Steps
1. Implement Service Categories management UI trong AdminCMSPage
2. Implement Medical Services management UI trong AdminCMSPage
3. Test toàn bộ flow CRUD
4. Thêm image upload cho medical services
5. Thêm slug auto-generation
