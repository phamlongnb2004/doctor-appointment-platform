# Test News Section Layout Update

## Vấn đề đã sửa:
NewsListPage không truyền prop `layoutType` vào NewsSection component

## Đã sửa:
```javascript
<NewsSection 
  key={section.id}
  title={section.title}
  articles={articles}
  showMoreButton={section.showMoreButton}
  moreButtonText={section.moreButtonText}
  moreButtonUrl={`/news?section=${section.name}`}
  backgroundColor={section.backgroundColor}
  titleAlign={section.titleAlign}
  layoutType={section.layoutType || 'default'}  // ← THÊM DÒNG NÀY
/>
```

## Cách test:

### 1. Test trong CMS:
1. Vào http://localhost:3000/admin/cms
2. Click tab "Sections Tin tức"
3. Click Edit một section (ví dụ: "TIN TỨC NỔI BẬT")
4. Chọn "Kiểu hiển thị" = "Grid (4 cột đều nhau)"
5. Click "Lưu"
6. Xem thông báo "Cập nhật thành công!"

### 2. Kiểm tra database:
```sql
SELECT id, name, title, layout_type FROM news_sections;
```

Kết quả mong đợi: `layout_type` của section đã edit phải là `grid`

### 3. Test trên trang tin tức:
1. Vào http://localhost:3000/news
2. Xem section đã edit
3. Nếu `layout_type = 'grid'` → Hiển thị 4 cột đều nhau
4. Nếu `layout_type = 'default'` → Hiển thị 1 bài lớn + 4 bài nhỏ

### 4. Test trên trang chủ:
1. Vào http://localhost:3000
2. Xem section đã edit
3. Do HomePage có `isHomePage={true}` → Luôn hiển thị grid bất kể `layoutType`

## Logic hiện tại:

### NewsSection.js:
```javascript
const useGridLayout = layoutType === 'grid' || isHomePage;
```

- Nếu `isHomePage = true` → Luôn dùng grid
- Nếu `isHomePage = false` → Dùng `layoutType` từ database

### HomePage.js:
```javascript
<NewsSection 
  layoutType={section.layoutType || 'default'}
  isHomePage={true}  // ← Force grid
/>
```

### NewsListPage.js:
```javascript
<NewsSection 
  layoutType={section.layoutType || 'default'}
  // Không có isHomePage → Dùng layoutType từ database
/>
```

## Kết quả mong đợi:

✅ **Trang chủ**: Tất cả sections hiển thị grid (do `isHomePage={true}`)  
✅ **Trang tin tức**: Sections hiển thị theo `layoutType` trong database  
✅ **CMS**: Có thể chọn layout cho từng section

---
**Ngày sửa**: 2026-02-04  
**Status**: ✅ FIXED
