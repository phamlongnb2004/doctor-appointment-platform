# Fix Doctor Article Edit Disappear Issue ✅

## Vấn đề
Khi admin cập nhật bài viết bác sĩ đang chờ duyệt (PENDING) trong AdminCMSPage, bài viết biến mất sau khi click Save.

## Nguyên nhân

### 1. Thiếu Case trong handleSubmit
Trong function `handleSubmit`, không có case xử lý cho `'doctor-articles'`:

```javascript
if (editingItem) {
  switch (currentTab) {
    case 'homepage': ...
    case 'services': ...
    case 'news': ...
    case 'testimonials': ...
    // THIẾU case 'doctor-articles'
    case 'features': ...
  }
}
```

Khi admin edit bài viết bác sĩ:
- `currentTab = 'doctor-articles'`
- Switch không match case nào
- Không gọi API update
- Form đóng nhưng data không được lưu
- Bài viết "biến mất" khỏi form

### 2. Thiếu Case trong renderForm
Function `renderForm` cũng không có case cho `'doctor-articles'`:

```javascript
const renderForm = () => {
  switch (currentTab) {
    case 'homepage': return <Form.Item>...</Form.Item>
    case 'news': return <Form.Item>...</Form.Item>
    // THIẾU case 'doctor-articles'
    case 'testimonials': return <Form.Item>...</Form.Item>
    default: return null; // Trả về null!
  }
}
```

Khi admin click Edit:
- Modal mở nhưng không hiển thị form fields
- User không thể edit gì cả

## Giải pháp

### 1. Thêm Case trong handleSubmit
**File**: `frontend/src/pages/AdminCMSPage.js`

```javascript
if (editingItem) {
  switch (currentTab) {
    // ... other cases ...
    case 'doctor-articles':
      // Admin update doctor article - keep status unchanged
      await cmsAPI.updateNewsArticle(editingItem.id, data);
      break;
    // ... other cases ...
  }
}
```

**Lưu ý**: Sử dụng `updateNewsArticle` (endpoint `/admin/news/{id}`) thay vì `updateDoctorArticle` (endpoint `/doctor/news/{id}`) vì:
- `/doctor/news/{id}` tự động reset status về PENDING
- `/admin/news/{id}` giữ nguyên status hiện tại

### 2. Thêm Case trong renderForm
**File**: `frontend/src/pages/AdminCMSPage.js`

```javascript
case 'doctor-articles':
  return (
    <>
      <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="excerpt" label="Tóm tắt">
        <TextArea rows={3} />
      </Form.Item>
      <Form.Item name="content" label="Nội dung">
        <TextArea rows={6} />
      </Form.Item>
      <Form.Item name="imageUrl" label="URL Hình ảnh">
        <Input />
      </Form.Item>
      <Form.Item name="slug" label="Slug">
        <Input />
      </Form.Item>
      <Form.Item name="author" label="Tác giả" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="status" label="Trạng thái duyệt" rules={[{ required: true }]}>
        <Select>
          <Option value="PENDING">Chờ duyệt</Option>
          <Option value="APPROVED">Đã duyệt</Option>
          <Option value="REJECTED">Từ chối</Option>
        </Select>
      </Form.Item>
      <Form.Item name="displayOrder" label="Thứ tự hiển thị">
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item name="isFeatured" label="Nổi bật" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
        <Switch />
      </Form.Item>
    </>
  );
```

**Điểm khác biệt so với case 'news'**:
- Thêm field `status` với Select dropdown
- Admin có thể thay đổi status: PENDING → APPROVED hoặc REJECTED

## Luồng Hoạt Động

### Trước khi fix:
1. Admin click Edit trên bài viết bác sĩ (tab doctor-articles)
2. Modal mở nhưng không hiển thị form (renderForm trả về null)
3. Admin không thể edit
4. Nếu somehow submit được, handleSubmit không gọi API
5. Bài viết không được lưu

### Sau khi fix:
1. Admin click Edit trên bài viết bác sĩ
2. Modal mở và hiển thị đầy đủ form fields
3. Admin có thể edit title, content, status, etc.
4. Click Save → handleSubmit gọi `updateNewsArticle`
5. Backend lưu với status được chọn
6. Bài viết cập nhật thành công

## So Sánh Endpoints

### `/doctor/news/{id}` (PUT)
- Dành cho bác sĩ tự update bài viết của mình
- **Tự động reset status về PENDING**
- Yêu cầu admin duyệt lại

### `/admin/news/{id}` (PUT)
- Dành cho admin update bất kỳ bài viết nào
- **Giữ nguyên status** (hoặc update theo data gửi lên)
- Admin có full control

## Testing

### Test Cases:
1. ✅ Admin edit bài viết PENDING → Form hiển thị đầy đủ
2. ✅ Admin thay đổi status PENDING → APPROVED → Lưu thành công
3. ✅ Admin thay đổi status PENDING → REJECTED → Lưu thành công
4. ✅ Admin edit title, content → Lưu thành công
5. ✅ Admin edit bài viết APPROVED → Status không bị reset
6. ✅ Bài viết không biến mất sau khi save

### Các Tab Khác:
- ✅ Tab 'news' vẫn hoạt động bình thường
- ✅ Tab 'testimonials' vẫn hoạt động bình thường
- ✅ Các tab khác không bị ảnh hưởng

## Lợi Ích

1. **Admin có thể edit bài viết bác sĩ**: Form hiển thị đầy đủ fields
2. **Kiểm soát status**: Admin có thể thay đổi status trực tiếp trong form
3. **Không mất dữ liệu**: Bài viết được lưu đúng cách
4. **Workflow rõ ràng**: Admin có full control over doctor articles

## Workflow Hoàn Chỉnh

### Bác sĩ tạo bài viết:
1. Bác sĩ tạo bài viết → Status = PENDING
2. Bài viết xuất hiện trong tab "Bài viết bác sĩ" của admin

### Admin duyệt bài viết:
**Cách 1: Dùng nút Approve/Reject**
1. Admin click "Duyệt" → Status = APPROVED
2. Admin click "Từ chối" → Status = REJECTED

**Cách 2: Edit trong modal**
1. Admin click Edit
2. Thay đổi status trong dropdown
3. Click Save

### Admin edit bài viết:
1. Admin click Edit
2. Sửa title, content, status, etc.
3. Click Save
4. Bài viết cập nhật với status được chọn

### Bác sĩ edit bài viết của mình:
1. Bác sĩ edit bài viết (trong DoctorArticlesPage)
2. Status tự động reset về PENDING
3. Admin phải duyệt lại

## Status
✅ **HOÀN THÀNH** - Admin có thể edit bài viết bác sĩ mà không bị mất dữ liệu

## Files Changed
- `frontend/src/pages/AdminCMSPage.js`
  - Added case 'doctor-articles' in handleSubmit (line ~251)
  - Added case 'doctor-articles' in renderForm (line ~838)
