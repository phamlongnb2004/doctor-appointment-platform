# Color Picker & Image Upload - Admin CMS ✅

## Tổng quan

Admin CMS giờ đã có:
1. **Color Picker** - Chọn màu bằng bảng màu thay vì nhập text
2. **Image Upload** - Upload hình ảnh cho icon thay vì chỉ dùng emoji

---

## ✅ Các tab đã cập nhật

### 1. **Tiện ích cho khách hàng** (services)
- ✅ Color Picker cho màu sắc
- Icon vẫn dùng Icon Class (Calendar, Dollar, etc.)

### 2. **Tại sao chọn MEDLATEC?** (features)
- ✅ Upload hình ảnh hoặc emoji cho icon
- Màu gradient vẫn nhập text (vì phức tạp)

### 3. **Các chuyên khoa y tế** (specialties)
- ✅ Upload hình ảnh hoặc emoji cho icon
- ✅ Color Picker cho màu sắc

### 4. **MEDLATEC trong số liệu** (statistics)
- ✅ Upload hình ảnh hoặc emoji cho icon (tùy chọn)
- ✅ Color Picker cho màu sắc

### 5. **Chứng nhận & Giải thưởng** (certifications)
- ✅ Upload hình ảnh hoặc emoji cho icon
- ✅ Color Picker cho màu sắc

---

## 🎨 Cách sử dụng Color Picker

### Khi thêm/sửa item:

1. Click vào ô **"Màu sắc"**
2. Bảng màu sẽ hiện ra
3. Chọn màu bằng cách:
   - Click vào màu trong bảng
   - Kéo thanh trượt để chọn độ sáng
   - Hoặc nhập mã màu hex (ví dụ: #1890ff)
4. Màu đã chọn sẽ tự động cập nhật

### Ví dụ màu phổ biến:
- **Xanh dương**: #1890ff
- **Xanh lá**: #52c41a
- **Cam**: #fa8c16
- **Tím**: #722ed1
- **Hồng**: #eb2f96
- **Vàng**: #FFD700

---

## 📸 Cách sử dụng Image Upload

### Khi thêm/sửa item:

#### Cách 1: Upload hình ảnh
1. Click nút **"Upload Icon"**
2. Chọn file hình ảnh từ máy tính (PNG, JPG, SVG, etc.)
3. Hình ảnh sẽ được upload lên server
4. Preview hình ảnh sẽ hiện ra
5. URL hình ảnh tự động điền vào form

#### Cách 2: Nhập emoji
1. Bỏ qua nút "Upload Icon"
2. Nhập emoji trực tiếp vào ô input
3. Ví dụ: 🫁, 🏆, 📊, 👨‍⚕️

#### Cách 3: Nhập URL hình ảnh
1. Nếu đã có URL hình ảnh sẵn
2. Paste URL vào ô input
3. Ví dụ: https://example.com/icon.png

### Lưu ý:
- Hình ảnh nên có kích thước nhỏ (< 100KB)
- Định dạng: PNG, JPG, SVG
- Kích thước đề xuất: 64x64px hoặc 128x128px
- Nền trong suốt (PNG) sẽ đẹp hơn

---

## 🖼️ Hiển thị trên Trang chủ

### Icon sẽ hiển thị như thế nào?

#### Nếu là hình ảnh (URL):
```
<img src="http://..." style="width: 40px; height: 40px" />
```

#### Nếu là emoji:
```
<span style="font-size: 32px">🫁</span>
```

### Tự động nhận diện:
- Nếu icon bắt đầu bằng `http` → Hiển thị như hình ảnh
- Nếu không → Hiển thị như emoji

---

## 📋 Ví dụ sử dụng

### Ví dụ 1: Chuyên khoa với hình ảnh
```
Tên: Chuyên khoa Tim mạch
Icon: [Upload hình tim.png]
Màu sắc: [Chọn màu đỏ #f5222d]
```

### Ví dụ 2: Chuyên khoa với emoji
```
Tên: Chuyên khoa Nội
Icon: 🫁 (nhập emoji)
Màu sắc: [Chọn màu xanh #1890ff]
```

### Ví dụ 3: Thống kê với icon
```
Nhãn: Năm kinh nghiệm
Giá trị: 30+
Icon: [Upload hình calendar.png] hoặc 📅
Màu sắc: [Chọn màu vàng #FFD700]
```

### Ví dụ 4: Chứng nhận
```
Tên: ISO 15189:2022
Icon: [Upload logo ISO.png] hoặc 🏆
Màu sắc: [Chọn màu xanh #1890ff]
```

---

## 🔧 Kỹ thuật

### Upload endpoint:
```
POST http://localhost:8080/api/images/articles
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

### Response:
```
http://localhost:8080/uploads/articles/{userId}/{filename}
```

### Lưu trữ:
- Hình ảnh được lưu trong folder: `backend/uploads/articles/{userId}/`
- Mỗi user có folder riêng
- Filename được tạo random UUID để tránh trùng

---

## 🎯 Lợi ích

### Color Picker:
- ✅ Dễ chọn màu hơn (không cần nhớ mã màu)
- ✅ Xem trước màu ngay lập tức
- ✅ Chuyên nghiệp hơn
- ✅ Giảm lỗi nhập sai mã màu

### Image Upload:
- ✅ Có thể dùng logo/icon chuyên nghiệp
- ✅ Không bị giới hạn bởi emoji
- ✅ Tùy chỉnh icon theo brand
- ✅ Vẫn có thể dùng emoji nếu muốn

---

## ⚠️ Lưu ý

### Color Picker:
- Chỉ áp dụng cho màu đơn (solid color)
- Màu gradient vẫn phải nhập text (vì phức tạp)
- Ví dụ gradient: `linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)`

### Image Upload:
- Cần đăng nhập (có token) mới upload được
- File size tối đa: 10MB (có thể config)
- Chỉ chấp nhận file ảnh (image/*)
- Nếu upload lỗi, vẫn có thể nhập emoji

### Hiển thị:
- Icon hình ảnh sẽ được resize về kích thước cố định
- Icon emoji sẽ hiển thị với font-size lớn
- Cả 2 đều hiển thị đẹp trên trang chủ

---

## 🚀 Hướng dẫn nhanh

### Để thêm chuyên khoa mới:
1. Vào tab **"Các chuyên khoa y tế"**
2. Click **"Thêm chuyên khoa"**
3. Nhập tên: "Chuyên khoa Tim mạch"
4. Click **"Upload Icon"** → Chọn file hình tim
5. Click vào **"Màu sắc"** → Chọn màu đỏ
6. Nhập thứ tự: 1
7. Bật **"Kích hoạt"**
8. Click **"OK"**

### Để sửa màu sắc:
1. Click icon ✏️ (Edit) ở hàng muốn sửa
2. Click vào ô **"Màu sắc"**
3. Chọn màu mới từ bảng màu
4. Click **"OK"**

### Để thay icon:
1. Click icon ✏️ (Edit)
2. Click **"Upload Icon"** → Chọn hình mới
3. Hoặc xóa URL cũ và nhập emoji mới
4. Click **"OK"**

---

## 📊 So sánh Trước vs Sau

### Trước:
```
Màu sắc: [Input text] #1890ff
Icon: [Input text] 🫁
```
- Khó chọn màu
- Phải nhớ mã màu
- Chỉ dùng được emoji

### Sau:
```
Màu sắc: [Color Picker] 🎨
Icon: [Upload Button] 📤 hoặc [Input text] 🫁
```
- Dễ chọn màu
- Xem trước ngay
- Có thể upload hình ảnh chuyên nghiệp

---

**Ngày cập nhật:** 3 tháng 2, 2026
**Trạng thái:** ✅ Hoàn thành
**Áp dụng cho:** Services, Features, Specialties, Statistics, Certifications
