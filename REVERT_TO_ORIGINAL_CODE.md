# Đã Revert Về Code Cũ ✅

## Thay đổi đã revert:

### 1. Database
- ❌ Xóa column `page` khỏi bảng `news_sections`
- ❌ Xóa file `database/add_news_section_page_field.sql`

### 2. Backend Model (NewsSection.java)
- ❌ Xóa field `page`

### 3. Backend Repository (NewsSectionRepository.java)
- ❌ Xóa methods: `findByPageAndIsActiveTrueOrderByDisplayOrderAsc`, `findByPageOrderByDisplayOrderAsc`

### 4. Backend Service (CMSService.java)
- ❌ Xóa methods: `getActiveNewsSectionsByPage`, `getAllNewsSectionsByPage`

### 5. Backend Controller (CMSController.java)
- ❌ Xóa endpoints: `/news-sections/page/{page}`, `/admin/news-sections/page/{page}`
- ❌ Xóa debug logs trong `updateNewsSection`

### 6. Frontend API (cmsApi.js)
- ❌ Xóa methods: `getActiveNewsSectionsByPage`, `getAllNewsSectionsByPage`

### 7. Frontend Pages
- ❌ HomePage.js: Revert về dùng `getAllActiveNewsSections()`
- ❌ NewsListPage.js: Revert về dùng `getAllActiveNewsSections()`

### 8. Frontend AdminCMSPage.js
- ❌ Xóa import `AppstoreOutlined`
- ❌ Xóa menu item "Sections Trang chủ"
- ❌ Xóa state `homeNewsSections`
- ❌ Revert fetchAllData về code cũ
- ❌ Xóa debug log trong handleSubmit

### 9. Frontend NewsSection.js
- ✅ Giữ nguyên logic: `const useGridLayout = layoutType === 'grid' || isHomePage;`

## Kết quả:
Hệ thống đã về lại trạng thái ban đầu như trước khi bắt đầu implement tính năng "page" field.

**Lưu ý**: Vấn đề ban đầu của bạn là "layout không được lưu khi reload trang" vẫn chưa được giải quyết. 

## Vấn đề gốc cần giải quyết:
Khi edit News Section trong CMS tab "Sections Tin tức", chọn layoutType và save, nhưng sau khi reload trang thì layoutType không được giữ lại.

## Nguyên nhân có thể:
1. Backend không lưu field `layoutType` đúng cách
2. Form không gửi field `layoutType` lên backend
3. Database column `layout_type` có vấn đề

Cần debug để tìm nguyên nhân chính xác.
