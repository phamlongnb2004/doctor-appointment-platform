# ✅ Thêm tính năng chỉnh màu chữ cho Statistics

## 🎯 Tính năng mới
Thêm khả năng chỉnh màu chữ (số liệu và nhãn) cho từng thẻ thống kê trong section "MEDLATEC TRONG SỐ LIỆU".

## ✅ Đã thực hiện

### 1. Database
Thêm cột `text_color` vào bảng `statistics`:

```sql
ALTER TABLE statistics ADD COLUMN text_color VARCHAR(20) DEFAULT '#FFFFFF' AFTER color;
UPDATE statistics SET text_color = '#FFFFFF' WHERE text_color IS NULL;
```

**Cấu trúc bảng mới:**
```
+------------------+--------------+------+-----+---------+
| Field            | Type         | Null | Key | Default |
+------------------+--------------+------+-----+---------+
| id               | bigint       | NO   | PRI | NULL    |
| label            | varchar(255) | NO   |     | NULL    |
| value            | varchar(100) | NO   |     | NULL    |
| icon             | text         | YES  |     | NULL    |
| color            | varchar(50)  | YES  |     | NULL    | ← Màu nền thẻ
| text_color       | varchar(20)  | YES  |     | #FFFFFF | ← MỚI: Màu chữ
| is_active        | tinyint(1)   | NO   |     | 1       |
| display_order    | int          | NO   |     | 0       |
| created_at       | datetime     | NO   |     | NULL    |
| updated_at       | datetime     | NO   |     | NULL    |
| background_image | varchar(500) | YES  |     | NULL    |
+------------------+--------------+------+-----+---------+
```

### 2. Backend Model
Cập nhật `Statistic.java`:

```java
@Column(name = "text_color", length = 20)
private String textColor = "#FFFFFF";
```

### 3. Frontend CMS
Thêm color picker cho màu chữ trong `AdminCMSPage.js`:

**State Management:**
```jsx
const [currentTextColor, setCurrentTextColor] = useState('#FFFFFF');
```

**Form Field:**
```jsx
<Form.Item name="textColor" label="Màu chữ" rules={[{ required: true }]}>
  <Space.Compact style={{ width: '100%' }}>
    <Input 
      type="color" 
      value={currentTextColor}
      style={{ width: 80, height: 40 }} 
      onChange={(e) => {
        const newColor = e.target.value;
        setCurrentTextColor(newColor);
        form.setFieldsValue({ textColor: newColor });
      }}
    />
    <Input 
      placeholder="#FFFFFF" 
      value={currentTextColor}
      style={{ flex: 1 }}
      onChange={(e) => {
        const newColor = e.target.value;
        setCurrentTextColor(newColor);
        form.setFieldsValue({ textColor: newColor });
      }}
    />
  </Space.Compact>
  <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
    Màu chữ số liệu và nhãn (mặc định: #FFFFFF - trắng)
  </div>
</Form.Item>
```

### 4. Frontend HomePage
Cập nhật hiển thị để sử dụng `textColor`:

```jsx
<div style={{ 
  fontSize: 48, 
  fontWeight: 700, 
  color: stat.textColor || '#FFD700',  // ← Sử dụng textColor từ DB
  marginBottom: 12,
  lineHeight: 1,
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
}}>
  {stat.value}
</div>
<div style={{ 
  fontSize: 16, 
  fontWeight: 500,
  color: stat.textColor || '#fff',  // ← Sử dụng textColor từ DB
  lineHeight: 1.4
}}>
  {stat.label}
</div>
```

## 🎨 Cách sử dụng

### Bước 1: Vào CMS
1. Truy cập: http://localhost:3000/admin/cms
2. Chuyển sang tab **"Thống kê"**

### Bước 2: Chỉnh màu
1. Click **Edit** một thẻ thống kê
2. Thấy 2 color pickers:
   - **Màu sắc thẻ**: Màu nền của thẻ (ví dụ: #1890ff - xanh)
   - **Màu chữ**: Màu của số liệu và nhãn (ví dụ: #FFFFFF - trắng)
3. Chọn màu chữ phù hợp với màu nền
4. Click **OK** để lưu

### Bước 3: Kiểm tra
1. Vào trang chủ: http://localhost:3000
2. Scroll xuống section **"MEDLATEC TRONG SỐ LIỆU"**
3. ✅ Thẻ hiển thị với màu chữ đã chọn

## 💡 Gợi ý phối màu

### Nền tối → Chữ sáng
```
Màu nền: #1890ff (xanh dương)
Màu chữ: #FFFFFF (trắng)
```

### Nền sáng → Chữ tối
```
Màu nền: #FFD700 (vàng)
Màu chữ: #000000 (đen)
```

### Nền xanh lá → Chữ trắng
```
Màu nền: #10b981 (xanh lá)
Màu chữ: #FFFFFF (trắng)
```

### Nền đỏ → Chữ trắng
```
Màu nền: #ef4444 (đỏ)
Màu chữ: #FFFFFF (trắng)
```

### Nền tím → Chữ vàng
```
Màu nền: #8b5cf6 (tím)
Màu chữ: #FFD700 (vàng)
```

## 🧪 Test Cases

### Test 1: Màu chữ trắng trên nền xanh
1. Edit thẻ thống kê
2. Màu nền: **#1890ff**
3. Màu chữ: **#FFFFFF**
4. Lưu và kiểm tra → ✅ Chữ trắng rõ ràng trên nền xanh

### Test 2: Màu chữ đen trên nền vàng
1. Edit thẻ thống kê
2. Màu nền: **#FFD700**
3. Màu chữ: **#000000**
4. Lưu và kiểm tra → ✅ Chữ đen nổi bật trên nền vàng

### Test 3: Màu chữ vàng trên nền tím
1. Edit thẻ thống kê
2. Màu nền: **#8b5cf6**
3. Màu chữ: **#FFD700**
4. Lưu và kiểm tra → ✅ Chữ vàng sang trọng trên nền tím

### Test 4: Edit nhiều thẻ liên tiếp
1. Edit thẻ 1 → Màu chữ: **#FFFFFF**
2. Edit thẻ 2 → Màu chữ: **#FFD700**
3. Edit thẻ 3 → Màu chữ: **#000000**
4. ✅ Mỗi thẻ có màu chữ riêng, không bị lẫn

## 📊 So sánh Before/After

### ❌ Before
- Màu chữ cố định: `#FFD700` (vàng) cho số liệu, `#fff` (trắng) cho nhãn
- Không thể thay đổi
- Không linh hoạt với các màu nền khác nhau

### ✅ After
- Màu chữ tùy chỉnh cho từng thẻ
- Có thể chọn màu phù hợp với màu nền
- Linh hoạt, dễ đọc, đẹp mắt hơn

## 🎨 Thiết kế UI

### CMS Form
```
┌─────────────────────────────────────┐
│ Nhãn: [Khách hàng mỗi năm        ] │
│ Giá trị: [4,000,000+             ] │
│                                     │
│ Màu sắc thẻ:                       │
│ [🎨] [#1890ff                    ] │
│ ↑ Màu nền của thẻ                  │
│                                     │
│ Màu chữ:                           │
│ [🎨] [#FFFFFF                    ] │
│ ↑ Màu chữ số liệu và nhãn          │
│                                     │
│ Thứ tự: [0]                        │
│ Kích hoạt: [✓]                     │
└─────────────────────────────────────┘
```

### HomePage Display
```
┌─────────────────────────────────────┐
│  ╔═══════════════════════════════╗  │
│  ║  Background: #1890ff          ║  │
│  ║                               ║  │
│  ║     4,000,000+                ║  │ ← textColor
│  ║  Khách hàng mỗi năm           ║  │ ← textColor
│  ║                               ║  │
│  ╚═══════════════════════════════╝  │
└─────────────────────────────────────┘
```

## 📁 Files đã sửa

### Database
- `database/add_statistics_text_color.sql` - SQL script
- `run_add_statistics_text_color.bat` - Batch file

### Backend
- `backend/src/main/java/com/doctorappointment/model/Statistic.java` - Thêm field `textColor`

### Frontend
- `frontend/src/pages/AdminCMSPage.js` - Thêm color picker cho màu chữ
- `frontend/src/pages/HomePage.js` - Sử dụng `textColor` từ DB

## 🔧 API

### Request (Create/Update)
```json
{
  "label": "Khách hàng mỗi năm",
  "value": "4,000,000+",
  "color": "#1890ff",
  "textColor": "#FFFFFF",
  "isActive": true,
  "displayOrder": 0
}
```

### Response (Get)
```json
{
  "id": 1,
  "label": "Khách hàng mỗi năm",
  "value": "4,000,000+",
  "color": "#1890ff",
  "textColor": "#FFFFFF",
  "isActive": true,
  "displayOrder": 0,
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00"
}
```

## 🎉 Kết quả
Bây giờ bạn có thể:
- ✅ Chỉnh màu chữ riêng cho từng thẻ thống kê
- ✅ Phối màu chữ phù hợp với màu nền
- ✅ Tạo thiết kế đa dạng, bắt mắt hơn
- ✅ Đảm bảo chữ luôn dễ đọc trên mọi màu nền

---

**Trạng thái:** ✅ HOÀN THÀNH
**Backend:** ✅ Đang chạy (Process ID: 12)
**Frontend:** ✅ Đang chạy (Process ID: 2)
**Database:** ✅ Đã thêm cột `text_color`
