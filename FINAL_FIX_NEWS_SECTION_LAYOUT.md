# Fix News Section Layout Not Saving - FINAL

## Vấn đề:
Khi update layoutType trong CMS, frontend gửi đúng data nhưng backend không lưu vào database.

## Đã sửa:

### 1. Frontend - NewsListPage.js ✅
Thêm prop `layoutType` vào NewsSection component:
```javascript
<NewsSection 
  layoutType={section.layoutType || 'default'}  // ← THÊM DÒNG NÀY
  // ... other props
/>
```

### 2. Backend - CMSController.java ✅
Thay đổi logic update để fetch entity trước, rồi update từng field:
```java
@PutMapping("/admin/news-sections/{id}")
public ResponseEntity<NewsSection> updateNewsSection(@PathVariable Long id, @RequestBody NewsSection section) {
    // Fetch existing entity from database
    NewsSection existing = cmsService.getNewsSectionById(id)
        .orElseThrow(() -> new RuntimeException("News section not found"));
    
    // Update fields manually
    existing.setLayoutType(section.getLayoutType());  // ← QUAN TRỌNG
    // ... update other fields
    
    NewsSection updated = cmsService.saveNewsSection(existing);
    return ResponseEntity.ok(updated);
}
```

### 3. Debug logs ✅
Thêm console.log trong frontend và System.out.println trong backend để debug.

## Cách test:

### Bước 1: Restart backend
Backend cần restart để load code mới.

### Bước 2: Update section trong CMS
1. Vào http://localhost:3000/admin/cms
2. Tab "Sections Tin tức"
3. Edit section "Y KHOA MEDLATEC"
4. Chọn "Kiểu hiển thị" = "Grid (4 cột đều nhau)"
5. Click "Lưu"

### Bước 3: Kiểm tra logs
**Frontend console:**
```
=== NEWS SECTION DATA BEFORE SAVE ===
layoutType: grid
```

**Backend console:**
```
=== UPDATE NEWS SECTION ===
ID: 2
Received layoutType: grid
=== AFTER SAVE ===
Saved layoutType: grid
```

### Bước 4: Kiểm tra database
```sql
SELECT id, name, title, layout_type FROM news_sections WHERE id=2;
```
Kết quả mong đợi: `layout_type = 'grid'`

### Bước 5: Test trên trang tin tức
1. Vào http://localhost:3000/news
2. Hard refresh (Ctrl+Shift+R)
3. Section "Y KHOA MEDLATEC" phải hiển thị dạng grid (4 cột đều nhau)

## Nguyên nhân gốc:

1. **NewsListPage không truyền layoutType** → Đã sửa
2. **Backend dùng `section.setId(id)` rồi save** → Có thể gây vấn đề với JPA merge
3. **Giải pháp**: Fetch entity trước, update từng field, rồi save

## Kết quả mong đợi:

✅ Frontend gửi đúng data  
✅ Backend nhận và lưu đúng vào database  
✅ Trang tin tức hiển thị đúng layout  
✅ Có thể chọn layout khác nhau cho từng section

---
**Ngày sửa**: 2026-02-04  
**Status**: TESTING - Cần restart backend và test lại
