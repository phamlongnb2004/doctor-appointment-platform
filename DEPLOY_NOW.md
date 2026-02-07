# 🚀 DEPLOY NGAY - 15 PHÚT

## ✅ Chuẩn Bị (2 phút)

### 1. Push code lên GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Đăng ký tài khoản (nếu chưa có)
- Railway: https://railway.app (dùng GitHub login)

---

## 🎯 DEPLOY TRÊN RAILWAY (Khuyên Dùng - Giữ MySQL)

### Bước 1: Tạo Project (1 phút)
1. Vào https://railway.app/dashboard
2. Click **"New Project"**
3. Chọn **"Deploy from GitHub repo"**
4. Chọn repository: `doctor-appointment-platform`

### Bước 2: Thêm MySQL Database (1 phút)
1. Trong project, click **"New"** → **"Database"** → **"Add MySQL"**
2. Đợi database khởi tạo (30 giây)
3. Click vào MySQL service → **"Variables"** tab
4. **Copy** các giá trị:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

### Bước 3: Deploy Backend (3 phút)
1. Trong project, click **"New"** → **"GitHub Repo"**
2. Chọn repository của bạn
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: (để trống, Railway tự detect)
   - **Start Command**: (để trống, Railway tự detect)

4. Click **"Variables"** tab, thêm:
```
SPRING_DATASOURCE_URL = jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}
SPRING_DATASOURCE_USERNAME = ${{MySQL.MYSQLUSER}}
SPRING_DATASOURCE_PASSWORD = ${{MySQL.MYSQLPASSWORD}}
CORS_ORIGINS = http://localhost:3000
PORT = 8080
```

5. Click **"Deploy"** → Đợi 3-5 phút

6. Sau khi deploy xong:
   - Click **"Settings"** → **"Networking"**
   - Click **"Generate Domain"**
   - Copy URL (ví dụ: `https://medlatec-backend-production.up.railway.app`)

### Bước 4: Import Database (2 phút)
1. Click vào MySQL service → **"Data"** tab
2. Click **"Import"**
3. Upload file: `database/setup.sql`
4. Hoặc dùng MySQL client:
```bash
mysql -h [MYSQLHOST] -P [MYSQLPORT] -u [MYSQLUSER] -p[MYSQLPASSWORD] [MYSQLDATABASE] < database/setup.sql
```

### Bước 5: Deploy Frontend (3 phút)
1. Trong project, click **"New"** → **"GitHub Repo"**
2. Chọn repository của bạn
3. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s build -p $PORT`

4. Click **"Variables"** tab, thêm:
```
REACT_APP_API_URL = [URL backend từ bước 3]
```
Ví dụ: `https://medlatec-backend-production.up.railway.app/api`

5. Click **"Deploy"** → Đợi 2-3 phút

6. Sau khi deploy xong:
   - Click **"Settings"** → **"Networking"**
   - Click **"Generate Domain"**
   - Copy URL (ví dụ: `https://medlatec-frontend-production.up.railway.app`)

### Bước 6: Cập nhật CORS (1 phút)
1. Quay lại Backend service
2. Click **"Variables"** tab
3. Sửa `CORS_ORIGINS`:
```
CORS_ORIGINS = https://[frontend-url],http://localhost:3000
```
Ví dụ: `https://medlatec-frontend-production.up.railway.app,http://localhost:3000`

4. Backend sẽ tự động redeploy

### Bước 7: Test Website (2 phút)
1. Mở frontend URL trong browser
2. Test các chức năng:
   - ✅ Xem trang chủ
   - ✅ Đăng ký tài khoản
   - ✅ Đăng nhập
   - ✅ Xem dịch vụ
   - ✅ Thêm vào giỏ hàng
   - ✅ Đặt hàng

---

## 🎉 XONG! Website đã online!

**Frontend:** `https://your-frontend.up.railway.app`  
**Backend:** `https://your-backend.up.railway.app`  
**Database:** MySQL trên Railway

---

## 🔧 Nếu Gặp Lỗi

### Lỗi 1: Backend không start
**Kiểm tra:**
- Logs: Click vào Backend service → "Deployments" → Click vào deployment mới nhất → Xem logs
- Thường do: Database connection string sai

**Sửa:**
- Kiểm tra lại environment variables
- Format đúng: `jdbc:mysql://host:port/database`

### Lỗi 2: CORS Error
**Triệu chứng:** Console hiện `Access to XMLHttpRequest has been blocked`

**Sửa:**
- Kiểm tra `CORS_ORIGINS` có đúng frontend URL không
- Phải có `https://` prefix
- Restart backend service

### Lỗi 3: Frontend không load API
**Kiểm tra:**
- F12 → Network tab → Xem API calls
- Kiểm tra `REACT_APP_API_URL` có đúng không

**Sửa:**
- Cập nhật `REACT_APP_API_URL` trong Frontend variables
- Redeploy frontend

### Lỗi 4: Database empty
**Sửa:**
- Import lại database từ file SQL
- Hoặc chạy các file SQL trong folder `database/`

---

## 💡 Tips

### 1. Xem Logs
```
Backend: Service → Deployments → Click deployment → View logs
Frontend: Service → Deployments → Click deployment → View logs
Database: MySQL service → Logs
```

### 2. Redeploy
```
Service → Deployments → Click "..." → Redeploy
```

### 3. Custom Domain (Nếu có domain riêng)
```
Service → Settings → Domains → Add Custom Domain
```

### 4. Environment Variables
```
Service → Variables → Add Variable
```

---

## 📊 Free Tier Limits

Railway Free Tier:
- ✅ 500 giờ/tháng (đủ cho 1 project chạy 24/7)
- ✅ 100GB bandwidth
- ✅ 1GB RAM per service
- ✅ Unlimited projects

**Lưu ý:** Sau 500 giờ, cần upgrade hoặc project sẽ sleep. Nhưng 500h = ~20 ngày, đủ để demo và test!

---

## 🚀 Nâng Cao

### Deploy với Custom Domain
1. Mua domain (Namecheap, GoDaddy: ~$10/năm)
2. Railway → Settings → Domains → Add Custom Domain
3. Cập nhật DNS records theo hướng dẫn
4. Đợi 5-10 phút → SSL tự động

### Monitoring
1. Railway Dashboard → Service → Metrics
2. Xem CPU, RAM, Network usage
3. Setup alerts nếu cần

### Backup Database
```bash
# Export
mysqldump -h [MYSQLHOST] -P [MYSQLPORT] -u [MYSQLUSER] -p[MYSQLPASSWORD] [MYSQLDATABASE] > backup.sql

# Import
mysql -h [MYSQLHOST] -P [MYSQLPORT] -u [MYSQLUSER] -p[MYSQLPASSWORD] [MYSQLDATABASE] < backup.sql
```

---

## ✅ Checklist Hoàn Thành

- [ ] Code đã push lên GitHub
- [ ] Railway project đã tạo
- [ ] MySQL database đã thêm
- [ ] Backend đã deploy và có URL
- [ ] Database đã import
- [ ] Frontend đã deploy và có URL
- [ ] CORS đã cập nhật
- [ ] Website test thành công
- [ ] Đã lưu lại URLs

**Chúc mừng! Website của bạn đã online! 🎉**
