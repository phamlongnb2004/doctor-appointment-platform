# Fix Article Detail Image Overflow - Complete ✅

## Vấn đề
Hình ảnh trong nội dung bài viết bị tràn ra ngoài ở 2 nơi:
1. ❌ **Modal chi tiết bài viết** trong Admin CMS (AdminCMSPage)
2. ❌ **Trang chi tiết bài viết công khai** (NewsDetailPage)

## Nguyên nhân
- Nội dung bài viết được render bằng `dangerouslySetInnerHTML` từ HTML editor
- Hình ảnh trong nội dung có thể có inline styles với width/height cố định
- Không có CSS đủ mạnh để override inline styles và giới hạn kích thước

## Giải pháp

### 1. Fix Modal Admin (AdminCMSPage)

#### a. Thêm bodyStyle cho Modal
```javascript
<Modal
  width={900}
  style={{ top: 20 }}
  bodyStyle={{ maxHeight: '75vh', overflowY: 'auto', overflowX: 'hidden' }}
>
```

#### b. Thêm className và maxWidth cho content
```javascript
<div 
  className="article-detail-content"
  style={{ 
    padding: 16, 
    background: '#fff',
    border: '1px solid #d9d9d9',
    borderRadius: 8,
    lineHeight: 1.8,
    overflow: 'hidden',
    maxWidth: '100%'
  }}
  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
/>
```

#### c. CSS trong admin-cms.css
```css
/* Force modal body to hide overflow */
.ant-modal-body {
  overflow-x: hidden !important;
}

.article-detail-content img {
  max-width: 100% !important;
  width: auto !important;
  height: auto !important;
  display: block !important;
  object-fit: contain !important;
}

.article-detail-content img[style] {
  max-width: 100% !important;
  width: auto !important;
  height: auto !important;
}
```

### 2. Fix Trang Công Khai (NewsDetailPage)

#### a. Thêm className cho content
```javascript
<div 
  className="news-article-content"
  style={{ 
    fontSize: 16, 
    lineHeight: 1.8,
    marginBottom: 40,
    overflow: 'hidden',
    maxWidth: '100%'
  }}
  dangerouslySetInnerHTML={{ __html: article.content }}
/>
```

#### b. CSS trong pages.css
```css
.news-article-content {
  overflow-x: hidden !important;
  max-width: 100% !important;
  word-wrap: break-word;
}

.news-article-content img {
  max-width: 100% !important;
  width: auto !important;
  height: auto !important;
  display: block !important;
  margin: 16px auto;
  object-fit: contain !important;
}

.news-article-content img[style] {
  max-width: 100% !important;
  width: auto !important;
  height: auto !important;
}
```

## Kết quả
✅ Hình ảnh tự động co lại vừa với container
✅ Không bị tràn ra ngoài dù có inline styles
✅ Giữ tỷ lệ khung hình gốc (aspect ratio)
✅ Căn giữa và có shadow đẹp
✅ Áp dụng cho cả modal admin và trang công khai
✅ Xử lý tất cả phần tử (img, figure, picture)

## Files đã sửa

### 1. Admin CMS
- `frontend/src/pages/AdminCMSPage.js`
  - Thêm `bodyStyle` cho Modal với `overflowX: 'hidden'`
  - Thêm `maxWidth: '100%'` vào content container
  - Thêm className `article-detail-content`

- `frontend/src/styles/admin-cms.css`
  - Thêm `.ant-modal-body { overflow-x: hidden !important; }`
  - Thêm CSS cho `.article-detail-content img`
  - Thêm CSS cho `img[style]`, `figure`, `picture`

### 2. Trang Công Khai
- `frontend/src/pages/NewsDetailPage.js`
  - Thêm className `news-article-content`
  - Thêm `overflow: 'hidden'` và `maxWidth: '100%'`

- `frontend/src/styles/pages.css`
  - Thêm CSS cho `.news-article-content img`
  - Thêm styling cho headings, lists, links, code, tables
  - Thêm responsive adjustments

## Cách test

### Test Modal Admin
1. **Hard refresh**: `Ctrl + F5`
2. Vào Admin CMS: http://localhost:3000/admin/cms
3. Tab "Bài viết của bác sĩ"
4. Click "Xem" ở bài viết có hình ảnh lớn
5. ✅ Hình ảnh không tràn ra ngoài modal

### Test Trang Công Khai
1. **Hard refresh**: `Ctrl + F5`
2. Vào trang chủ: http://localhost:3000
3. Click vào bất kỳ bài viết nào
4. Hoặc truy cập trực tiếp: http://localhost:3000/news/[slug]
5. ✅ Hình ảnh trong nội dung không tràn ra ngoài

## Lưu ý quan trọng

### Tại sao cần !important?
- Override inline styles từ rich text editor
- Đảm bảo CSS được áp dụng dù có style attribute

### Tại sao cần width: auto?
- Hình ảnh có thể có `width="1000px"` inline
- `width: auto` cho phép hình co lại theo `max-width: 100%`
- Giữ tỷ lệ khung hình đúng

### Tại sao cần nhiều selectors?
1. `.news-article-content img` - CSS cơ bản
2. `.news-article-content img[style]` - Override inline styles
3. `.news-article-content *` - Catch-all cho mọi phần tử
4. `.news-article-content figure/picture` - Xử lý wrapper elements

## Bonus Features

CSS cũng cải thiện hiển thị cho:
- 📝 Headings (h1-h6) với font-size responsive
- 📋 Lists (ul, ol) với spacing đẹp
- 🔗 Links với màu brand #667eea
- 💬 Blockquotes với background và border
- 💻 Code blocks với syntax highlighting
- 📊 Tables với borders và striped rows
- 📱 Responsive cho mobile

## Nếu vẫn còn vấn đề

1. **Clear cache hoàn toàn**:
   - Chrome: Settings → Privacy → Clear browsing data
   - Chọn "Cached images and files"

2. **Kiểm tra DevTools**:
   - Right-click vào hình ảnh → Inspect
   - Xem Computed styles
   - Đảm bảo `max-width: 100%` và `width: auto` được áp dụng

3. **Kiểm tra console**:
   - Xem có lỗi CSS nào không
   - Đảm bảo file pages.css được load

4. **Test với hình ảnh khác nhau**:
   - Hình nhỏ (< 800px)
   - Hình lớn (> 1500px)
   - Hình có inline styles
   - Hình trong figure/picture tags


