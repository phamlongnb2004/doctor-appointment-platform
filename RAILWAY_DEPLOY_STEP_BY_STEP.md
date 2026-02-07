# 🎬 Hướng Dẫn Deploy Railway - Từng Bước Chi Tiết

## ✅ Bạn đã hoàn thành:
- [x] Push code lên GitHub
- [x] Tạo MySQL database trên Railway
- [x] Lấy thông tin MySQL (MYSQLHOST, MYSQLPORT, etc.)

---

## 🚀 TIẾP THEO: Deploy Backend

### Bước 1: Quay về trang Project
📍 **Vị trí:** Bạn đang ở trong MySQL service

**Làm gì:**
- Nhìn lên **góc trên bên trái**
- Bạn sẽ thấy tên project (ví dụ: "natural-flow" hoặc "production")
- **Click vào tên project đó**

**Kết quả:** Bạn sẽ thấy trang project với MySQL service box

---

### Bước 2: Thêm Backend Service
📍 **Vị trí:** Trang project chính

**Làm gì:**
- Nhìn lên **góc trên bên phải**
- Tìm nút **"+ Create"** hoặc **"+ New"**
- **Click vào nút đó**

**Kết quả:** Hiện menu với các lựa chọn

---

### Bước 3: Chọn GitHub Repo
📍 **Vị trí:** Menu vừa hiện ra

**Làm gì:**
- Trong menu, tìm và **click "GitHub Repo"**
- (KHÔNG chọn Database, Template, hay Docker Image)

**Kết quả:** Hiện danh sách repositories từ GitHub của bạn

---

### Bước 4: Chọn Repository
📍 **Vị trí:** Danh sách repositories

**Làm gì:**
- Tìm repository: **"doctor-appointment-platform"**
- **Click vào repository đó**

**Kết quả:** Railway bắt đầu tạo service mới

---

### Bước 5: Đợi Service Được Tạo
📍 **Vị trí:** Trang project

**Làm gì:**
- **Đợi 10-20 giây**
- Bạn sẽ thấy một **box mới** xuất hiện (bên cạnh MySQL)
- Box này có tên repository của bạn

**Kết quả:** Service mới đã được tạo (có thể đang build)

---

### Bước 6: Cấu Hình Backend Service
📍 **Vị trí:** Trang project

**Làm gì:**
- **Click vào box service mới** (box có tên repository)

**Kết quả:** Vào trang chi tiết service

---

### Bước 7: Set Root Directory
📍 **Vị trí:** Trong service vừa tạo

**Làm gì:**
1. Tìm tab **"Settings"** (menu bên trái hoặc trên cùng)
2. **Click vào "Settings"**
3. Scroll xuống tìm **"Root Directory"**
4. Click vào ô input
5. Nhập: **`backend`**
6. **Enter** hoặc click ra ngoài để lưu

**Kết quả:** Railway biết build từ folder backend

---

### Bước 8: Thêm Environment Variables
📍 **Vị trí:** Trong service backend

**Làm gì:**
1. Tìm tab **"Variables"** (menu bên trái)
2. **Click vào "Variables"**
3. Click nút **"+ New Variable"** hoặc **"Add Variable"**

**Thêm từng biến sau:**

#### Biến 1: SPRING_DATASOURCE_URL
```
Tên: SPRING_DATASOURCE_URL
Giá trị: jdbc:mysql://[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]
```
**Thay thế:**
- `[MYSQLHOST]` = giá trị MYSQLHOST bạn đã copy
- `[MYSQLPORT]` = giá trị MYSQLPORT bạn đã copy
- `[MYSQLDATABASE]` = giá trị MYSQLDATABASE bạn đã copy

**Ví dụ:**
```
jdbc:mysql://monorail.proxy.rlwy.net:12345/railway
```

#### Biến 2: SPRING_DATASOURCE_USERNAME
```
Tên: SPRING_DATASOURCE_USERNAME
Giá trị: [MYSQLUSER bạn đã copy]
```

#### Biến 3: SPRING_DATASOURCE_PASSWORD
```
Tên: SPRING_DATASOURCE_PASSWORD
Giá trị: [MYSQLPASSWORD bạn đã copy]
```

#### Biến 4: CORS_ORIGINS
```
Tên: CORS_ORIGINS
Giá trị: http://localhost:3000
```
(Sẽ update sau khi có frontend URL)

#### Biến 5: PORT
```
Tên: PORT
Giá trị: 8080
```

**Kết quả:** Có 5 biến trong danh sách Variables

---

### Bước 9: Deploy Backend
📍 **Vị trí:** Trong service backend

**Làm gì:**
- Railway sẽ **tự động deploy** sau khi bạn thêm variables
- Hoặc click nút **"Deploy"** nếu thấy

**Đợi:**
- Quá trình build mất **3-5 phút**
- Bạn sẽ thấy logs chạy
- Đợi đến khi thấy chữ **"Success"** hoặc **"Deployed"**

**Kết quả:** Backend đã deploy thành công!

---

### Bước 10: Lấy Backend URL
📍 **Vị trí:** Trong service backend

**Làm gì:**
1. Tìm tab **"Settings"**
2. Scroll xuống phần **"Networking"** hoặc **"Domains"**
3. Click nút **"Generate Domain"**
4. **Copy URL** hiện ra (ví dụ: `https://doctor-appointment-platform-production.up.railway.app`)

**Lưu URL này vào notepad!**

**Kết quả:** Có URL backend để dùng cho frontend

---

## 🎉 XONG PHẦN BACKEND!

Bạn đã deploy xong backend! Bây giờ cần:
1. Import database
2. Deploy frontend
3. Update CORS

---

## 📊 Checklist Hiện Tại

- [x] MySQL database đã tạo
- [x] Backend service đã tạo
- [x] Root directory = backend
- [x] Environment variables đã thêm (5 biến)
- [x] Backend đã deploy
- [x] Backend URL đã có
- [ ] Database đã import
- [ ] Frontend đã deploy
- [ ] CORS đã update

---

## 🆘 Nếu Gặp Lỗi

### Lỗi: Build Failed
**Nguyên nhân:** Thiếu environment variables hoặc sai format

**Giải pháp:**
1. Vào tab "Variables"
2. Kiểm tra lại 5 biến
3. Đảm bảo SPRING_DATASOURCE_URL đúng format: `jdbc:mysql://host:port/database`
4. Click "Redeploy"

### Lỗi: Service không start
**Nguyên nhân:** Root directory sai

**Giải pháp:**
1. Vào tab "Settings"
2. Kiểm tra "Root Directory" = `backend`
3. Save và redeploy

### Lỗi: Cannot connect to database
**Nguyên nhân:** MySQL variables sai

**Giải pháp:**
1. Quay lại MySQL service
2. Copy lại đúng các giá trị
3. Update variables trong backend service
4. Redeploy

---

## ⏭️ BƯỚC TIẾP THEO

Sau khi backend deploy xong, bạn cần:

### 1. Import Database (5 phút)
- Vào MySQL service
- Tab "Data" hoặc dùng MySQL client
- Import file `database/setup.sql`

### 2. Deploy Frontend (5 phút)
- Tạo service mới từ GitHub repo
- Root directory = `frontend`
- Add environment variable: `REACT_APP_API_URL` = backend URL
- Deploy

### 3. Update CORS (2 phút)
- Quay lại backend service
- Update biến `CORS_ORIGINS` = frontend URL
- Redeploy

---

## 💡 Tips

- **Xem logs:** Tab "Deployments" → Click deployment → View logs
- **Redeploy:** Tab "Deployments" → Click "..." → Redeploy
- **Stop service:** Tab "Settings" → Scroll xuống → Remove service

---

Bạn đang ở bước nào? Cho tôi biết để tôi hướng dẫn tiếp! 🚀
