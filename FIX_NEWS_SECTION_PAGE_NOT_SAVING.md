# ✅ SỬA LỖI: Field "Hiển thị ở trang" không lưu

## Vấn đề
User cập nhật field "Hiển thị ở trang" trong CMS nhưng khi load lại trang thì giá trị không thay đổi.

## Nguyên nhân
Method `updateNewsSection` trong CMSController thiếu dòng code để cập nhật field `page`:

```java
existing.setPage(section.getPage()); // ← Dòng này bị thiếu
```

## Giải pháp
**File**: `backend/src/main/java/com/doctorappointment/controller/CMSController.java`

Thêm dòng `existing.setPage(section.getPage());` vào method `updateNewsSection`:

```java
@PutMapping("/admin/news-sections/{id}")
public ResponseEntity<NewsSection> updateNewsSection(@PathVariable Long id, @RequestBody NewsSection section) {
    // Fetch existing entity from database
    NewsSection existing = cmsService.getNewsSectionById(id)
        .orElseThrow(() -> new RuntimeException("News section not found"));
    
    // Update fields manually
    existing.setName(section.getName());
    existing.setTitle(section.getTitle());
    existing.setDescription(section.getDescription());
    existing.setLayoutType(section.getLayoutType());
    existing.setDisplayOrder(section.getDisplayOrder());
    existing.setBackgroundColor(section.getBackgroundColor());
    existing.setTitleAlign(section.getTitleAlign());
    existing.setArticlesLimit(section.getArticlesLimit());
    existing.setShowMoreButton(section.getShowMoreButton());
    existing.setMoreButtonText(section.getMoreButtonText());
    existing.setCategoryFilter(section.getCategoryFilter());
    existing.setPage(section.getPage()); // ← THÊM DÒNG NÀY
    existing.setIsActive(section.getIsActive());
    
    NewsSection updated = cmsService.saveNewsSection(existing);
    return ResponseEntity.ok(updated);
}
```

## Trạng thái

✅ **Code đã được sửa**
✅ **Backend đã restart** (Process 18)
✅ **Sẵn sàng test**

## Cách test

1. Vào CMS Admin → Tab "Sections Tin tức"
2. Chọn một section và click Edit
3. Thay đổi "Hiển thị ở trang" (ví dụ: từ "Cả hai" sang "Chỉ trang chủ")
4. Click "Lưu"
5. Load lại trang CMS
6. Kiểm tra cột "Trang" trong bảng → Giá trị đã được cập nhật
7. Kiểm tra trang chủ và trang tin tức → Section hiển thị đúng theo cấu hình

## Lưu ý

Đây là lỗi tương tự như lỗi `layoutType` trước đó - khi thêm field mới vào model, cần nhớ thêm dòng `existing.setXxx()` vào method update.
