# Backend Status Check

## Kết quả test

❌ **Backend đang DOWN hoàn toàn**

### Test đã chạy:
```
GET /api/test/health → 404
GET /api/newsletter/subscribers → 404  
GET /test/health → 404
```

Tất cả endpoints đều trả về 404 → **Backend không chạy**

## Nguyên nhân có thể

1. **Render service crashed**
2. **Build failed**
3. **Startup error** (lỗi khi khởi động Spring Boot)
4. **Out of memory**
5. **Database connection failed**

## Cần làm ngay

### Bước 1: Kiểm tra Render Dashboard
1. Vào https://dashboard.render.com
2. Chọn backend service
3. Kiểm tra **Status** (phải là "Live")
4. Nếu không phải "Live" → Service đang down

### Bước 2: Xem Logs
1. Click tab "Logs"
2. Tìm lỗi màu đỏ
3. Tìm dòng cuối cùng trước khi crash

**Lỗi thường gặp:**
```
❌ OutOfMemoryError → Tăng RAM
❌ Connection refused → Database không kết nối được
❌ Port already in use → Conflict port
❌ Failed to start application → Lỗi code
```

### Bước 3: Kiểm tra Environment Variables
Đảm bảo có đủ:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SPRING_PROFILES_ACTIVE=prod`
- `PORT` (Render tự set)

### Bước 4: Restart Service
1. Click "Manual Deploy"
2. Chọn "Clear build cache & deploy"
3. Đợi 3-5 phút
4. Xem logs để check lỗi

### Bước 5: Test lại
Sau khi restart, test:
```
https://doctor-appointment-backend-mq2p.onrender.com/api/test/health
```

Phải trả về: `"Backend is running!"`

## Nếu vẫn lỗi

Gửi cho tôi:
1. Screenshot Render service status
2. 20 dòng cuối của Render logs
3. Screenshot Environment Variables

## Quick Fix

Nếu không vào được Render Dashboard, thử:
1. Push 1 commit nhỏ để trigger auto-deploy
2. Hoặc đợi Render tự restart (có thể mất 10-15 phút)

## Lưu ý

Backend đang **hoàn toàn down**, không phải chỉ newsletter endpoint.
Cần fix backend trước, sau đó mới test newsletter.
