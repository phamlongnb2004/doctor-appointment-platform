# Thêm Tab Dịch vụ, Ngân hàng và Footer vào CMS Admin

## Trạng thái hiện tại
✅ Menu items đã được thêm vào sidebar (desktop + mobile)
- Tab "Dịch vụ" với 2 sub-tabs:
  - Danh mục dịch vụ (service-categories)
  - Dịch vụ y tế (medical-services)
- Tab "Thông tin ngân hàng" (bank-account)
- Tab "Footer" (footer-settings)

## Cần thêm

### 1. State Variables (Dòng ~120)
Thêm sau dòng `const [medicalServices, setMedicalServices] = useState([]);`:

```javascript
const [serviceCategories, setServiceCategories] = useState([]);
```

### 2. API Functions trong cmsApi.js
Thêm vào `frontend/src/services/cmsApi.js`:

```javascript
// Service Category endpoints
getServiceCategories: () => axios.get(`${API_BASE_URL}/cms/service-categories`),

getAllServiceCategories: () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_BASE_URL}/cms/admin/service-categories`, {
    headers: { Authorization: `Bearer ${token}` }
  });
},

createServiceCategory: (data) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API_BASE_URL}/cms/admin/service-categories`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
},

updateServiceCategory: (id, data) => {
  const token = localStorage.getItem('token');
  return axios.put(`${API_BASE_URL}/cms/admin/service-categories/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
},

deleteServiceCategory: (id) => {
  const token = localStorage.getItem('token');
  return axios.delete(`${API_BASE_URL}/cms/admin/service-categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
},

// Medical Service endpoints
getMedicalServices: () => axios.get(`${API_BASE_URL}/cms/medical-services`),

getAllMedicalServices: () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_BASE_URL}/cms/admin/medical-services`, {
    headers: { Authorization: `Bearer ${token}` }
  });
},

createMedicalService: (data) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API_BASE_URL}/cms/admin/medical-services`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
},

updateMedicalService: (id, data) => {
  const token = localStorage.getItem('token');
  return axios.put(`${API_BASE_URL}/cms/admin/medical-services/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
},

deleteMedicalService: (id) => {
  const token = localStorage.getItem('token');
  return axios.delete(`${API_BASE_URL}/cms/admin/medical-services/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
},
```

### 3. Fetch Data trong fetchAllData()
Thêm vào Promise.all (dòng ~200):

```javascript
const [
  // ... existing promises
  serviceCategoriesRes,
  medicalServicesRes
] = await Promise.all([
  // ... existing promises
  cmsAPI.getAllServiceCategories(),
  cmsAPI.getAllMedicalServices()
]);

// Set data
setServiceCategories(serviceCategoriesRes.data || []);
setMedicalServices(medicalServicesRes.data || []);
```

### 4. Columns Definitions
Thêm sau các columns khác (dòng ~800+):

```javascript
const serviceCategoryColumns = [
  { title: 'Tên danh mục', dataIndex: 'name', key: 'name' },
  { title: 'Slug', dataIndex: 'slug', key: 'slug' },
  { title: 'Icon', dataIndex: 'icon', key: 'icon', render: (icon) => <span style={{ fontSize: 24 }}>{icon}</span> },
  { title: 'Thứ tự', dataIndex: 'displayOrder', key: 'displayOrder' },
  { 
    title: 'Trạng thái', 
    dataIndex: 'isActive', 
    key: 'isActive',
    render: (isActive, record) => (
      <Switch 
        checked={isActive} 
        onChange={() => handleToggleStatus(record.id, isActive, 'service-categories')}
      />
    )
  },
  {
    title: 'Hành động',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDelete(record.id, 'service-categories')}
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </Space>
    ),
  },
];

const medicalServiceColumns = [
  { title: 'Tiêu đề', dataIndex: 'title', key: 'title', ellipsis: true },
  { 
    title: 'Danh mục', 
    dataIndex: 'categoryId', 
    key: 'categoryId',
    render: (categoryId) => {
      const category = serviceCategories.find(c => c.id === categoryId);
      return category ? category.name : '-';
    }
  },
  { 
    title: 'Giá gốc', 
    dataIndex: 'originalPrice', 
    key: 'originalPrice',
    render: (price) => price ? `${price.toLocaleString()}đ` : '-'
  },
  { 
    title: 'Giá KM', 
    dataIndex: 'discountedPrice', 
    key: 'discountedPrice',
    render: (price) => price ? `${price.toLocaleString()}đ` : '-'
  },
  { 
    title: 'Giảm giá', 
    dataIndex: 'discountPercentage', 
    key: 'discountPercentage',
    render: (percent) => percent ? `-${percent}%` : '-'
  },
  { 
    title: 'Nổi bật', 
    dataIndex: 'isFeatured', 
    key: 'isFeatured',
    render: (isFeatured) => isFeatured ? <Tag color="gold">Nổi bật</Tag> : null
  },
  { 
    title: 'Trạng thái', 
    dataIndex: 'isActive', 
    key: 'isActive',
    render: (isActive, record) => (
      <Switch 
        checked={isActive} 
        onChange={() => handleToggleStatus(record.id, isActive, 'medical-services')}
      />
    )
  },
  {
    title: 'Hành động',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDelete(record.id, 'medical-services')}
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </Space>
    ),
  },
];
```

### 5. Handle Delete - Thêm cases
Trong function `handleDelete` (dòng ~460), thêm:

```javascript
case 'service-categories':
  await cmsAPI.deleteServiceCategory(id);
  break;
case 'medical-services':
  await cmsAPI.deleteMedicalService(id);
  break;
```

### 6. Handle Toggle Status - Thêm cases
Trong function `handleToggleStatus` (dòng ~520), thêm:

```javascript
case 'service-categories':
  currentItem = serviceCategories.find(item => item.id === id);
  break;
case 'medical-services':
  currentItem = medicalServices.find(item => item.id === id);
  break;
```

Và trong switch update:

```javascript
case 'service-categories':
  await cmsAPI.updateServiceCategory(id, updateData);
  break;
case 'medical-services':
  await cmsAPI.updateMedicalService(id, updateData);
  break;
```

### 7. Handle Submit - Thêm cases
Trong function `handleSubmit` (dòng ~650), thêm vào phần update:

```javascript
case 'service-categories':
  await cmsAPI.updateServiceCategory(editingItem.id, data);
  break;
case 'medical-services':
  await cmsAPI.updateMedicalService(editingItem.id, data);
  break;
```

Và phần create:

```javascript
case 'service-categories':
  await cmsAPI.createServiceCategory(data);
  break;
case 'medical-services':
  await cmsAPI.createMedicalService(data);
  break;
```

### 8. Tab Content Rendering
Thêm sau các tab content khác (dòng ~3600+):

```javascript
{/* Service Categories Section */}
{currentTab === 'service-categories' && (
  <Card 
    className="admin-cms-card"
    title={
      <div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Danh mục dịch vụ</div>
        <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
          <TagOutlined /> Quản lý danh mục dịch vụ y tế
        </div>
      </div>
    }
    extra={
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Thêm danh mục
      </Button>
    }
  >
    <Table
      className="admin-cms-table"
      columns={serviceCategoryColumns}
      dataSource={serviceCategories}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  </Card>
)}

{/* Medical Services Section */}
{currentTab === 'medical-services' && (
  <Card 
    className="admin-cms-card"
    title={
      <div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Dịch vụ y tế</div>
        <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
          <MedicineBoxOutlined /> Quản lý dịch vụ y tế
        </div>
      </div>
    }
    extra={
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Thêm dịch vụ
      </Button>
    }
  >
    <Table
      className="admin-cms-table"
      columns={medicalServiceColumns}
      dataSource={medicalServices}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
      scroll={{ x: 1200 }}
    />
  </Card>
)}

{/* Bank Account Section */}
{currentTab === 'bank-account' && (
  <Card 
    className="admin-cms-card"
    title={
      <div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Thông tin ngân hàng</div>
        <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
          <SettingOutlined /> Cấu hình thông tin ngân hàng cho thanh toán QR
        </div>
      </div>
    }
  >
    <Form
      layout="vertical"
      initialValues={siteSettings}
      onFinish={(values) => {
        // Update site settings with bank info
        handleUpdateSiteSettings({ ...siteSettings, ...values });
      }}
    >
      <Form.Item label="Mã ngân hàng" name="bankId">
        <Input placeholder="VD: MB, VCB, TCB" />
      </Form.Item>
      <Form.Item label="Tên ngân hàng" name="bankName">
        <Input placeholder="VD: Ngân hàng Quân đội MB" />
      </Form.Item>
      <Form.Item label="Số tài khoản" name="bankAccountNo">
        <Input placeholder="Nhập số tài khoản" />
      </Form.Item>
      <Form.Item label="Tên chủ tài khoản" name="bankAccountName">
        <Input placeholder="Nhập tên chủ tài khoản" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu thông tin
        </Button>
      </Form.Item>
    </Form>
  </Card>
)}

{/* Footer Settings Section */}
{currentTab === 'footer-settings' && (
  <Card 
    className="admin-cms-card"
    title={
      <div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Cài đặt Footer</div>
        <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
          <SettingOutlined /> Cấu hình nội dung footer
        </div>
      </div>
    }
  >
    <Form
      layout="vertical"
      initialValues={siteSettings}
      onFinish={(values) => {
        handleUpdateSiteSettings({ ...siteSettings, ...values });
      }}
    >
      <Form.Item label="Giới thiệu Footer" name="footerAboutText">
        <TextArea rows={4} placeholder="Nhập nội dung giới thiệu" />
      </Form.Item>
      <Form.Item label="Giờ làm việc" name="footerWorkingHours">
        <TextArea rows={3} placeholder="VD: Thứ 2 - Thứ 7: 7:00 - 20:00" />
      </Form.Item>
      <Form.Item label="Facebook URL" name="footerFacebookUrl">
        <Input placeholder="https://facebook.com/..." />
      </Form.Item>
      <Form.Item label="YouTube URL" name="footerYoutubeUrl">
        <Input placeholder="https://youtube.com/..." />
      </Form.Item>
      <Form.Item label="Zalo URL" name="footerZaloUrl">
        <Input placeholder="https://zalo.me/..." />
      </Form.Item>
      <Form.Item label="Copyright Text" name="footerCopyrightText">
        <Input placeholder="© 2024 MEDLATEC. All rights reserved." />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu cài đặt
        </Button>
      </Form.Item>
    </Form>
  </Card>
)}
```

### 9. Modal Form Fields
Trong Modal form, thêm fields cho service-categories và medical-services. Tìm phần render Modal form và thêm conditional rendering dựa trên `currentTab`.

## Tóm tắt
- ✅ Menu đã thêm
- ⏳ Cần thêm state, API, columns, handlers, và tab content
- ⏳ Cần thêm form fields trong Modal

## Lưu ý
- Bank account và Footer settings sử dụng SiteSettings model (đã có)
- Service categories và Medical services cần CRUD đầy đủ
- Cần thêm RichTextEditor cho medical services content field

