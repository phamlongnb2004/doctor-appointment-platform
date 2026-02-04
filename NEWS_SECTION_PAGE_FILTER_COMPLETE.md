# ✅ HOÀN THÀNH: Phân trang cho News Sections

## Vấn đề đã giải quyết
User muốn ở trang chủ chỉ hiển thị 1 section tin tức, nhưng hiện tại đang hiển thị 2 section.

## Giải pháp
Thêm field `page` vào bảng `news_sections` để phân biệt section nào hiển thị ở trang chủ, trang tin tức, hoặc cả hai.

## Thay đổi đã thực hiện

### 1. Database
**File**: `database/add_news_section_page_field.sql`

```sql
ALTER TABLE news_sections 
ADD COLUMN page VARCHAR(50) DEFAULT 'both' COMMENT 'Page where section is displayed: home, news, or both';

-- Set 'medlatec' section to show on home page only
UPDATE news_sections SET page = 'home' WHERE name = 'medlatec';

-- Set other sections to show on news page only
UPDATE news_sections SET page = 'news' WHERE name IN ('featured', 'health', 'medical-topics');
```

### 2. Backend Model
**File**: `backend/src/main/java/com/doctorappointment/model/NewsSection.java`

Thêm field:
```java
@Column(length = 50)
private String page = "both"; // 'home', 'news', or 'both'
```

### 3. Backend Repository
**File**: `backend/src/main/java/com/doctorappointment/repository/NewsSectionRepository.java`

Thêm method:
```java
List<NewsSection> findByIsActiveTrueAndPageInOrderByDisplayOrderAsc(List<String> pages);
```

### 4. Backend Service
**File**: `backend/src/main/java/com/doctorappointment/service/CMSService.java`

Thêm method:
```java
public List<NewsSection> getActiveNewsSectionsByPage(String page) {
    return newsSectionRepository.findByIsActiveTrueAndPageInOrderByDisplayOrderAsc(
        List.of(page, "both")
    );
}
```

### 5. Backend Controller
**File**: `backend/src/main/java/com/doctorappointment/controller/CMSController.java`

Thêm endpoint:
```java
@GetMapping("/news-sections/page/{page}")
public ResponseEntity<List<NewsSection>> getActiveNewsSectionsByPage(@PathVariable String page) {
    return ResponseEntity.ok(cmsService.getActiveNewsSectionsByPage(page));
}
```

### 6. Frontend API
**File**: `frontend/src/services/cmsApi.js`

Thêm method:
```javascript
getActiveNewsSectionsByPage: (page) => {
  return axios.get(`${API_BASE_URL}/cms/news-sections/page/${page}`);
}
```

### 7. Frontend HomePage
**File**: `frontend/src/pages/HomePage.js`

Thay đổi:
```javascript
// Trước
cmsAPI.getAllActiveNewsSections()

// Sau
cmsAPI.getActiveNewsSectionsByPage('home')
```

### 8. Frontend NewsListPage
**File**: `frontend/src/pages/NewsListPage.js`

Thay đổi:
```javascript
// Trước
cmsAPI.getAllActiveNewsSections()

// Sau
cmsAPI.getActiveNewsSectionsByPage('news')
```

### 9. Frontend AdminCMSPage
**File**: `frontend/src/pages/AdminCMSPage.js`

- Thêm field "Hiển thị ở trang" vào form với 3 options:
  - Chỉ trang chủ
  - Chỉ trang tin tức
  - Cả hai trang
  
- Thêm cột "Trang" vào bảng hiển thị sections

## Cách sử dụng

### Trong CMS Admin

1. Vào tab "Sections Tin tức"
2. Khi tạo/sửa section, chọn "Hiển thị ở trang":
   - **Chỉ trang chủ**: Section chỉ hiện ở trang chủ (/)
   - **Chỉ trang tin tức**: Section chỉ hiện ở trang tin tức (/news)
   - **Cả hai trang**: Section hiện ở cả 2 trang

### Kết quả hiện tại

Với database đã được cập nhật:
- **Trang chủ** (http://localhost:3000): Chỉ hiển thị section "Y KHOA MEDLATEC"
- **Trang tin tức** (http://localhost:3000/news): Hiển thị 3 sections khác (featured, health, medical-topics)

## Trạng thái

✅ **Database đã cập nhật**
✅ **Backend đã restart** (Process 17)
✅ **Frontend đang chạy** (Process 11)
✅ **Code đã được cập nhật**
✅ **Sẵn sàng test**

## Cách test

1. Mở http://localhost:3000 → Chỉ thấy 1 section "Y KHOA MEDLATEC"
2. Mở http://localhost:3000/news → Thấy 3 sections khác
3. Vào CMS Admin → Tab "Sections Tin tức" → Thấy cột "Trang" hiển thị section nào ở trang nào
4. Thử tạo section mới và chọn "Hiển thị ở trang" khác nhau để test

## Lưu ý

- Sections với `page = 'both'` sẽ hiển thị ở cả trang chủ và trang tin tức
- Sections với `page = 'home'` chỉ hiển thị ở trang chủ
- Sections với `page = 'news'` chỉ hiển thị ở trang tin tức
- Mặc định khi tạo section mới, `page = 'both'`
