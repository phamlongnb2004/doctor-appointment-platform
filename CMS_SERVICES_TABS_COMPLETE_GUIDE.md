# Hướng dẫn hoàn chỉnh: Thêm Tab Dịch vụ, Ngân hàng và Footer vào CMS

## Đã hoàn thành ✅
1. ✅ Menu items (desktop + mobile)
2. ✅ State variables
3. ✅ API functions trong cmsApi.js

## Cần làm tiếp

Vì file AdminCMSPage.js quá dài (4800+ lines), bạn cần tự thêm các phần sau:

### Bước 1: Thêm fetch data trong fetchAllData()
Tìm dòng có `Promise.all([` (khoảng dòng 200) và thêm 2 promises:

```javascript
serviceCategoriesRes,
medicalServicesRes
```

Vào cuối mảng Promise.all, thêm:

```javascript
cmsAPI.getAllServiceCategories(),
cmsAPI.getAllMedicalServices()
```

Sau đó thêm set data (sau các setXXX khác):

```javascript
setServiceCategories(serviceCategoriesRes.data || []);
setMedicalServices(medicalServicesRes.data || []);
```

### Bước 2: Thêm vào handleDelete (dòng ~460)
Trong switch statement, thêm 2 cases:

```javascript
case 'service-categories':
  await cmsAPI.deleteServiceCategory(id);
  break;
case 'medical-services':
  await cmsAPI.deleteMedicalService(id);
  break;
```

### Bước 3: Thêm vào handleToggleStatus (dòng ~520)
Trong phần tìm currentItem, thêm:

```javascript
case 'service-categories':
  currentItem = serviceCategories.find(item => item.id === id);
  break;
case 'medical-services':
  currentItem = medicalServices.find(item => item.id === id);
  break;
```

Trong phần update, thêm:

```javascript
case 'service-categories':
  await cmsAPI.updateServiceCategory(id, updateData);
  break;
case 'medical-services':
  await cmsAPI.updateMedicalService(id, updateData);
  break;
```

### Bước 4: Thêm vào handleSubmit (dòng ~650)
Trong phần UPDATE (editingItem), thêm:

```javascript
case 'service-categories':
  await cmsAPI.updateServiceCategory(editingItem.id, data);
  break;
case 'medical-services':
  await cmsAPI.updateMedicalService(editingItem.id, data);
  break;
```

Trong phần CREATE (else), thêm:

```javascript
case 'service-categories':
  await cmsAPI.createServiceCategory(data);
  break;
case 'medical-services':
  await cmsAPI.createMedicalService(data);
  break;
```

### Bước 5: Thêm columns definitions (sau dòng ~800)
Copy toàn bộ code này và paste sau các columns khác:

```javascript
const serviceCategoryColumns = [
  { title: 'Tên danh mục', dataIndex: 'name', key: 'name' },
  { title: 'Slug', dataIndex: 'slug', key: 'slug' },
  { 
    title: 'Icon', 
    dataIndex: 'icon', 
    key: 'icon', 
    render: (icon) => <span style={{ fontSize: 24 }}>{icon}</span> 
  },
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

### Bước 6: Thêm tab content rendering
Tìm phần render các tabs (sau dòng 3600), thêm 4 tabs mới trước `</Layout>`:

```javascript
{/* Service Categories Tab */}
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

{/* Medical Services Tab */}
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

{/* Bank Account Tab */}
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
      onFinish={async (values) => {
        try {
          await cmsAPI.updateSiteSettings({ ...siteSettings, ...values });
          message.success('Cập nhật thành công!');
          fetchAllData();
        } catch (error) {
          message.error('Lỗi khi cập nhật: ' + error.message);
        }
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

{/* Footer Settings Tab */}
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
      onFinish={async (values) => {
        try {
          await cmsAPI.updateSiteSettings({ ...siteSettings, ...values });
          message.success('Cập nhật thành công!');
          fetchAllData();
        } catch (error) {
          message.error('Lỗi khi cập nhật: ' + error.message);
        }
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

## Tóm tắt
✅ Menu đã có
✅ State đã có
✅ API functions đã có
⏳ Cần thêm: fetch data, handlers, columns, tab content

File AdminCMSPage.js quá dài nên bạn cần tự thêm các phần còn lại theo hướng dẫn trên.

## Lưu ý quan trọng
- Bank account và Footer dùng SiteSettings (đã có sẵn)
- Service categories và Medical services cần form fields riêng trong Modal
- Cần thêm form fields cho service-categories: name, slug, description, icon, displayOrder, isActive
- Cần thêm form fields cho medical-services: categoryId, title, slug, description, content (RichTextEditor), imageUrl, originalPrice, discountedPrice, discountPercentage, buttonText, buttonUrl, color, displayOrder, isFeatured, isActive

