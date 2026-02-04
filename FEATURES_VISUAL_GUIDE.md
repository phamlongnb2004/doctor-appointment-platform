# Hướng dẫn trực quan: Quản lý Features

## Trước và Sau

### TRƯỚC (Hardcode)
```javascript
// HomePage.js - Hardcode
<Col xs={24} sm={12} lg={6}>
  <div style={{ textAlign: 'center', padding: 24 }}>
    <div style={{ background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)' }}>
      👨‍⚕️
    </div>
    <Title>Đội ngũ chuyên gia</Title>
    <Paragraph>200+ bác sĩ chuyên khoa hàng đầu...</Paragraph>
  </div>
</Col>
```
❌ Không thể thay đổi mà không sửa code
❌ Cần deploy lại khi thay đổi
❌ Không có giao diện quản lý

### SAU (Dynamic)
```javascript
// HomePage.js - Dynamic
{features.map((feature) => (
  <Col xs={24} sm={12} lg={6} key={feature.id}>
    <div style={{ textAlign: 'center', padding: 24 }}>
      <div style={{ background: feature.color }}>
        {feature.icon}
      </div>
      <Title>{feature.title}</Title>
      <Paragraph>{feature.description}</Paragraph>
    </div>
  </Col>
))}
```
✅ Admin quản lý qua CMS
✅ Thay đổi ngay lập tức
✅ Giao diện quản lý đầy đủ

## Giao diện Admin CMS

### Tab "Tính năng nổi bật"

```
┌─────────────────────────────────────────────────────────────┐
│ Quản lý nội dung CMS                                        │
├─────────────────────────────────────────────────────────────┤
│ [Nội dung trang chủ] [Dịch vụ] [Tin tức] [Đánh giá]       │
│ [Bài viết bác sĩ] [Tính năng nổi bật] ← TAB MỚI           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [+ Thêm tính năng]                                         │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Tiêu đề          │ Mô tả              │ Icon │ Màu  │   │
│ ├─────────────────────────────────────────────────────┤   │
│ │ Đội ngũ chuyên gia│ 200+ bác sĩ...   │ 👨‍⚕️  │ 🔵   │   │
│ │ Cơ sở hiện đại    │ Trang thiết bị... │ 🏥   │ 🟢   │   │
│ │ Phục vụ 24/7      │ Sẵn sàng hỗ trợ...│ ⏰   │ 🟠   │   │
│ │ An toàn tuyệt đối │ Tuân thủ nghiêm...│ 🛡️   │ 🟣   │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ Mỗi dòng có: [✏️ Sửa] [🗑️ Xóa]                            │
└─────────────────────────────────────────────────────────────┘
```

### Form thêm/sửa Feature

```
┌─────────────────────────────────────────┐
│ Thêm tính năng                          │
├─────────────────────────────────────────┤
│                                         │
│ Tiêu đề *                               │
│ [_________________________________]     │
│                                         │
│ Mô tả *                                 │
│ [_________________________________]     │
│ [_________________________________]     │
│ [_________________________________]     │
│                                         │
│ Icon (Emoji) *                          │
│ [👨‍⚕️____________________________]     │
│                                         │
│ Màu gradient *                          │
│ [linear-gradient(135deg, #1890ff...]   │
│                                         │
│ Thứ tự hiển thị                         │
│ [1_]                                    │
│                                         │
│ Kích hoạt                               │
│ [✓] Bật                                 │
│                                         │
│ [Tạo mới] [Hủy]                        │
└─────────────────────────────────────────┘
```

## Hiển thị trên Trang chủ

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│        TẠI SAO CHỌN MEDLATEC?                           │
│   Chúng tôi cam kết mang đến dịch vụ y tế chất lượng   │
│                                                          │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐              │
│  │  👨‍⚕️  │  │  🏥  │  │  ⏰  │  │  🛡️  │              │
│  │      │  │      │  │      │  │      │              │
│  │ Đội  │  │ Cơ   │  │ Phục │  │ An   │              │
│  │ ngũ  │  │ sở   │  │ vụ   │  │ toàn │              │
│  │ chuyên│  │ hiện │  │ 24/7 │  │ tuyệt│              │
│  │ gia  │  │ đại  │  │      │  │ đối  │              │
│  │      │  │      │  │      │  │      │              │
│  │ 200+ │  │ Trang│  │ Sẵn  │  │ Tuân │              │
│  │ bác sĩ│  │ thiết│  │ sàng │  │ thủ  │              │
│  │ chuyên│  │ bị y │  │ hỗ   │  │ nghiêm│              │
│  │ khoa  │  │ tế   │  │ trợ  │  │ ngặt │              │
│  └──────┘  └──────┘  └──────┘  └──────┘              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Workflow quản lý

### 1. Thêm Feature mới
```
Admin → CMS → Tab "Tính năng nổi bật" → [+ Thêm tính năng]
→ Điền form → [Tạo mới]
→ Feature xuất hiện ngay trên trang chủ
```

### 2. Sửa Feature
```
Admin → CMS → Tab "Tính năng nổi bật" → [✏️ Sửa]
→ Thay đổi nội dung → [Cập nhật]
→ Trang chủ cập nhật ngay lập tức
```

### 3. Xóa Feature
```
Admin → CMS → Tab "Tính năng nổi bật" → [🗑️ Xóa]
→ Xác nhận → Feature biến mất khỏi trang chủ
```

### 4. Bật/Tắt Feature
```
Admin → CMS → Tab "Tính năng nổi bật" → [✏️ Sửa]
→ Toggle "Kích hoạt" → [Cập nhật]
→ Feature ẩn/hiện trên trang chủ
```

### 5. Thay đổi thứ tự
```
Admin → CMS → Tab "Tính năng nổi bật" → [✏️ Sửa]
→ Thay đổi "Thứ tự hiển thị" → [Cập nhật]
→ Features sắp xếp lại trên trang chủ
```

## Database Structure

```sql
features
├── id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
├── title (VARCHAR(255), NOT NULL)
├── description (TEXT)
├── icon (VARCHAR(50))
├── color (VARCHAR(255))
├── is_active (BOOLEAN, DEFAULT TRUE)
├── display_order (INT, DEFAULT 0)
├── created_at (DATETIME, NOT NULL)
└── updated_at (DATETIME, NOT NULL)
```

## API Endpoints

### Public
```
GET /api/cms/features
→ Lấy danh sách features active
→ Sắp xếp theo display_order
```

### Admin (Cần token)
```
POST /api/cms/admin/features
→ Tạo feature mới
→ Body: { title, description, icon, color, displayOrder, isActive }

PUT /api/cms/admin/features/{id}
→ Cập nhật feature
→ Body: { title, description, icon, color, displayOrder, isActive }

DELETE /api/cms/admin/features/{id}
→ Xóa feature
```

## Ví dụ dữ liệu

```json
{
  "id": 1,
  "title": "Đội ngũ chuyên gia",
  "description": "200+ bác sĩ chuyên khoa hàng đầu với nhiều năm kinh nghiệm",
  "icon": "👨‍⚕️",
  "color": "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
  "isActive": true,
  "displayOrder": 1,
  "createdAt": "2026-02-03T10:00:00",
  "updatedAt": "2026-02-03T10:00:00"
}
```

## Tips & Tricks

### 1. Chọn Icon
- Sử dụng emoji: 👨‍⚕️ 🏥 ⏰ 🛡️ 💊 🔬 🩺 ❤️
- Copy từ: https://emojipedia.org/
- Hoặc dùng Unicode: \u{1F468}\u{200D}\u{2695}\u{FE0F}

### 2. Tạo Gradient
- Tool: https://cssgradient.io/
- Ví dụ:
  - Blue: `linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)`
  - Green: `linear-gradient(135deg, #52c41a 0%, #73d13d 100%)`
  - Orange: `linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)`
  - Purple: `linear-gradient(135deg, #722ed1 0%, #9254de 100%)`

### 3. Thứ tự hiển thị
- Số nhỏ hơn → Hiển thị trước
- Ví dụ: 1, 2, 3, 4
- Có thể dùng: 10, 20, 30, 40 để dễ chèn giữa

### 4. Mô tả ngắn gọn
- Nên giữ dưới 100 ký tự
- Tập trung vào lợi ích chính
- Dùng ngôn ngữ tích cực

## Troubleshooting

### Không thấy tab "Tính năng nổi bật"
- Kiểm tra đã chạy SQL chưa
- Restart backend nếu cần
- Clear cache trình duyệt

### Features không hiển thị trên trang chủ
- Kiểm tra `isActive = true`
- Kiểm tra có data trong database
- Mở Console để xem lỗi API

### Không thể thêm/sửa/xóa
- Kiểm tra đã đăng nhập admin
- Kiểm tra token còn hạn
- Kiểm tra backend đang chạy

### Màu sắc không hiển thị đúng
- Kiểm tra format gradient đúng
- Dùng tool cssgradient.io
- Test trước khi lưu

## Kết luận

Hệ thống Features đã hoàn chỉnh và sẵn sàng sử dụng. Admin có thể quản lý phần "TẠI SAO CHỌN MEDLATEC?" hoàn toàn qua giao diện CMS mà không cần code.
