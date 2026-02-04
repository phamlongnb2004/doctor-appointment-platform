# Sửa lỗi Slug Auto-Generation không hoạt động

## Vấn đề
- Slug không tự động tạo khi bác sĩ nhập tiêu đề
- API endpoint `/api/cms/slug/generate` trả về 404

## Nguyên nhân
1. **NewsArticleRepository.java có lỗi syntax**: Code bị duplicate, có 2 closing braces `}` và methods bị lặp lại
2. **Backend không compile được**: Do lỗi syntax nên backend không khởi động được
3. **API endpoints không available**: Vì backend không chạy

## Đã sửa

### 1. NewsArticleRepository.java
**Vấn đề**: Code bị duplicate
```java
// SAI - Code bị lặp
List<NewsArticle> findBySectionNameAndIsActiveTrueOrderByPublishedAtDesc(...);

boolean existsBySlug(String slug);
boolean existsBySlugAndIdNot(String slug, Long id);
} // Closing brace 1

List<NewsArticle> findBySectionNameAndIsActiveTrueOrderByPublishedAtDesc(...); // Duplicate!
// More methods...
} // Closing brace 2
```

**Đã sửa**: Gộp tất cả methods vào 1 interface, chỉ có 1 closing brace
```java
List<NewsArticle> findBySectionNameAndIsActiveTrueOrderByPublishedAtDesc(...);

// Category methods
List<NewsArticle> findBySectionNameAndCategoryAndIsActiveTrueOrderByPublishedAtDesc(...);
List<NewsArticle> findBySectionNameAndCategoryInAndIsActiveTrueOrderByPublishedAtDesc(...);

// Slug check methods
boolean existsBySlug(String slug);
boolean existsBySlugAndIdNot(String slug, Long id);
} // Only one closing brace
```

### 2. DoctorArticlesPage.js - Thêm debug logs
```javascript
const handleTitleChange = async (e) => {
  const title = e.target.value;
  console.log('Title changed:', title); // Debug
  
  if (editingArticle) {
    console.log('Editing article, skip auto-generate'); // Debug
    return;
  }
  
  if (title && title.trim()) {
    try {
      console.log('Generating slug for:', title); // Debug
      const response = await cmsAPI.generateSlug(title);
      const generatedSlug = response.data.slug;
      console.log('Generated slug:', generatedSlug); // Debug
      form.setFieldsValue({ slug: generatedSlug });
      checkSlugExists(generatedSlug);
    } catch (error) {
      console.error('Error generating slug:', error);
    }
  }
};
```

### 3. Sửa debounce logic
- Dùng `useRef` để lưu timeout ID
- Clear timeout cũ trước khi tạo mới
- Tránh race condition

## Cách test

### 1. Kiểm tra backend đã chạy
```bash
curl "http://localhost:8080/api/cms/slug/generate?title=Test"
```
Expected response:
```json
{"slug":"test"}
```

### 2. Test trên UI
1. Đăng nhập với tài khoản bác sĩ
2. Vào "Bài viết của tôi"
3. Click "Tạo bài viết mới"
4. Mở Console (F12)
5. Nhập tiêu đề
6. Xem Console logs:
   - "Title changed: ..."
   - "Generating slug for: ..."
   - "Generated slug: ..."
7. Xem slug field tự động được điền

### 3. Test slug trùng
1. Nhập tiêu đề giống bài viết đã có
2. Xem cảnh báo: "⚠️ Slug này đã tồn tại! Đề xuất: ..."
3. Click vào slug đề xuất để dùng

## Files đã sửa
- ✅ `backend/src/main/java/com/doctorappointment/repository/NewsArticleRepository.java`
- ✅ `frontend/src/pages/DoctorArticlesPage.js`
- ✅ `frontend/src/pages/AdminCMSPage.js`

## Kết quả
✅ Backend compile thành công
✅ API endpoints hoạt động
✅ Slug tự động tạo khi nhập tiêu đề
✅ Kiểm tra trùng lặp real-time
✅ Cảnh báo và đề xuất slug thay thế

---
**Ngày sửa**: 2026-02-04
**Status**: FIXED ✅
