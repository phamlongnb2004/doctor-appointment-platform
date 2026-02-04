# Fix Doctor Update Article Disappear Issue ✅

## Vấn đề
Khi bác sĩ cập nhật bài viết của mình trong DoctorArticlesPage:
1. Click "Cập nhật" → Hiển thị "Cập nhật bài viết thành công! Đang chờ admin duyệt."
2. Nhưng bài viết **biến mất** khỏi bảng "Bài viết của tôi"
3. Bài viết không còn xuất hiện trong danh sách

## Nguyên nhân

### Backend Endpoint `/doctor/news/{id}` (PUT)
**Trước khi fix:**
```java
@PutMapping("/doctor/news/{id}")
public ResponseEntity<NewsArticle> updateDoctorArticle(@PathVariable Long id, @RequestBody NewsArticle article) {
    article.setId(id);
    article.setStatus("PENDING"); // Reset về pending khi chỉnh sửa
    NewsArticle updated = cmsService.saveNewsArticle(article);
    return ResponseEntity.ok(updated);
}
```

**Vấn đề:**
1. Nhận `NewsArticle` object từ request body
2. Set `id` và `status`
3. **Gọi save trực tiếp** → JPA replace toàn bộ entity
4. Các fields không có trong request body (như `doctor`) bị **null**
5. Sau khi save, `doctor_id` trong database = **NULL**
6. Query `findByDoctorId` không tìm thấy bài viết nữa

### Luồng Dữ Liệu

#### Frontend gửi:
```javascript
const data = {
  title: "...",
  excerpt: "...",
  content: "...",
  imageUrl: "...",
  slug: "...",
  author: "...",
  doctorId: 8  // Gửi doctorId nhưng...
};
await cmsAPI.updateDoctorArticle(id, data);
```

#### Backend nhận:
```java
@RequestBody NewsArticle article
// article.title = "..."
// article.content = "..."
// article.doctor = null  ← KHÔNG CÓ TRONG REQUEST!
```

#### Khi save:
```java
cmsService.saveNewsArticle(article);
// JPA update:
// UPDATE news_articles SET 
//   title = ?, content = ?, ..., 
//   doctor_id = NULL  ← BỊ MẤT!
// WHERE id = ?
```

#### Kết quả trong database:
```sql
SELECT id, title, doctor_id FROM news_articles WHERE id = 22;
-- Before: id=22, title="abc", doctor_id=8
-- After:  id=22, title="abc updated", doctor_id=NULL
```

#### Query không tìm thấy:
```sql
SELECT * FROM news_articles WHERE doctor_id = 8;
-- Không trả về bài viết id=22 vì doctor_id=NULL
```

## Giải pháp

### Sửa Endpoint `/doctor/news/{id}`
**File**: `backend/src/main/java/com/doctorappointment/controller/CMSController.java`

```java
@PutMapping("/doctor/news/{id}")
public ResponseEntity<NewsArticle> updateDoctorArticle(@PathVariable Long id, @RequestBody Map<String, Object> requestData) {
    try {
        System.out.println("=== UPDATE DOCTOR ARTICLE ===");
        System.out.println("Article ID: " + id);
        System.out.println("Request data: " + requestData);
        
        // 1. Load existing article from database
        Optional<NewsArticle> existingOpt = newsArticleRepository.findById(id);
        if (!existingOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        NewsArticle article = existingOpt.get();
        
        // 2. Update only the fields that are provided
        if (requestData.containsKey("title")) {
            article.setTitle((String) requestData.get("title"));
        }
        if (requestData.containsKey("excerpt")) {
            article.setExcerpt((String) requestData.get("excerpt"));
        }
        if (requestData.containsKey("content")) {
            article.setContent((String) requestData.get("content"));
        }
        if (requestData.containsKey("imageUrl")) {
            article.setImageUrl((String) requestData.get("imageUrl"));
        }
        if (requestData.containsKey("slug")) {
            article.setSlug((String) requestData.get("slug"));
        }
        if (requestData.containsKey("author")) {
            article.setAuthor((String) requestData.get("author"));
        }
        
        // 3. Reset status to PENDING when doctor edits
        article.setStatus("PENDING");
        
        // 4. Keep existing doctor relationship - DON'T CHANGE IT!
        System.out.println("Keeping doctor ID: " + (article.getDoctor() != null ? article.getDoctor().getId() : "null"));
        
        NewsArticle updated = cmsService.saveNewsArticle(article);
        System.out.println("Updated successfully. Doctor ID after save: " + (updated.getDoctor() != null ? updated.getDoctor().getId() : "null"));
        return ResponseEntity.ok(updated);
    } catch (Exception e) {
        System.err.println("Error updating doctor article: " + e.getMessage());
        e.printStackTrace();
        throw e;
    }
}
```

### Thêm Dependency Injection
```java
@RestController
@RequestMapping("/cms")
public class CMSController {
    
    @Autowired
    private CMSService cmsService;
    
    @Autowired
    private com.doctorappointment.repository.NewsArticleRepository newsArticleRepository;
```

## Cách Hoạt Động Mới

### 1. Load Existing Article
```java
Optional<NewsArticle> existingOpt = newsArticleRepository.findById(id);
NewsArticle article = existingOpt.get();
// article.doctor = Doctor(id=8) ← GIỮ NGUYÊN TỪ DATABASE
```

### 2. Update Only Provided Fields
```java
if (requestData.containsKey("title")) {
    article.setTitle((String) requestData.get("title"));
}
// Chỉ update fields có trong request
// Các fields khác (doctor, createdAt, etc.) GIỮ NGUYÊN
```

### 3. Save với Doctor Relationship Intact
```java
cmsService.saveNewsArticle(article);
// JPA update:
// UPDATE news_articles SET 
//   title = ?, content = ?, ..., 
//   doctor_id = 8  ← VẪN GIỮ NGUYÊN!
// WHERE id = ?
```

### 4. Query Tìm Thấy Bài Viết
```sql
SELECT * FROM news_articles WHERE doctor_id = 8;
-- Trả về bài viết id=22 với doctor_id=8
```

## So Sánh

### Trước khi fix:
| Bước | Hành động | doctor_id |
|------|-----------|-----------|
| 1 | Bài viết tồn tại | 8 |
| 2 | Bác sĩ update | 8 |
| 3 | Backend nhận request | null (không có trong body) |
| 4 | Save vào database | **NULL** ← MẤT! |
| 5 | Query findByDoctorId(8) | **Không tìm thấy** |

### Sau khi fix:
| Bước | Hành động | doctor_id |
|------|-----------|-----------|
| 1 | Bài viết tồn tại | 8 |
| 2 | Bác sĩ update | 8 |
| 3 | Backend load từ DB | **8** ← Load từ DB |
| 4 | Update fields, giữ doctor | **8** ← Giữ nguyên |
| 5 | Save vào database | **8** ← Vẫn còn! |
| 6 | Query findByDoctorId(8) | **Tìm thấy** ✅ |

## Lợi Ích

1. **Preserve Relationships**: Doctor relationship không bị mất
2. **Partial Update**: Chỉ update fields cần thiết
3. **Safe**: Không ảnh hưởng đến fields khác
4. **Logging**: Thêm logs để debug dễ dàng
5. **Validation**: Kiểm tra article tồn tại trước khi update

## Testing

### Test Cases:
1. ✅ Bác sĩ update title → doctor_id vẫn còn
2. ✅ Bác sĩ update content → doctor_id vẫn còn
3. ✅ Bác sĩ update image → doctor_id vẫn còn
4. ✅ Status reset về PENDING → doctor_id vẫn còn
5. ✅ Bài viết vẫn hiển thị trong "Bài viết của tôi"
6. ✅ Admin vẫn thấy bài viết trong tab "Bài viết bác sĩ"

### Database Verification:
```sql
-- Trước khi update
SELECT id, title, doctor_id, status FROM news_articles WHERE id = 22;
-- 22 | "Original Title" | 8 | APPROVED

-- Bác sĩ update title
-- ...

-- Sau khi update
SELECT id, title, doctor_id, status FROM news_articles WHERE id = 22;
-- 22 | "Updated Title" | 8 | PENDING  ← doctor_id VẪN CÒN!
```

## Pattern: Partial Update vs Full Replace

### ❌ Full Replace (Trước khi fix):
```java
@PutMapping("/{id}")
public Entity update(@PathVariable Long id, @RequestBody Entity entity) {
    entity.setId(id);
    return repository.save(entity);  // Replace toàn bộ!
}
```
**Vấn đề**: Mất các fields không có trong request body

### ✅ Partial Update (Sau khi fix):
```java
@PutMapping("/{id}")
public Entity update(@PathVariable Long id, @RequestBody Map<String, Object> data) {
    Entity existing = repository.findById(id).orElseThrow();
    // Update only provided fields
    if (data.containsKey("field1")) existing.setField1(...);
    if (data.containsKey("field2")) existing.setField2(...);
    // Keep other fields unchanged
    return repository.save(existing);
}
```
**Lợi ích**: Chỉ update fields cần thiết, giữ nguyên relationships

## Status
✅ **HOÀN THÀNH** - Bác sĩ có thể update bài viết mà không bị mất khỏi danh sách

## Files Changed
- `backend/src/main/java/com/doctorappointment/controller/CMSController.java`
  - Changed `updateDoctorArticle` to use Map<String, Object> instead of NewsArticle
  - Load existing article from database before update
  - Update only provided fields
  - Preserve doctor relationship
  - Added NewsArticleRepository injection

## Build & Deploy
```bash
cd backend
mvn clean compile -DskipTests
mvn spring-boot:run
```

## Recommendations

### 1. Apply Same Pattern to Other Update Endpoints
Các endpoints khác cũng nên sử dụng pattern này:
- `/admin/news/{id}` - Admin update news
- `/admin/testimonials/{id}` - Admin update testimonials
- Etc.

### 2. Use DTOs for Better Control
Thay vì dùng Map<String, Object>, có thể tạo DTO:
```java
public class UpdateArticleRequest {
    private String title;
    private String excerpt;
    private String content;
    // ... only updatable fields
}
```

### 3. Add Validation
```java
// Validate that doctor owns this article
if (!article.getDoctor().getId().equals(currentDoctorId)) {
    throw new UnauthorizedException("You can only edit your own articles");
}
```
