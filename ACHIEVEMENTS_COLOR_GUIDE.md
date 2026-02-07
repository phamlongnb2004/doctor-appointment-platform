# Hướng dẫn Nhanh: Tùy chỉnh Màu sắc Achievements

## 🎨 Tính năng mới

Bây giờ bạn có thể tùy chỉnh màu sắc cho section "Con số ấn tượng":

### 3 Màu có thể chỉnh

1. **Màu tiêu đề** - Màu của text "Con số ấn tượng"
2. **Màu chữ số liệu** - Màu của số và text achievements
3. **Màu overlay** - Lớp phủ trên ảnh nền (giúp text dễ đọc)

---

## 📍 Vị trí trong CMS

```
Admin CMS
  └─ Tab "Giới thiệu"
      └─ Sub-tab "Achievements"
          └─ Card "Cài đặt Section"
              ├─ Tiêu đề Section
              ├─ Ảnh nền Section
              └─ 3 Color Pickers ⬅️ MỚI!
```

---

## 🎯 Cách sử dụng

### Bước 1: Mở CMS
```
http://localhost:3000/admin-cms
→ Tab "Giới thiệu"
→ Sub-tab "Achievements"
```

### Bước 2: Chọn màu
```
┌─────────────────────────────────────┐
│ Màu tiêu đề:    [🎨 #FFFFFF]       │
│ Màu chữ số:     [🎨 #FFFFFF]       │
│ Màu overlay:    [Dropdown ▼]       │
└─────────────────────────────────────┘
```

### Bước 3: Lưu
```
[Lưu cài đặt Section] ← Click đây
```

### Bước 4: Xem kết quả
```
http://localhost:3000/about
→ Scroll xuống section "Con số ấn tượng"
```

---

## 💡 Gợi ý Màu sắc

### Trường hợp 1: Ảnh nền SÁNG
```
Ví dụ: Ảnh bệnh viện trắng, phòng khám sáng

✅ Màu tiêu đề: #FFFFFF (trắng)
✅ Màu chữ số: #FFFFFF (trắng)
✅ Overlay: Đen 70% ← Quan trọng!

Lý do: Overlay tối giúp text trắng dễ đọc trên nền sáng
```

### Trường hợp 2: Ảnh nền TỐI
```
Ví dụ: Ảnh y tế tối, phòng mổ

✅ Màu tiêu đề: #FFFFFF (trắng)
✅ Màu chữ số: #FFFFFF (trắng)
✅ Overlay: Không có overlay

Lý do: Nền đã tối, không cần overlay thêm
```

### Trường hợp 3: Ảnh nền XANH
```
Ví dụ: Ảnh y tế màu xanh lá, xanh dương

✅ Màu tiêu đề: #FFD700 (vàng gold)
✅ Màu chữ số: #FFD700 (vàng gold)
✅ Overlay: Đen 50%

Lý do: Vàng nổi bật trên nền xanh
```

### Trường hợp 4: Không có ảnh (Gradient)
```
Dùng gradient xanh tím mặc định

✅ Màu tiêu đề: #FFFFFF (trắng)
✅ Màu chữ số: #FFFFFF (trắng)
✅ Overlay: Xanh tím 50%

Lý do: Tạo hiệu ứng gradient đẹp hơn
```

---

## 🎨 Bảng Màu Gợi ý

### Màu Trắng & Sáng
```
#FFFFFF - Trắng (phổ biến nhất)
#F0F0F0 - Trắng xám
#FFFACD - Vàng nhạt
```

### Màu Vàng & Cam
```
#FFD700 - Vàng gold
#FFA500 - Cam
#FF8C00 - Cam đậm
```

### Màu Xanh
```
#00CED1 - Xanh ngọc
#1E90FF - Xanh dương
#32CD32 - Xanh lá
```

### Màu Đỏ & Hồng
```
#FF6B6B - Đỏ nhạt
#FF1493 - Hồng đậm
#DC143C - Đỏ crimson
```

---

## ⚠️ Lưu ý

### DO ✅
- Chọn màu có contrast tốt với background
- Dùng overlay khi ảnh nền quá sáng
- Test trên nhiều màn hình khác nhau
- Giữ màu tiêu đề và màu chữ giống nhau (hoặc tương tự)

### DON'T ❌
- Không dùng màu quá nhạt trên nền sáng
- Không dùng màu quá tối trên nền tối
- Không dùng quá nhiều màu khác nhau
- Không bỏ qua overlay khi cần thiết

---

## 🔧 Troubleshooting

### Vấn đề: Text không đọc được
```
Nguyên nhân: Màu text và background quá giống nhau
Giải pháp: 
  1. Đổi màu text sang màu tương phản
  2. Thêm overlay tối hơn
```

### Vấn đề: Màu không lưu
```
Nguyên nhân: Chưa click "Lưu cài đặt Section"
Giải pháp: Click nút "Lưu cài đặt Section" sau khi chọn màu
```

### Vấn đề: Overlay quá tối
```
Nguyên nhân: Chọn overlay 70% trên ảnh đã tối
Giải pháp: Giảm xuống 30% hoặc không dùng overlay
```

---

## 📱 Preview

### Desktop
```
┌─────────────────────────────────────────┐
│   [Ảnh nền với overlay]                 │
│                                         │
│   Con số ấn tượng (màu tùy chỉnh)      │
│                                         │
│   500000+    200+    50+    15         │
│   (màu tùy chỉnh)                      │
└─────────────────────────────────────────┘
```

### Mobile
```
┌──────────────────┐
│ [Ảnh nền]        │
│                  │
│ Con số ấn tượng  │
│                  │
│ 500000+  200+    │
│ 50+      15      │
└──────────────────┘
```

---

## ✅ Checklist

Trước khi publish:
- [ ] Chọn màu tiêu đề phù hợp
- [ ] Chọn màu chữ số dễ đọc
- [ ] Điều chỉnh overlay nếu cần
- [ ] Click "Lưu cài đặt Section"
- [ ] Test trên trang /about
- [ ] Kiểm tra trên mobile
- [ ] Đảm bảo text dễ đọc

---

## 🎓 Tips Pro

1. **Dùng công cụ kiểm tra contrast**: 
   - WebAIM Contrast Checker
   - Đảm bảo ratio ≥ 4.5:1

2. **Test với nhiều ảnh nền**:
   - Ảnh sáng, tối, màu sắc khác nhau
   - Đảm bảo màu text hoạt động tốt với tất cả

3. **Giữ đơn giản**:
   - Thường thì trắng (#FFFFFF) là lựa chọn tốt nhất
   - Chỉ dùng màu khác khi cần nổi bật

4. **Overlay là bạn**:
   - Khi không chắc, dùng overlay Đen 50%
   - Giúp text luôn dễ đọc

---

## 🚀 Kết quả

Với 3 color pickers đơn giản, bạn có thể:
- ✅ Tạo vô số phong cách khác nhau
- ✅ Phù hợp với mọi loại ảnh nền
- ✅ Đảm bảo text luôn dễ đọc
- ✅ Không cần biết code!

**Hãy thử ngay tại: http://localhost:3000/admin-cms**
