# Banner Image Only - Simplified Form ✅

## Yêu cầu
Đơn giản hóa form Banner trong Admin CMS - chỉ cần upload ảnh, không cần nhập title, subtitle, description, button, màu sắc, etc.

## Thay đổi

### 1. Đơn giản hóa Form Banner
**File**: `frontend/src/pages/AdminCMSPage.js`

#### Trước khi thay đổi:
Form có nhiều fields:
- Tiêu đề (required)
- Phụ đề
- Mô tả
- URL Hình ảnh (text input)
- Text Button
- URL Button
- Màu nền
- Màu chữ
- Thứ tự hiển thị
- Kích hoạt

#### Sau khi thay đổi:
Form chỉ có 3 fields:
```javascript
case 'banners':
  return (
    <>
      <Form.Item name="imageUrl" label="Hình ảnh Banner" rules={[{ required: true, message: 'Vui lòng upload hình ảnh!' }]}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Upload
            beforeUpload={handleUploadIcon}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Upload Banner
            </Button>
          </Upload>
          {iconUrl && (
            <div style={{ marginTop: 8 }}>
              <img 
                src={iconUrl} 
                alt="banner preview" 
                style={{ 
                  width: '100%', 
                  maxWidth: 600,
                  height: 'auto',
                  objectFit: 'contain',
                  border: '1px solid #d9d9d9',
                  borderRadius: 4
                }} 
              />
            </div>
          )}
        </Space>
      </Form.Item>
      <Form.Item name="displayOrder" label="Thứ tự hiển thị" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
        <Switch />
      </Form.Item>
    </>
  );
```

**Fields:**
1. **Hình ảnh Banner** (required)
   - Upload button để chọn ảnh
   - Preview ảnh sau khi upload
   - Kích thước preview: max 600px width, auto height
   - Border và border-radius để đẹp hơn

2. **Thứ tự hiển thị** (required)
   - InputNumber, min = 0
   - Xác định thứ tự banner trong slider

3. **Kích hoạt**
   - Switch on/off
   - Bật/tắt banner

### 2. Cập nhật Bảng Hiển Thị
**File**: `frontend/src/pages/AdminCMSPage.js`

#### Trước khi thay đổi:
Bảng có các cột:
- Tiêu đề
- Phụ đề
- Hình ảnh (nhỏ 60x40)
- Trạng thái
- Thứ tự
- Hành động

#### Sau khi thay đổi:
```javascript
const bannerColumns = [
  { 
    title: 'Hình ảnh Banner', 
    dataIndex: 'imageUrl', 
    key: 'imageUrl',
    width: '60%',
    render: (url) => url ? (
      <img 
        src={url} 
        alt="banner" 
        style={{ 
          width: '100%',
          maxWidth: 400,
          height: 100, 
          objectFit: 'cover', 
          borderRadius: 4,
          border: '1px solid #d9d9d9'
        }} 
      />
    ) : 'Không có'
  },
  { 
    title: 'Trạng thái', 
    dataIndex: 'isActive', 
    key: 'isActive',
    width: '15%',
    render: (isActive) => <Switch checked={isActive} disabled />
  },
  { 
    title: 'Thứ tự', 
    dataIndex: 'displayOrder', 
    key: 'displayOrder',
    width: '10%'
  },
  {
    title: 'Hành động',
    key: 'actions',
    width: '15%',
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

**Cột:**
1. **Hình ảnh Banner** (60% width)
   - Hiển thị ảnh lớn hơn: max 400px width, 100px height
   - Object-fit: cover để giữ tỷ lệ
   - Border và border-radius

2. **Trạng thái** (15% width)
   - Switch disabled để xem trạng thái

3. **Thứ tự** (10% width)
   - Số thứ tự

4. **Hành động** (15% width)
   - Nút Edit
   - Nút Delete với confirm

## Workflow Sử Dụng

### Thêm Banner Mới:
1. Click "Thêm banner"
2. Click "Upload Banner"
3. Chọn ảnh từ máy tính (ví dụ: banner như ảnh bạn gửi)
4. Xem preview ảnh
5. Nhập thứ tự hiển thị (0, 1, 2, ...)
6. Bật/tắt "Kích hoạt"
7. Click "OK"

### Edit Banner:
1. Click icon Edit trên banner muốn sửa
2. Click "Upload Banner" để thay ảnh mới (nếu muốn)
3. Thay đổi thứ tự hoặc trạng thái
4. Click "OK"

### Xóa Banner:
1. Click icon Delete
2. Confirm xóa

## Lợi Ích

### 1. Đơn giản hơn
- Không cần nhập title, subtitle, description
- Chỉ cần upload ảnh
- Phù hợp với banner chỉ là hình ảnh

### 2. Nhanh hơn
- Ít fields để điền
- Upload và xong

### 3. Trực quan hơn
- Preview ảnh lớn trong form
- Hiển thị ảnh lớn trong bảng
- Dễ nhận biết banner nào

### 4. Phù hợp với Use Case
- Banner thường chỉ là hình ảnh
- Không cần text overlay (text đã có trong ảnh)
- Không cần button (có thể thêm sau nếu cần)

## Database

Banner model vẫn giữ nguyên các fields:
```sql
CREATE TABLE banners (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  description TEXT,
  image_url TEXT,
  button_text VARCHAR(100),
  button_url VARCHAR(255),
  background_color VARCHAR(50),
  text_color VARCHAR(50),
  display_order INT,
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Lưu ý**: 
- Các fields title, subtitle, etc. vẫn tồn tại trong database
- Nhưng form không yêu cầu nhập
- Có thể để NULL hoặc empty string
- Nếu sau này cần, có thể thêm lại vào form

## Ví dụ Banner

Ảnh banner bạn gửi:
- Kích thước: ~1200x300px (landscape)
- Nội dung: Logo, text, hình bác sĩ
- Màu nền: gradient xanh dương
- Text: "CÙNG ĐỘI NGŨ CHUYÊN GIA ĐẦU NGÀNH"

**Cách sử dụng:**
1. Upload ảnh này vào form
2. Set thứ tự = 0 (banner đầu tiên)
3. Bật "Kích hoạt"
4. Save

Banner sẽ hiển thị trong slider trên HomePage!

## BannerSlider Component

BannerSlider đã được implement để hiển thị banner:
- Tự động chuyển slide
- Dots navigation
- Responsive
- Chỉ hiển thị banner có `isActive = true`
- Sắp xếp theo `displayOrder`

**File**: `frontend/src/components/BannerSlider.js`

## Testing

### Test Cases:
1. ✅ Upload ảnh banner → Preview hiển thị đúng
2. ✅ Save banner → Lưu thành công
3. ✅ Hiển thị trong bảng → Ảnh hiển thị lớn và rõ
4. ✅ Edit banner → Upload ảnh mới thành công
5. ✅ Xóa banner → Xóa thành công
6. ✅ Banner hiển thị trên HomePage → Slider hoạt động

### Kích thước ảnh khuyến nghị:
- Width: 1200-1920px
- Height: 300-500px
- Tỷ lệ: 16:9 hoặc 21:9 (landscape)
- Format: JPG, PNG
- Size: < 500KB (để load nhanh)

## Status
✅ **HOÀN THÀNH** - Form banner đã được đơn giản hóa, chỉ cần upload ảnh

## Files Changed
- `frontend/src/pages/AdminCMSPage.js`
  - Simplified banner form (case 'banners' in renderForm)
  - Updated bannerColumns to show larger images

## Next Steps (Optional)

### 1. Thêm Image Cropper
Cho phép crop ảnh trước khi upload:
```javascript
import ImgCrop from 'antd-img-crop';

<ImgCrop aspect={16/9}>
  <Upload ...>
    <Button>Upload Banner</Button>
  </Upload>
</ImgCrop>
```

### 2. Thêm Multiple Upload
Upload nhiều banner cùng lúc:
```javascript
<Upload
  multiple
  beforeUpload={handleMultipleUpload}
>
  <Button>Upload Multiple Banners</Button>
</Upload>
```

### 3. Thêm Drag & Drop Reorder
Kéo thả để sắp xếp thứ tự banner trong bảng

### 4. Thêm Link URL
Nếu muốn banner có thể click vào:
```javascript
<Form.Item name="linkUrl" label="Link URL (tùy chọn)">
  <Input placeholder="https://..." />
</Form.Item>
```
