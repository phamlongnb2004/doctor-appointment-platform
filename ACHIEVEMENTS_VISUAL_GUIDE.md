# Hướng dẫn Trực quan: Achievements Section Tùy chỉnh

## So sánh Trước và Sau

### TRƯỚC ❌

#### CMS Interface
```
[Thêm thành tựu]

Table:
| Tiêu đề    | Giá trị | Suffix | Icon              |
|------------|---------|--------|-------------------|
| Bệnh nhân  | 500000  | +      | TeamOutlined      |

Modal thêm/sửa:
- Tiêu đề: [Input]
- Giá trị: [Number]
- Suffix: [Input]
- Icon: [Dropdown: TeamOutlined, MedicineBoxOutlined, GlobalOutlined, TrophyOutlined]
```

**Vấn đề**:
- ❌ Không thể đổi tiêu đề "Con số ấn tượng"
- ❌ Background xanh cố định
- ❌ Chỉ có 4 icon Ant Design
- ❌ Không upload được icon riêng

#### Trang About
```
┌─────────────────────────────────────────┐
│   [Background xanh gradient cố định]    │
│                                         │
│         Con số ấn tượng                 │
│                                         │
│  [Icon 1]  [Icon 2]  [Icon 3]  [Icon 4]│
│  500000+   200+      50+       15       │
│  Bệnh nhân Bác sĩ    Chuyên khoa Năm   │
└─────────────────────────────────────────┘
```

---

### SAU ✅

#### CMS Interface
```
┌─────────────────────────────────────────┐
│ Cài đặt Section                         │
├─────────────────────────────────────────┤
│ Tiêu đề Section: [Con số ấn tượng____] │
│                                         │
│ Ảnh nền Section:                        │
│ [Upload ảnh nền]                        │
│ [Preview ảnh nền đã upload]             │
│                                         │
│ [Lưu cài đặt Section]                   │
└─────────────────────────────────────────┘

[Thêm thành tựu]

Table:
| Tiêu đề    | Giá trị | Suffix | Icon (Preview)    |
|------------|---------|--------|-------------------|
| Bệnh nhân  | 500000  | +      | [🖼️ Icon image]   |

Modal thêm/sửa:
- Tiêu đề: [Input]
- Giá trị: [Number]
- Suffix: [Input]
- Icon (Upload ảnh): [Upload icon]
  [Preview icon đã upload]
```

**Cải thiện**:
- ✅ Đổi được tiêu đề section
- ✅ Upload ảnh nền tùy chỉnh
- ✅ Upload icon riêng cho mỗi achievement
- ✅ Preview ngay trong CMS
- ✅ Không cần nhập URL

#### Trang About
```
┌─────────────────────────────────────────┐
│   [Background: Ảnh tùy chỉnh đã upload] │
│                                         │
│      [Tiêu đề tùy chỉnh từ CMS]        │
│                                         │
│  [Icon 1]  [Icon 2]  [Icon 3]  [Icon 4]│
│  (Upload)  (Upload)  (Upload)  (Upload) │
│  500000+   200+      50+       15       │
│  Bệnh nhân Bác sĩ    Chuyên khoa Năm   │
└─────────────────────────────────────────┘
```

---

## Workflow Sử dụng

### 1. Cài đặt Section

```
Admin CMS
    ↓
Tab "Giới thiệu"
    ↓
Sub-tab "Achievements"
    ↓
Card "Cài đặt Section"
    ↓
┌─────────────────────────────────┐
│ 1. Nhập tiêu đề mới             │
│ 2. Click "Upload ảnh nền"       │
│ 3. Chọn ảnh từ máy tính         │
│ 4. Xem preview                  │
│ 5. Click "Lưu cài đặt Section"  │
└─────────────────────────────────┘
    ↓
✅ Section settings đã lưu!
```

### 2. Thêm Achievement với Icon

```
Click "Thêm thành tựu"
    ↓
Modal mở ra
    ↓
┌─────────────────────────────────┐
│ 1. Nhập tiêu đề: "Bệnh nhân"    │
│ 2. Nhập giá trị: 500000         │
│ 3. Nhập suffix: "+"             │
│ 4. Click "Upload icon"          │
│ 5. Chọn icon từ máy tính        │
│ 6. Xem preview icon             │
│ 7. Click OK                     │
└─────────────────────────────────┘
    ↓
✅ Achievement đã lưu với icon!
```

### 3. Xem kết quả

```
Vào trang /about
    ↓
┌─────────────────────────────────┐
│ Background: Ảnh đã upload       │
│ Tiêu đề: Text đã nhập           │
│ Icons: Ảnh đã upload            │
└─────────────────────────────────┘
    ↓
✅ Hiển thị đúng!
```

---

## Ví dụ Thực tế

### Ví dụ 1: Thay đổi tiêu đề
```
Input CMS: "Thành tựu nổi bật của chúng tôi"
         ↓
Trang About: Hiển thị "Thành tựu nổi bật của chúng tôi"
```

### Ví dụ 2: Upload ảnh nền
```
Upload: medical-background.jpg
      ↓
Trang About: Background là ảnh medical-background.jpg
```

### Ví dụ 3: Upload icon
```
Achievement: "Bệnh nhân"
Upload icon: patient-icon.png
           ↓
Trang About: Hiển thị patient-icon.png thay vì TeamOutlined
```

---

## Lợi ích

### Cho Admin
- 🎨 Tự do thiết kế section theo brand
- 📸 Upload ảnh nền phù hợp với theme
- 🎯 Icon tùy chỉnh cho từng achievement
- 👁️ Preview ngay trong CMS
- ⚡ Không cần code, chỉ cần upload

### Cho Developer
- 🔧 Không còn hardcode
- 📦 Dữ liệu được quản lý tập trung
- 🔄 Dễ maintain và update
- 🎯 Cấu trúc dữ liệu rõ ràng

### Cho User
- 🎨 Giao diện đẹp hơn với ảnh tùy chỉnh
- 🎯 Icons phù hợp với nội dung
- 📱 Responsive trên mọi thiết bị
- ⚡ Load nhanh với ảnh tối ưu

---

## Tips & Tricks

### Chọn ảnh nền
- ✅ Độ phân giải: 1920x600px trở lên
- ✅ Format: JPG (dung lượng nhỏ) hoặc PNG (chất lượng cao)
- ✅ Màu sắc: Tối hoặc có overlay để text trắng dễ đọc
- ✅ Nội dung: Liên quan đến y tế, bệnh viện

### Chọn icon
- ✅ Kích thước: 60x60px đến 128x128px
- ✅ Format: PNG với nền trong suốt hoặc SVG
- ✅ Style: Đồng nhất giữa các icons
- ✅ Màu sắc: Trắng hoặc màu sáng (vì background tối)

### Best Practices
- 📏 Giữ số lượng achievements từ 3-6 items
- 🎨 Dùng icons cùng style (flat, outline, hoặc filled)
- 📝 Tiêu đề ngắn gọn, dễ hiểu
- 🔢 Số liệu thực tế, có ý nghĩa
