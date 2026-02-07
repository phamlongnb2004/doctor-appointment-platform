# ✅ CORS FIX - DEPLOYMENT COMPLETE

## 🎯 Vấn đề
Frontend production không thể gọi API backend do lỗi CORS.

## ✅ Đã sửa
File: `backend/src/main/java/com/doctorappointment/config/SecurityConfig.java`

```java
configuration.setAllowedOrigins(List.of(
    "http://localhost:3000", 
    "http://localhost:5173",
    "https://doctor-appointment-platform-vaff.onrender.com",
    "https://doctor-appointment-frontend.onrender.com"
));
```

## 🚀 Cách deploy lại

### Option 1: Clear Cache & Redeploy (RECOMMENDED)
1. Vào https://dashboard.render.com
2. Click service: **doctor-appointment-backend**
3. Click **"Manual Deploy"** (góc trên phải)
4. Chọn **"Clear build cache & deploy"**
5. Đợi 5-7 phút

### Option 2: Delete & Recreate Service
1. Vào Settings của service
2. Kéo xuống dưới cùng
3. Click **"Delete Web Service"**
4. Tạo lại service mới từ GitHub

## 📝 Thông tin deployment

- **Backend URL**: https://doctor-appointment-backend-mq2p.onrender.com
- **Frontend URL**: https://doctor-appointment-platform-vaff.onrender.com
- **GitHub Repo**: https://github.com/phamlongnb2004/doctor-appointment-platform
- **Latest Commit**: Force rebuild with CORS fix

## ✅ Test sau khi deploy

1. Mở frontend: https://doctor-appointment-platform-vaff.onrender.com
2. Thử đăng nhập với:
   - Email: `admin@doctor.com`
   - Password: `password123`
3. Không còn lỗi CORS

## 🔍 Debug

Nếu vẫn lỗi, test endpoint:
```
https://doctor-appointment-backend-mq2p.onrender.com/api/test/cors-config
```

Endpoint này sẽ trả về danh sách allowed origins.
