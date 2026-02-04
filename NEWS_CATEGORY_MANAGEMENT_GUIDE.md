# Quản Lý Danh Mục Tin Tức - Hướng Dẫn Hoàn Chỉnh

## Tổng quan

Hệ thống quản lý danh mục tin tức cho phép:
- ✅ Admin tạo/sửa/xóa danh mục tin tức
- ✅ Bác sĩ chọn danh mục khi đăng bài
- ✅ Danh mục động, không hardcode
- ✅ Mỗi danh mục có: tên, slug, mô tả, icon, màu sắc, thứ tự hiển thị

## Đã hoàn thành

### 1. Database ✅
- File: `database/create_news_categories_table.sql`
- Bảng: `news_categories`
- 7 danh mục mặc định đã được tạo

### 2. Backend ✅
- Model: `NewsCategory.java`
- Repository: `NewsCategoryRepository.java`
- Service: Methods trong `CMSService.java`
- Controller: Endpoints trong `CMSController.java`

### 3. Frontend API ✅
- File: `frontend/src/services/cmsApi.js`
- Methods: getAllNewsCategories, createNewsCategory, updateNewsCategory, deleteNewsCategory

## Cần làm tiếp

### Bước 1: Chạy SQL để tạo bảng

```bash
run_create_news_categories.bat
```

Hoặc:
```bash
mysql -u root doctor_appointment_db < database/create_news_categories_table.sql
```

### Bước 2: Restart Backend

Backend cần restart để nhận model mới.

### Bước 3: Cập nhật AdminCMSPage

Thêm vào `frontend/src/pages/AdminCMSPage.js`:

#### 3.1. Thêm state (sau dòng 74):
```javascript
const [newsCategories, setNewsCategories] = useState([]);
```

#### 3.2. Thêm fetch trong fetchAllData (trong Promise.all):
```javascript
cmsAPI.getAllNewsCategories()
```

#### 3.3. Set state (sau các setState khác):
```javascript
setNewsCategories(newsCategoriesRes.data || []);
```

#### 3.4. Thêm case trong handleDelete:
```javascript
case 'news-categories':
  await cmsAPI.deleteNewsCategory(id);
  break;
```

#### 3.5. Thêm case trong handleToggleStatus:
```javascript
case 'news-categories':
  currentItem = newsCategories.find(item => item.id === id);
  break;
```

#### 3.6. Thêm case trong handleToggleStatus update:
```javascript
case 'news-categories':
  await cmsAPI.updateNewsCategory(id, updateData);
  break;
```

#### 3.7. Thêm case trong handleSubmit update:
```javascript
case 'news-categories':
  await cmsAPI.updateNewsCategory(editingItem.id, data);
  break;
```

#### 3.8. Thêm case trong handleSubmit create:
```javascript
case 'news-categories':
  await cmsAPI.createNewsCategory(data);
  break;
```

#### 3.9. Thêm columns definition (sau certifications Columns):
```javascript
const newsCategoriesColumns = [
  { title: 'Tên danh mục', dataIndex: 'name', key: 'name' },
  { title: 'Slug', dataIndex: 'slug', key: 'slug' },
  { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
  { 
    title: 'Màu sắc', 
    dataIndex: 'color', 
    key: 'color',
    render: (color) => (
      <div style={{ 
        width: 40, 
        height: 20, 
        background: color, 
        borderRadius: 4,
        border: '1px solid #d9d9d9'
      }} />
    )
  },
  { 
    title: 'Trạng thái', 
    dataIndex: 'isActive', 
    key: 'isActive',
    render: (isActive, record) => (
      <Switch 
        checked={isActive} 
        onChange={() => handleToggleStatus(record.id, isActive, 'news-categories')}
      />
    )
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
          onConfirm={() => handleDelete(record.id, 'news-categories')}
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </Space>
    ),
  },
];
```

#### 3.10. Thêm form fields (trong renderFormFields):
```javascript
case 'news-categories':
  return (
    <>
      <Form.Item name="name" label="Tên danh mục" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
        <Input placeholder="tin-tuc-y-khoa" />
      </Form.Item>
      <Form.Item name="description" label="Mô tả">
        <TextArea rows={3} />
      </Form.Item>
      <Form.Item name="color" label="Màu sắc">
        <Space.Compact style={{ width: '100%' }}>
          <Input 
            type="color" 
            style={{ width: 80 }}
            onChange={(e) => form.setFieldsValue({ color: e.target.value })}
          />
          <Input 
            placeholder="#667eea"
            onChange={(e) => form.setFieldsValue({ color: e.target.value })}
          />
        </Space.Compact>
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

#### 3.11. Thêm tab mới (trong Tabs):
```javascript
<TabPane 
  tab={
    <span>
      <TagOutlined />
      Danh mục tin tức
    </span>
  } 
  key="news-categories"
>
  <Card 
    className="admin-cms-card"
    title={
      <div>
        <div>Quản lý danh mục tin tức</div>
        <div style={{ fontSize: 13, fontWeight: 400, color: '#64748b', marginTop: 4 }}>
          Quản lý các danh mục cho tin tức và bài viết
        </div>
      </div>
    }
    extra={
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={handleAdd}
      >
        Thêm danh mục
      </Button>
    }
  >
    <Table 
      className="admin-cms-table"
      columns={newsCategoriesColumns} 
      dataSource={newsCategories} 
      rowKey="id"
      loading={loading}
    />
  </Card>
</TabPane>
```

#### 3.12. Thêm icon import (đầu file):
```javascript
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UploadOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  HomeOutlined,
  FileTextOutlined,
  SettingOutlined,
  PictureOutlined,
  CustomerServiceOutlined,
  StarOutlined,
  TrophyOutlined,
  BarChartOutlined,
  MedicineBoxOutlined,
  CommentOutlined,
  UserOutlined,
  TagOutlined  // ← Thêm dòng này
} from '@ant-design/icons';
```

### Bước 4: Cập nhật form tạo/sửa bài viết

Thay đổi dropdown category từ hardcode sang dynamic:

#### Trong case 'news' của renderFormFields:
```javascript
<Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
  <Select placeholder="Chọn danh mục">
    {newsCategories.filter(cat => cat.isActive).map(category => (
      <Option key={category.id} value={category.name}>
        {category.name}
      </Option>
    ))}
  </Select>
</Form.Item>
```

#### Trong case 'doctor-articles' (nếu có):
```javascript
<Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
  <Select placeholder="Chọn danh mục">
    {newsCategories.filter(cat => cat.isActive).map(category => (
      <Option key={category.id} value={category.name}>
        {category.name}
      </Option>
    ))}
  </Select>
</Form.Item>
```

### Bước 5: Cập nhật DoctorArticlesPage

File: `frontend/src/pages/DoctorArticlesPage.js`

#### 5.1. Thêm state:
```javascript
const [categories, setCategories] = useState([]);
```

#### 5.2. Fetch categories:
```javascript
useEffect(() => {
  fetchCategories();
  // ... existing code
}, []);

const fetchCategories = async () => {
  try {
    const response = await cmsAPI.getAllNewsCategories();
    setCategories(response.data || []);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};
```

#### 5.3. Cập nhật form field category:
```javascript
<Form.Item 
  name="category" 
  label="Danh mục" 
  rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
>
  <Select placeholder="Chọn danh mục">
    {categories.filter(cat => cat.isActive).map(category => (
      <Option key={category.id} value={category.name}>
        {category.name}
      </Option>
    ))}
  </Select>
</Form.Item>
```

## API Endpoints

### Public Endpoints

#### Lấy tất cả danh mục active
```
GET /api/cms/news-categories
```

Response:
```json
[
  {
    "id": 1,
    "name": "Tin tức y khoa",
    "slug": "tin-tuc-y-khoa",
    "description": "Tin tức và cập nhật mới nhất về y khoa",
    "icon": null,
    "color": "#1890ff",
    "displayOrder": 1,
    "isActive": true
  }
]
```

#### Lấy danh mục theo slug
```
GET /api/cms/news-categories/{slug}
```

### Admin Endpoints

#### Lấy tất cả danh mục (bao gồm inactive)
```
GET /api/cms/admin/news-categories
Authorization: Bearer {token}
```

#### Tạo danh mục mới
```
POST /api/cms/admin/news-categories
Authorization: Bearer {token}

Body:
{
  "name": "Sức khỏe trẻ em",
  "slug": "suc-khoe-tre-em",
  "description": "Chăm sóc sức khỏe cho trẻ em",
  "color": "#52c41a",
  "displayOrder": 8,
  "isActive": true
}
```

#### Cập nhật danh mục
```
PUT /api/cms/admin/news-categories/{id}
Authorization: Bearer {token}

Body: (same as create)
```

#### Xóa danh mục
```
DELETE /api/cms/admin/news-categories/{id}
Authorization: Bearer {token}
```

## Database Schema

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

## Testing

### 1. Test Backend API
```bash
# Lấy tất cả categories
curl http://localhost:8080/api/cms/news-categories

# Tạo category mới (cần token)
curl -X POST http://localhost:8080/api/cms/admin/news-categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Category","slug":"test-category","color":"#ff0000"}'
```

### 2. Test Frontend
1. Vào Admin CMS: http://localhost:3000/admin/cms
2. Click tab "Danh mục tin tức"
3. Thêm danh mục mới
4. Sửa danh mục
5. Toggle trạng thái
6. Xóa danh mục

### 3. Test Bác sĩ đăng bài
1. Login với tài khoản bác sĩ
2. Vào trang đăng bài
3. Kiểm tra dropdown danh mục hiển thị đúng
4. Chọn danh mục và đăng bài
5. Kiểm tra bài viết có category đúng

## Lưu ý

### Slug
- Slug phải unique
- Dùng để tạo URL thân thiện SEO
- Ví dụ: "Tin tức y khoa" → "tin-tuc-y-khoa"

### Color
- Dùng hex code: #1890ff
- Hiển thị trong UI để phân biệt danh mục
- Mặc định: #667eea

### Display Order
- Số càng nhỏ càng hiển thị trước
- Dùng để sắp xếp danh mục trong dropdown và sidebar

### isActive
- true: Hiển thị trong dropdown cho bác sĩ
- false: Ẩn nhưng vẫn giữ trong database

## Troubleshooting

### Lỗi: Không thấy tab "Danh mục tin tức"
- Kiểm tra đã thêm TabPane chưa
- Kiểm tra import TagOutlined
- Clear browser cache

### Lỗi: Dropdown category trống
- Kiểm tra fetchCategories được gọi
- Kiểm tra API endpoint
- Xem console log

### Lỗi: Không tạo được category
- Kiểm tra token authorization
- Kiểm tra slug unique
- Kiểm tra name unique

### Lỗi: Bác sĩ không thấy danh mục
- Kiểm tra isActive = true
- Kiểm tra filter trong Select
- Restart frontend

## Mở rộng

### 1. Icon cho danh mục
- Upload icon image
- Hiển thị icon trong dropdown
- Hiển thị icon trong NewsListPage

### 2. Thống kê
- Số lượng bài viết mỗi danh mục
- Danh mục phổ biến nhất
- Chart visualization

### 3. Nested Categories
- Danh mục cha - con
- Tree structure
- Breadcrumb navigation

### 4. SEO
- Meta description cho mỗi danh mục
- OG tags
- Sitemap generation
