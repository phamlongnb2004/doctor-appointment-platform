# Certification CMS Form Update Guide

## Summary of Completed Work

✅ **Backend:**
- Added `image_url` column to database
- Updated `Certification.java` model with `imageUrl` field
- Added `/admin/certifications/upload-image` endpoint in `CMSController.java`

✅ **Frontend:**
- Added `uploadCertificationImage()` API call in `cmsApi.js`
- Created `CertificationSlider.js` component
- Created `certification-slider.css` styles
- Updated `HomePage.js` to use slider
- Changed section title to "CHỨNG CHỈ VÀ CƠ SỞ VẬT CHẤT"

## Next Step: Update AdminCMSPage.js

### Location
File: `frontend/src/pages/AdminCMSPage.js`
Section: Certifications tab (around line 2341)

### Changes Needed

#### 1. Add State Variables (around line 50-100)
```javascript
// Add these to existing state variables
const [certImageFile, setCertImageFile] = useState(null);
const [certImageUrl, setCertImageUrl] = useState('');
const [certImageUploading, setCertImageUploading] = useState(false);
```

#### 2. Update handleEdit Function (in certifications section)
```javascript
const handleEdit = (cert) => {
  setEditingId(cert.id);
  setCurrentName(cert.name);
  setCurrentIcon(cert.icon || '');
  setCurrentColor(cert.color || '#1890ff');
  setCurrentDescription(cert.description || '');
  setCertImageUrl(cert.imageUrl || '');
  setCurrentDisplayOrder(cert.displayOrder || 0);
};
```

#### 3. Update handleAdd Function
```javascript
const handleAdd = () => {
  setEditingId(null);
  setCurrentName('');
  setCurrentIcon('');
  setCurrentColor('#1890ff');
  setCurrentDescription('');
  setCertImageUrl('');
  setCertImageFile(null);
  setCurrentDisplayOrder(0);
};
```

#### 4. Add Image Upload Handler
```javascript
const handleCertImageChange = async (info) => {
  const file = info.file.originFileObj || info.file;
  
  if (file) {
    setCertImageUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await cmsAPI.uploadCertificationImage(formData);
      setCertImageUrl(response.data.imageUrl);
      message.success('Ảnh đã được tải lên thành công');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Lỗi khi tải ảnh lên');
    } finally {
      setCertImageUploading(false);
    }
  }
};
```

#### 5. Update handleSubmit Function
```javascript
const handleSubmit = async () => {
  if (!currentName.trim()) {
    message.error('Vui lòng nhập tên chứng chỉ');
    return;
  }

  const certData = {
    name: currentName,
    icon: currentIcon,
    color: currentColor,
    description: currentDescription,
    imageUrl: certImageUrl, // Add this line
    displayOrder: currentDisplayOrder,
    isActive: true
  };

  try {
    if (editingId) {
      await cmsAPI.updateCertification(editingId, certData);
      message.success('Cập nhật chứng chỉ thành công');
    } else {
      await cmsAPI.createCertification(certData);
      message.success('Thêm chứng chỉ thành công');
    }
    
    fetchCertifications();
    handleAdd(); // Reset form
  } catch (error) {
    console.error('Error saving certification:', error);
    message.error('Lỗi khi lưu chứng chỉ');
  }
};
```

#### 6. Update Form JSX (replace existing certifications form)
```javascript
<Card 
  title={
    <div>
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
        Chứng chỉ và cơ sở vật chất
      </div>
      <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
        <HomeOutlined /> Hiển thị ở: Trang chủ (Section 7)
      </div>
    </div>
  }
  extra={
    <Button 
      type="primary" 
      icon={<PlusOutlined />}
      onClick={handleAdd}
    >
      Thêm mới
    </Button>
  }
>
  {/* Form Section */}
  <div style={{ marginBottom: 24, padding: 24, background: '#f5f5f5', borderRadius: 8 }}>
    <Row gutter={16}>
      <Col span={12}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>
            Tên chứng chỉ *
          </label>
          <Input
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            placeholder="Nhập tên chứng chỉ"
            size="large"
          />
        </div>
      </Col>
      
      <Col span={12}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>
            Màu sắc
          </label>
          <Input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            style={{ width: '100%', height: 40 }}
          />
        </div>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={24}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>
            Mô tả
          </label>
          <Input.TextArea
            value={currentDescription}
            onChange={(e) => setCurrentDescription(e.target.value)}
            placeholder="Nhập mô tả chi tiết về chứng chỉ"
            rows={4}
            size="large"
          />
        </div>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={12}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>
            Ảnh chứng chỉ
          </label>
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
            onChange={handleCertImageChange}
            showUploadList={false}
          >
            {certImageUrl ? (
              <img src={certImageUrl} alt="cert" style={{ width: '100%' }} />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          {certImageUploading && <Spin />}
          {certImageUrl && (
            <Button 
              size="small" 
              danger 
              onClick={() => setCertImageUrl('')}
              style={{ marginTop: 8 }}
            >
              Xóa ảnh
            </Button>
          )}
        </div>
      </Col>

      <Col span={12}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>
            Icon (tùy chọn - dùng nếu không có ảnh)
          </label>
          <Input
            value={currentIcon}
            onChange={(e) => setCurrentIcon(e.target.value)}
            placeholder="URL icon hoặc emoji"
            size="large"
          />
        </div>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={12}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>
            Thứ tự hiển thị
          </label>
          <Input
            type="number"
            value={currentDisplayOrder}
            onChange={(e) => setCurrentDisplayOrder(parseInt(e.target.value) || 0)}
            size="large"
          />
        </div>
      </Col>
    </Row>

    <Button 
      type="primary" 
      size="large"
      onClick={handleSubmit}
      style={{ marginRight: 8 }}
    >
      {editingId ? 'Cập nhật' : 'Thêm mới'}
    </Button>
    {editingId && (
      <Button size="large" onClick={handleAdd}>
        Hủy
      </Button>
    )}
  </div>

  {/* Table Section - Keep existing table code */}
  <Table
    dataSource={certifications}
    columns={[
      {
        title: 'Ảnh',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        width: 100,
        render: (imageUrl, record) => (
          imageUrl ? (
            <img src={imageUrl} alt={record.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
          ) : (
            <div style={{ fontSize: 24 }}>{record.icon || '📜'}</div>
          )
        )
      },
      {
        title: 'Tên',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
      },
      {
        title: 'Màu sắc',
        dataIndex: 'color',
        key: 'color',
        render: (color) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 20, height: 20, background: color, borderRadius: 4 }} />
            <span>{color}</span>
          </div>
        )
      },
      {
        title: 'Thứ tự',
        dataIndex: 'displayOrder',
        key: 'displayOrder',
        width: 80,
      },
      {
        title: 'Trạng thái',
        dataIndex: 'isActive',
        key: 'isActive',
        render: (isActive) => (
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? 'Hoạt động' : 'Ẩn'}
          </Tag>
        )
      },
      {
        title: 'Thao tác',
        key: 'action',
        render: (_, record) => (
          <Space>
            <Button 
              type="link" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Bạn có chắc muốn xóa?"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    ]}
    rowKey="id"
    pagination={{ pageSize: 10 }}
  />
</Card>
```

### 7. Add Required Imports (at top of file)
```javascript
import { Upload, Spin } from 'antd'; // Add Upload and Spin if not already imported
```

## Testing Steps

1. **Restart backend** (if not already running)
2. **Refresh frontend** (Ctrl+F5)
3. **Go to Admin CMS** → Certifications tab
4. **Test adding new certification:**
   - Enter name
   - Upload image
   - Add description
   - Click "Thêm mới"
5. **Test editing:**
   - Click "Sửa" on existing item
   - Change image/description
   - Click "Cập nhật"
6. **View on homepage:**
   - Go to homepage
   - Scroll to "CHỨNG CHỈ VÀ CƠ SỞ VẬT CHẤT" section
   - See slider with images and descriptions
   - Test navigation dots

## Troubleshooting

### Image not uploading
- Check backend is running
- Check `uploads/certifications/` folder exists
- Check file size < 5MB
- Check file format (JPG, PNG, WEBP)

### Slider not showing
- Check certifications have `imageUrl` field populated
- Check browser console for errors
- Verify `CertificationSlider` component is imported

### Dots not working
- Check Ant Design Carousel is properly installed
- Check CSS is loaded
- Try clearing browser cache

## Files Modified

1. ✅ `database/update_certifications_add_fields.sql`
2. ✅ `backend/src/main/java/com/doctorappointment/model/Certification.java`
3. ✅ `backend/src/main/java/com/doctorappointment/controller/CMSController.java`
4. ✅ `frontend/src/services/cmsApi.js`
5. ✅ `frontend/src/components/CertificationSlider.js`
6. ✅ `frontend/src/styles/certification-slider.css`
7. ✅ `frontend/src/pages/HomePage.js`
8. ⏳ `frontend/src/pages/AdminCMSPage.js` (needs update - see guide above)

## Next Features (Optional)

- Add facilities section below certifications
- Add image lightbox for full-screen view
- Add more slider controls (prev/next buttons)
- Add admin preview before saving
- Add image cropping/resizing tool
