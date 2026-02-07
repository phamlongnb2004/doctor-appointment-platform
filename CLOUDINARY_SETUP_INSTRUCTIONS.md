# ☁️ Hướng Dẫn Setup Cloudinary - QUAN TRỌNG!

## ✅ ĐÃ HOÀN THÀNH

1. ✅ Thêm Cloudinary dependency vào `pom.xml`
2. ✅ Tạo `CloudinaryService.java` - Service xử lý upload/delete ảnh
3. ✅ Update `ImageService.java` - Tích hợp Cloudinary với fallback local
4. ✅ Update `application.yml` - Config cho local (disabled)
5. ✅ Update `application-prod.yml` - Config cho production (enabled)
6. ✅ Test compile thành công

## 🎯 BƯỚC TIẾP THEO - BẠN CẦN LÀM

### Bước 1: Đăng Ký Cloudinary (5 phút)

1. **Truy cập:** https://cloudinary.com/users/register/free
2. **Đăng ký** với email hoặc Google
3. **Xác nhận email** (check inbox)
4. **Đăng nhập:** https://cloudinary.com/console

### Bước 2: Lấy Credentials (2 phút)

1. Sau khi đăng nhập, bạn sẽ thấy **Dashboard**
2. Tìm phần **Account Details** (góc trên bên phải)
3. Copy 3 thông tin sau:

```
Cloud name: xxxxxx
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz
```

**⚠️ LƯU Ý:** 
- Giữ **API Secret** bí mật!
- Không commit vào Git!
- Chỉ set trên Render Environment Variables

### Bước 3: Set Environment Variables Trên Render (3 phút)

1. **Truy cập:** https://dashboard.render.com
2. **Chọn service:** doctor-appointment-backend-mq2p
3. **Vào tab:** Environment
4. **Thêm 3 biến sau:**

```bash
CLOUDINARY_ENABLED=true
CLOUDINARY_CLOUD_NAME=your-cloud-name-here
CLOUDINARY_API_KEY=your-api-key-here
CLOUDINARY_API_SECRET=your-api-secret-here
```

**Thay thế:**
- `your-cloud-name-here` → Cloud name từ Cloudinary
- `your-api-key-here` → API Key từ Cloudinary
- `your-api-secret-here` → API Secret từ Cloudinary

5. **Click:** Save Changes

**Render sẽ tự động restart service.**

### Bước 4: Deploy Code Mới (2 phút)

Code đã sẵn sàng, chỉ cần commit và push:

```bash
git add .
git commit -m "feat: Integrate Cloudinary for permanent image storage

- Add Cloudinary dependency (cloudinary-http44:1.36.0)
- Create CloudinaryService for image upload/delete
- Update ImageService to use Cloudinary in production
- Add configuration for Cloudinary credentials
- Images now stored permanently on Cloudinary CDN
- Fallback to local storage when Cloudinary disabled
- Fix ephemeral filesystem issue on Render

Benefits:
- Images never lost on restart
- Fast CDN delivery worldwide
- Auto image optimization
- Free tier: 25GB storage, 25GB bandwidth/month"

git push origin main
```

### Bước 5: Verify Deployment (5 phút)

1. **Xem Render Logs:**
   - Vào tab **Logs**
   - Tìm dòng: `✅ Cloudinary initialized with cloud name: your-cloud-name`
   - Nếu thấy → ✅ Cloudinary đã kết nối thành công

2. **Test Upload:**
   - Mở điện thoại
   - Truy cập: https://doctor-appointment-frontend-ujug.onrender.com
   - Đăng nhập
   - Vào Profile
   - Upload ảnh mới

3. **Kiểm Tra URL:**
   - Sau khi upload, xem URL của ảnh
   - Phải có dạng: `https://res.cloudinary.com/your-cloud-name/image/upload/...`
   - Nếu đúng → ✅ Đang dùng Cloudinary

4. **Test Persistence:**
   - Restart Render service (Manual Deploy → Deploy latest commit)
   - Refresh trang profile
   - Ảnh vẫn hiển thị → ✅ Thành công!

## 📊 SO SÁNH TRƯỚC VÀ SAU

### Trước (Local Storage)
```
❌ Upload → Lưu vào /tmp/uploads
❌ Render restart → File bị xóa
❌ Refresh trang → Ảnh mất
❌ URL: https://doctor-appointment-backend-mq2p.onrender.com/api/images/...
```

### Sau (Cloudinary)
```
✅ Upload → Lưu vào Cloudinary CDN
✅ Render restart → File vẫn còn
✅ Refresh trang → Ảnh vẫn hiển thị
✅ URL: https://res.cloudinary.com/your-cloud-name/image/upload/...
✅ Load nhanh từ CDN toàn cầu
✅ Tự động optimize ảnh
```

## 🎯 CHECKLIST

### Setup Cloudinary
- [ ] Đăng ký Cloudinary account
- [ ] Lấy Cloud name, API Key, API Secret
- [ ] Set 3 environment variables trên Render
- [ ] Save changes (Render sẽ restart)

### Deploy Code
- [ ] Git commit
- [ ] Git push
- [ ] Xem Render logs
- [ ] Tìm dòng "Cloudinary initialized"

### Test
- [ ] Upload ảnh từ mobile
- [ ] Kiểm tra URL có "cloudinary.com"
- [ ] Restart Render service
- [ ] Kiểm tra ảnh vẫn hiển thị

## ⚠️ TROUBLESHOOTING

### Lỗi: "Cloudinary is not enabled"
**Nguyên nhân:** Chưa set environment variables hoặc set sai

**Giải pháp:**
1. Kiểm tra Render Environment có 3 biến: `CLOUDINARY_ENABLED`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
2. Kiểm tra giá trị đúng không (không có space thừa)
3. Save changes và đợi restart

### Lỗi: "Invalid credentials"
**Nguyên nhân:** API Key hoặc API Secret sai

**Giải pháp:**
1. Vào Cloudinary Dashboard
2. Copy lại credentials
3. Update trên Render
4. Save changes

### Logs hiển thị: "⚠️ Cloudinary disabled - using local storage"
**Nguyên nhân:** `CLOUDINARY_ENABLED=false` hoặc thiếu credentials

**Giải pháp:**
1. Set `CLOUDINARY_ENABLED=true`
2. Đảm bảo có đủ 3 biến credentials
3. Save changes

### Upload thành công nhưng vẫn dùng local storage
**Kiểm tra:**
1. Xem URL của ảnh sau khi upload
2. Nếu URL có `/api/images/` → Đang dùng local
3. Nếu URL có `cloudinary.com` → Đang dùng Cloudinary

**Giải pháp:**
- Xem logs có dòng "Cloudinary initialized" không
- Nếu không → Chưa set đúng environment variables

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Xem Render logs để biết lỗi cụ thể
2. Kiểm tra environment variables đã set đúng chưa
3. Kiểm tra Cloudinary Dashboard có hoạt động không
4. Cho tôi biết lỗi cụ thể, tôi sẽ giúp debug

## 🎉 KẾT QUẢ MONG ĐỢI

Sau khi hoàn thành:
- ✅ Upload ảnh từ mobile → Lưu vào Cloudinary
- ✅ Ảnh hiển thị ngay lập tức
- ✅ Restart Render → Ảnh vẫn còn
- ✅ Load nhanh từ CDN
- ✅ Không bao giờ mất ảnh nữa!

---

**Timeline:** 15-20 phút tổng cộng
**Khó:** ⭐⭐☆☆☆ (Dễ, chỉ cần copy-paste)
**Quan trọng:** ⭐⭐⭐⭐⭐ (Rất quan trọng!)

**Bắt đầu ngay:** https://cloudinary.com/users/register/free
