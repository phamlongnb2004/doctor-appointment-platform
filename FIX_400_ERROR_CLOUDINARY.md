# 🔧 Fix Lỗi 400 Bad Request Khi Upload Ảnh

## ❌ LỖI HIỆN TẠI

```
POST https://doctor-appointment-backend-mq2p.onrender.com/api/users/6/profile-image 400 (Bad Request)
```

## 🔍 NGUYÊN NHÂN CÓ THỂ

### 1. Cloudinary Chưa Được Khởi Tạo (Khả năng cao nhất)
- Chưa set environment variables trên Render
- Hoặc set sai tên biến
- Hoặc Cloudinary disabled

### 2. Cloudinary Credentials Sai
- API Key hoặc API Secret không đúng
- Cloud name sai

### 3. File Validation Failed
- File quá lớn (> 10MB)
- File type không hợp lệ

## 🔍 KIỂM TRA NGAY

### Bước 1: Xem Render Logs (QUAN TRỌNG!)

1. Vào: https://dashboard.render.com
2. Chọn: doctor-appointment-backend-mq2p
3. Tab: **Logs**
4. Tìm dòng khi bạn upload ảnh

**Tìm các dòng sau:**

#### Nếu thấy:
```
⚠️ Cloudinary disabled - using local storage
```
→ **Cloudinary chưa được enable!**

#### Nếu thấy:
```
✅ Cloudinary initialized with cloud name: your-cloud-name
```
→ Cloudinary đã khởi tạo OK

#### Nếu thấy:
```
📤 Uploading profile image to Cloudinary for user: 6
❌ Error uploading image to Cloudinary
```
→ Có lỗi khi upload, xem chi tiết lỗi bên dưới

### Bước 2: Kiểm Tra Environment Variables

Vào Render Dashboard → Environment, kiểm tra có **4 biến** sau:

```
CLOUDINARY_ENABLED=true
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

**Lưu ý:**
- Tên biến phải chính xác (không có space)
- Giá trị không có dấu ngoặc kép
- Không có space thừa ở đầu/cuối

## ✅ GIẢI PHÁP

### Giải Pháp 1: Set Environment Variables (Nếu chưa set)

1. **Đăng ký Cloudinary** (nếu chưa):
   - https://cloudinary.com/users/register/free
   - Lấy Cloud name, API Key, API Secret

2. **Set trên Render:**
   ```
   CLOUDINARY_ENABLED=true
   CLOUDINARY_CLOUD_NAME=<paste-your-cloud-name>
   CLOUDINARY_API_KEY=<paste-your-api-key>
   CLOUDINARY_API_SECRET=<paste-your-api-secret>
   ```

3. **Save Changes** → Render sẽ restart

4. **Đợi 2-3 phút** cho Render restart xong

5. **Test lại** upload ảnh

### Giải Pháp 2: Kiểm Tra Lại Credentials (Nếu đã set)

1. Vào Cloudinary Dashboard: https://cloudinary.com/console
2. Copy lại Cloud name, API Key, API Secret
3. So sánh với giá trị trên Render
4. Nếu khác → Update lại
5. Save Changes

### Giải Pháp 3: Tạm Thời Disable Cloudinary (Fallback)

Nếu cần test ngay mà chưa setup Cloudinary:

1. Vào Render Environment
2. Set: `CLOUDINARY_ENABLED=false`
3. Save Changes
4. Hệ thống sẽ dùng local storage (ảnh sẽ mất khi restart nhưng có thể test được)

## 🧪 DEBUG STEPS

### Step 1: Xem Logs Chi Tiết

Sau khi upload ảnh, xem Render logs và tìm:

```
=== Upload Request ===
User ID: 6
File: xxx.webp
Size: 35694 bytes
```

Sau đó tìm:
```
✅ Cloudinary initialized
📤 Uploading profile image to Cloudinary
```

Hoặc:
```
⚠️ Cloudinary disabled
📤 Uploading profile image to local storage
```

### Step 2: Test API Trực Tiếp

Dùng Postman hoặc curl:

```bash
curl -X POST \
  https://doctor-appointment-backend-mq2p.onrender.com/api/users/6/profile-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

Xem response error message cụ thể.

### Step 3: Kiểm Tra Backend Logs

Tìm stack trace trong logs để biết lỗi chính xác:
- `IllegalStateException: Cloudinary is not enabled`
- `IOException: Failed to upload image`
- `IllegalArgumentException: File must be an image`

## 📋 CHECKLIST DEBUG

- [ ] Xem Render logs có dòng "Cloudinary initialized"?
- [ ] Kiểm tra 4 environment variables đã set đúng?
- [ ] Cloud name, API Key, API Secret có đúng không?
- [ ] Render đã restart sau khi set env vars?
- [ ] File upload có đúng format (image/webp, image/jpeg, etc.)?
- [ ] File size < 10MB?

## 🎯 EXPECTED LOGS (Khi Thành Công)

```
✅ Cloudinary initialized with cloud name: your-cloud-name
📤 Uploading profile image to Cloudinary for user: 6
✅ Image uploaded successfully to Cloudinary: https://res.cloudinary.com/...
```

## 📞 NEXT STEPS

1. **Xem Render logs ngay** và cho tôi biết bạn thấy gì
2. **Kiểm tra Environment variables** có đủ 4 biến không
3. **Nếu chưa set** → Set ngay theo hướng dẫn trên
4. **Nếu đã set** → Copy logs lỗi cho tôi xem

---

**Dự đoán:** 99% là chưa set environment variables hoặc set sai tên biến.
**Giải pháp:** Set đúng 4 biến trên Render và restart.
