# Restart Backend để áp dụng Category

## ✅ SQL đã chạy thành công!

Cột `category` đã được thêm vào bảng `news_articles`.

## 🔄 Cần restart backend

Backend đang chạy với PID 23888. Để backend nhận model mới (NewsArticle với field category), bạn cần:

### Cách 1: Restart từ IDE
1. Mở IntelliJ IDEA hoặc IDE bạn đang dùng
2. Stop backend server (nút Stop màu đỏ)
3. Start lại backend server (nút Run màu xanh)

### Cách 2: Restart từ Command Line
1. Mở Command Prompt hoặc PowerShell
2. Vào thư mục backend:
   ```bash
   cd backend
   ```
3. Chạy Maven:
   ```bash
   mvn spring-boot:run
   ```

### Cách 3: Kill process và restart
1. Kill process hiện tại:
   ```bash
   taskkill /PID 23888 /F
   ```
2. Vào thư mục backend và chạy lại:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

## ✅ Sau khi restart

Backend sẽ:
- Nhận model NewsArticle mới với field `category`
- Các endpoint mới sẽ hoạt động:
  - `GET /api/cms/news/category/{category}`
  - `GET /api/cms/news/categories`

## 🧪 Test

### 1. Test API categories
```bash
curl http://localhost:8080/api/cms/news/categories
```

Kết quả mong đợi:
```json
[
  "Tin tức y khoa",
  "Sức khỏe tổng quát", 
  "Dinh dưỡng",
  "Chuyên khoa"
]
```

### 2. Test API lấy bài viết theo category
```bash
curl http://localhost:8080/api/cms/news/category/Dinh%20d%C6%B0%E1%BB%A1ng
```

### 3. Test Frontend
- Truy cập: http://localhost:3000/news
- Kiểm tra dropdown danh mục
- Click vào danh mục để lọc
- Kiểm tra search

## 📝 Checklist

- [x] SQL script đã chạy
- [ ] Backend đã restart
- [ ] Test API categories
- [ ] Test API lấy bài viết theo category
- [ ] Test trang /news
- [ ] Test Admin CMS - thêm/sửa bài viết với category

## 🎯 Kết quả

Sau khi restart backend và test, bạn sẽ có:
- ✅ Trang danh sách tin tức với phân loại
- ✅ Lọc theo danh mục
- ✅ Tìm kiếm bài viết
- ✅ Sidebar với danh mục và bài viết nổi bật
- ✅ Admin CMS có field category
