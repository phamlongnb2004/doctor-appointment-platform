# ✅ ĐÃ XÓA: Tab "Tin tức y khoa" khỏi CMS

## Thay đổi
Đã xóa tab "Tin tức y khoa" khỏi CMS Admin vì không cần thiết.

## Lý do
- Tab "Tin tức y khoa" dùng để quản lý bài viết tin tức (tạo/sửa/xóa bài viết)
- User không cần quản lý bài viết từ CMS Admin
- Bài viết tin tức đã có sẵn trong database
- Chỉ cần tab "Sections Tin tức" để cấu hình cách hiển thị

## Các phần đã xóa

**File**: `frontend/src/pages/AdminCMSPage.js`

1. **Menu item** - Xóa 2 chỗ (desktop + mobile menu):
```javascript
<Menu.Item key="news" icon={<FileTextOutlined />}>
  Tin tức y khoa
</Menu.Item>
```

2. **Tab content** - Xóa toàn bộ section hiển thị bảng tin tức:
```javascript
{currentTab === 'news' && (
  <Card>
    <Table columns={newsColumns} dataSource={newsArticles} />
  </Card>
)}
```

3. **Form fields** - Xóa toàn bộ form để tạo/sửa bài viết:
```javascript
case 'news':
  return (
    <>
      <Form.Item name="title" ... />
      <Form.Item name="category" ... />
      // ... các fields khác
    </>
  );
```

4. **CRUD operations** - Xóa các case statements:
   - `handleDelete` - case 'news'
   - `handleEdit` - case 'news'
   - `handleToggleStatus` - case 'news'
   - `handleSave` (update) - case 'news'
   - `handleSave` (create) - case 'news'

## Tabs còn lại trong CMS

### Trang chủ
- Cài đặt chung
- Banner trang chủ
- Tiện ích khách hàng
- Tại sao chọn chúng tôi
- Các chuyên khoa
- Số liệu thống kê
- Chứng chỉ và cơ sở vật chất
- Đánh giá khách hàng
- Ưu đãi thành viên

### Tin tức
- Banner tin tức
- Danh mục tin tức
- **Sections Tin tức** ← Dùng tab này để cấu hình
- Sidebar tin tức

### Bài viết bác sĩ
- Bài viết bác sĩ (quản lý bài viết của bác sĩ)

## Lưu ý

- Nếu cần quản lý bài viết tin tức, vẫn có thể dùng tab "Bài viết bác sĩ" hoặc thêm lại tab "Tin tức y khoa" sau
- Hiện tại chỉ cần dùng tab "Sections Tin tức" để cấu hình:
  - Layout (default/grid)
  - Màu nền
  - Số bài viết hiển thị
  - Danh mục lọc
  - **Hiển thị ở trang** (home/news/both)
