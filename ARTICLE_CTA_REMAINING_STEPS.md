# Các bước còn lại để hoàn thành Article CTA Section

## Đã hoàn thành ✅
1. Database table created
2. Backend Model created
3. Backend Repository created  
4. Backend Service updated
5. Backend Controller updated
6. Frontend API updated
7. Frontend Component created
8. NewsDetailPage updated (import, state, fetch, render)
9. AdminCMSPage state added
10. AdminCMSPage data fetch added
11. AdminCMSPage menu items added (desktop + mobile)

## Còn lại ⏳

### 1. Thêm tab content vào AdminCMSPage

Thêm sau dòng 3057 (sau news-sidebar-widgets tab):

```javascript
{/* Article CTA Section Tab */}
{currentTab === 'article-cta' && articleCtaSection && (
  <Card 
    className="admin-cms-card"
    title={
      <div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Section cuối bài viết</div>
        <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
          <FileTextOutlined /> Hiển thị ở cuối mỗi trang chi tiết bài viết
        </div>
      </div>
    }
    extra={
      <Button 
        type="primary" 
        icon={<EditOutlined />}
        onClick={() => {
          setEditingItem(articleCtaSection);
          setModalVisible(true);
        }}
      >
        Chỉnh sửa
      </Button>
    }
  >
    {/* Preview */}
    <div style={{ padding: 24, background: '#f5f5f5', borderRadius: 8 }}>
      <ArticleCtaSection data={articleCtaSection} />
    </div>
  </Card>
)}
```

### 2. Import ArticleCtaSection component

Thêm vào đầu file AdminCMSPage.js:

```javascript
import ArticleCtaSection from '../components/ArticleCtaSection';
```

### 3. Thêm form fields

Tìm hàm `renderFormFields()` và thêm case 'article-cta':

```javascript
case 'article-cta':
  return (
    <>
      <Form.Item name="title" label="Tiêu đề chính" rules={[{ required: true }]}>
        <Input placeholder="Lựa chọn dịch vụ" />
      </Form.Item>
      
      <Form.Item name="subtitle" label="Mô tả">
        <TextArea rows={2} placeholder="Quý khách hàng vui lòng lựa chọn dịch vụ y tế theo nhu cầu" />
      </Form.Item>

      <Divider>Dịch vụ 1</Divider>
      
      <Form.Item name="cta1Image" label="Hình ảnh 1">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Upload
            beforeUpload={handleUploadIcon}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Upload Hình ảnh
            </Button>
          </Upload>
          {form.getFieldValue('cta1Image') && (
            <img 
              src={form.getFieldValue('cta1Image')} 
              alt="Preview" 
              style={{ maxWidth: 200, maxHeight: 150, objectFit: 'cover', borderRadius: 8 }}
            />
          )}
        </Space>
      </Form.Item>
      
      <Form.Item name="cta1Title" label="Tiêu đề 1" rules={[{ required: true }]}>
        <Input placeholder="Lấy mẫu xét nghiệm tại nhà" />
      </Form.Item>
      
      <Form.Item name="cta1Description" label="Mô tả 1">
        <TextArea rows={3} />
      </Form.Item>
      
      <Form.Item name="cta1ButtonText" label="Text nút 1">
        <Input placeholder="Đặt lịch" />
      </Form.Item>
      
      <Form.Item name="cta1ButtonUrl" label="Link nút 1">
        <Input placeholder="/appointment" />
      </Form.Item>

      <Divider>Dịch vụ 2</Divider>
      
      <Form.Item name="cta2Image" label="Hình ảnh 2">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Upload
            beforeUpload={handleUploadIcon}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Upload Hình ảnh
            </Button>
          </Upload>
          {form.getFieldValue('cta2Image') && (
            <img 
              src={form.getFieldValue('cta2Image')} 
              alt="Preview" 
              style={{ maxWidth: 200, maxHeight: 150, objectFit: 'cover', borderRadius: 8 }}
            />
          )}
        </Space>
      </Form.Item>
      
      <Form.Item name="cta2Title" label="Tiêu đề 2" rules={[{ required: true }]}>
        <Input placeholder="Đặt lịch thăm khám tại MEDLATEC" />
      </Form.Item>
      
      <Form.Item name="cta2Description" label="Mô tả 2">
        <TextArea rows={3} />
      </Form.Item>
      
      <Form.Item name="cta2ButtonText" label="Text nút 2">
        <Input placeholder="Đặt lịch" />
      </Form.Item>
      
      <Form.Item name="cta2ButtonUrl" label="Link nút 2">
        <Input placeholder="/appointment" />
      </Form.Item>

      <Form.Item name="backgroundColor" label="Màu nền">
        <Input type="color" style={{ width: '100%', height: 40 }} />
      </Form.Item>
    </>
  );
```

### 4. Thêm save logic

Tìm hàm `handleSave()` và thêm case trong phần update:

```javascript
case 'article-cta':
  await cmsAPI.updateArticleCtaSection(editingItem.id, data);
  // Reload data
  const ctaResponse = await cmsAPI.getArticleCtaSection();
  setArticleCtaSection(ctaResponse.data);
  break;
```

### 5. Restart backend

```bash
# Stop current backend
# Start new backend
mvn spring-boot:run
```

## Test

1. Restart backend
2. Vào CMS Admin → "Chi tiết bài viết" → "Section cuối bài viết"
3. Click "Chỉnh sửa"
4. Thay đổi tiêu đề, mô tả, hình ảnh, nút
5. Click "Lưu"
6. Vào trang chi tiết bài viết bất kỳ
7. Scroll xuống cuối → Thấy section mới với nội dung đã chỉnh sửa

## Lưu ý

- Upload hình ảnh sẽ dùng chung endpoint `/api/images/upload`
- Màu nền mặc định là `#1890ff` (xanh dương)
- Section chỉ hiển thị khi có dữ liệu
- Có thể tắt section bằng cách set `is_active = false` trong database
