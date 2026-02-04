# ✅ STATISTICS SECTION BACKGROUND - HOÀN THÀNH (FIXED)

## Vấn đề đã sửa
Ban đầu tôi đã làm sai - cho phép mỗi statistic có background riêng. Giờ đã sửa lại đúng:
- ✅ **Ảnh nền là cho CẢ SECTION**, không phải mỗi thống kê
- ✅ Ảnh nền được quản lý ở **Site Settings**
- ✅ Tất cả statistics dùng chung 1 background image

## Thay đổi đã thực hiện

### 1. Database - Site Settings
**File**: `database/add_statistics_section_background.sql`
```sql
ALTER TABLE site_settings 
ADD COLUMN statistics_background_image VARCHAR(500) AFTER address;
```

**Chạy script**:
```bash
run_add_statistics_section_background.bat
```

### 2. Backend - SiteSettings Model
**File**: `backend/src/main/java/com/doctorappointment/model/SiteSettings.java`

✅ Thêm field:
```java
@Column(name = "statistics_background_image", length = 500)
private String statisticsBackgroundImage;
```

### 3. Frontend - AdminCMSPage.js

✅ **Tab "Thông tin Website"**:
- Thêm upload "Ảnh nền Section Thống kê"
- Preview ảnh 600x200px
- Hướng dẫn: "Ảnh ngang, kích thước 1920x600px"
- Lưu vào `siteSettings.statisticsBackgroundImage`

✅ **Tab "Số liệu thống kê"**:
- Form chỉ có: Nhãn, Giá trị, Màu thẻ, Thứ tự, Kích hoạt
- Loại bỏ upload ảnh nền (không cần nữa)
- Thêm note: "Ảnh nền được cài đặt ở tab Thông tin Website"
- Table loại bỏ cột "Ảnh nền"

### 4. Frontend - HomePage.js

✅ **Fetch siteSettings**:
```javascript
const [siteSettings, setSiteSettings] = useState(null);
// Fetch trong useEffect
```

✅ **Sử dụng background từ siteSettings**:
```javascript
// Nếu có background
{statistics.length > 0 && siteSettings?.statisticsBackgroundImage && (
  <div style={{ 
    backgroundImage: `url(${siteSettings.statisticsBackgroundImage})`
  }}>
    {/* Statistics cards */}
  </div>
)}

// Fallback nếu không có background
{statistics.length > 0 && !siteSettings?.statisticsBackgroundImage && (
  <div style={{ background: 'linear-gradient(...)' }}>
    {/* Statistics cards */}
  </div>
)}
```

## Cấu trúc dữ liệu

### Site Settings (1 record duy nhất)
```javascript
{
  id: 1,
  siteName: "MEDLATEC",
  siteTagline: "Chăm sóc sức khỏe",
  logoUrl: "/uploads/logo.png",
  hotline: "19005656",
  email: "info@medlatec.vn",
  address: "Hà Nội, Việt Nam",
  statisticsBackgroundImage: "/uploads/statistics-bg.jpg", // ← Ảnh nền cho section
  facebookUrl: "",
  youtubeUrl: "",
  zaloUrl: ""
}
```

### Statistics (nhiều records)
```javascript
[
  {
    id: 1,
    label: "Khách hàng mỗi năm",
    value: "4,000,000+",
    color: "#1890ff", // Màu thẻ riêng
    displayOrder: 0,
    isActive: true
  },
  {
    id: 2,
    label: "Cơ sở khám, chữa bệnh",
    value: "18",
    color: "#1890ff",
    displayOrder: 1,
    isActive: true
  },
  // ...
]
```

## Hướng dẫn sử dụng CMS

### Bước 1: Cài đặt ảnh nền (1 lần duy nhất)
1. Vào http://localhost:3000/admin/cms
2. Click menu "Thông tin Website"
3. Scroll xuống "Ảnh nền Section Thống kê"
4. Click "Upload ảnh nền"
5. Chọn ảnh (khuyến nghị: 1920x600px, ảnh ngang)
6. Click "Lưu thay đổi"

### Bước 2: Thêm/Sửa Statistics
1. Click menu "Số liệu thống kê"
2. Click "Thêm thống kê"
3. Nhập:
   - **Nhãn**: "Khách hàng mỗi năm"
   - **Giá trị**: "4,000,000+"
   - **Màu thẻ**: #1890ff (xanh dương)
   - **Thứ tự**: 0
   - **Kích hoạt**: Bật
4. Lưu

### Bước 3: Thêm các statistics khác
Lặp lại Bước 2 cho:
- "18" - "Cơ sở khám, chữa bệnh"
- "34" - "Cơ mặt trên toàn quốc"
- "200" - "Đội ngũ bác sĩ y tế"

## Giao diện

### CMS - Tab "Thông tin Website"
```
┌─────────────────────────────────────────┐
│ Tên Website: [MEDLATEC]                 │
│ Slogan: [Chăm sóc sức khỏe]             │
│ Logo Website: [Upload Logo]             │
│ Hotline: [19005656]                     │
│ Email: [info@medlatec.vn]               │
│ Địa chỉ: [Hà Nội, Việt Nam]             │
│                                         │
│ Ảnh nền Section Thống kê:              │
│ [Upload ảnh nền]                        │
│ [Preview: 600x200px]                    │
│ ℹ️ Ảnh nền cho section "MEDLATEC       │
│    TRONG SỐ LIỆU"                       │
│    Khuyến nghị: 1920x600px             │
│                                         │
│ [Lưu thay đổi]                          │
└─────────────────────────────────────────┘
```

### CMS - Tab "Số liệu thống kê"
```
┌─────────────────────────────────────────┐
│ [+ Thêm thống kê]                       │
├─────────────────────────────────────────┤
│ Nhãn          │ Giá trị  │ Màu    │ ... │
│ Khách hàng... │ 4,000... │ 🟦     │ ... │
│ Cơ sở khám... │ 18       │ 🟦     │ ... │
│ Cơ mặt trên...│ 34       │ 🟦     │ ... │
│ Đội ngũ bác...│ 200      │ 🟦     │ ... │
└─────────────────────────────────────────┘
```

### Form thêm/sửa Statistics
```
┌─────────────────────────────────────────┐
│ Nhãn: [Khách hàng mỗi năm]              │
│ Giá trị: [4,000,000+]                   │
│ Màu sắc thẻ: [🎨] [#1890ff]            │
│ Thứ tự hiển thị: [0]                    │
│ Kích hoạt: [✓]                          │
│                                         │
│ 💡 Lưu ý về ảnh nền:                    │
│ Ảnh nền cho section thống kê được      │
│ cài đặt ở tab "Thông tin Website"      │
│                                         │
│ [Hủy] [Lưu]                             │
└─────────────────────────────────────────┘
```

### HomePage - Section Statistics
```
┌─────────────────────────────────────────┐
│ [Background Image - Full Width]         │
│ [Overlay: rgba(0,0,0,0.3)]              │
│                                         │
│      MEDLATEC TRONG SỐ LIỆU             │
│   Những con số ấn tượng khẳng định...   │
│                                         │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│ │4,000K│ │  18  │ │  34  │ │ 200  │    │
│ │Khách │ │Cơ sở │ │Cơ mặt│ │Đội   │    │
│ │hàng  │ │khám  │ │trên  │ │ngũ   │    │
│ └──────┘ └──────┘ └──────┘ └──────┘    │
│                                         │
└─────────────────────────────────────────┘
```

## Ưu điểm của cách làm mới

### ✅ Đúng logic
- 1 section = 1 background image
- Không lãng phí (không cần upload nhiều lần)
- Dễ quản lý

### ✅ Dễ sử dụng
- Upload ảnh nền 1 lần duy nhất
- Thêm statistics chỉ cần nhập số liệu
- Không bị nhầm lẫn

### ✅ Performance tốt
- Chỉ load 1 ảnh background
- Không cần check từng statistic
- Tối ưu bandwidth

## So sánh

### ❌ Cách cũ (SAI)
```
Statistics 1: backgroundImage = "bg1.jpg"
Statistics 2: backgroundImage = "bg1.jpg" (duplicate!)
Statistics 3: backgroundImage = "bg1.jpg" (duplicate!)
Statistics 4: backgroundImage = "bg1.jpg" (duplicate!)
→ Lãng phí, khó quản lý
```

### ✅ Cách mới (ĐÚNG)
```
SiteSettings: statisticsBackgroundImage = "bg.jpg"
Statistics 1: label, value, color
Statistics 2: label, value, color
Statistics 3: label, value, color
Statistics 4: label, value, color
→ Hợp lý, dễ quản lý
```

## Kiểm tra

1. **Chạy SQL script**:
   ```bash
   run_add_statistics_section_background.bat
   ```

2. **Restart backend** (nếu đang chạy)

3. **Upload ảnh nền**:
   - Vào CMS → Thông tin Website
   - Upload ảnh nền section thống kê
   - Lưu

4. **Thêm statistics**:
   - Vào CMS → Số liệu thống kê
   - Thêm 4 statistics
   - Chỉ cần nhập nhãn, giá trị, màu

5. **Xem kết quả**: http://localhost:3000
   - Section có background image đẹp
   - 4 cards màu xanh dương
   - Hover effect mượt mà

## Kết quả

✅ Ảnh nền là cho CẢ SECTION (đúng logic)
✅ Quản lý tập trung ở Site Settings
✅ Statistics chỉ chứa dữ liệu số liệu
✅ Dễ sử dụng, không lãng phí
✅ Performance tốt

🎉 Hoàn thành đúng yêu cầu!
