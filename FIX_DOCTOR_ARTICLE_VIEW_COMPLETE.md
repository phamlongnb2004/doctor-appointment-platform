# Fix Doctor Article View - Complete ✅

## Vấn đề
Khi xem chi tiết bài viết bác sĩ đã được duyệt (APPROVED), trang NewsDetailPage báo lỗi 500 và không tìm thấy bài viết.

## Nguyên nhân

### 1. Repository Query Không Kiểm Tra Status
Method `findBySlugAndIsActiveTrue` trong NewsArticleRepository chỉ kiểm tra:
- `isActive = true`

Nhưng **KHÔNG kiểm tra**:
- `status = 'APPROVED'`

Điều này có nghĩa là có thể tìm thấy bài viết PENDING hoặc REJECTED, gây ra vấn đề khi serialize.

### 2. Thiếu JSON Annotations
Các model thiếu `@JsonIgnoreProperties` annotations:
- **Doctor model**: Không có annotation để xử lý lazy loading
- **User model**: Không có annotation để xử lý lazy loading
- **Doctor.user relationship**: Không có annotation để ngăn serialize password và circular references

## Giải pháp

### 1. Cập nhật NewsArticleRepository
**File**: `backend/src/main/java/com/doctorappointment/repository/NewsArticleRepository.java`

```java
@Query("SELECT n FROM NewsArticle n WHERE n.slug = ?1 AND n.isActive = true AND n.status = 'APPROVED'")
Optional<NewsArticle> findBySlugAndIsActiveTrue(String slug);
```

**Thay đổi**: Thêm điều kiện `n.status = 'APPROVED'` để chỉ trả về bài viết đã được duyệt.

### 2. Cập nhật Doctor Model
**File**: `backend/src/main/java/com/doctorappointment/model/Doctor.java`

#### Thêm class-level annotation:
```java
@Entity
@Table(name = "doctors")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Doctor {
```

#### Thêm field-level annotation cho User relationship:
```java
@OneToOne
@JoinColumn(name = "user_id", nullable = false, unique = true)
@JsonIgnoreProperties({"password", "appointments", "reviews", "hibernateLazyInitializer", "handler"})
private User user;
```

### 3. Cập nhật User Model
**File**: `backend/src/main/java/com/doctorappointment/model/User.java`

```java
@Entity
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
```

## Các Thay Đổi Chi Tiết

### backend/src/main/java/com/doctorappointment/repository/NewsArticleRepository.java
- Thêm `@Query` annotation với điều kiện `status = 'APPROVED'`
- Đảm bảo chỉ bài viết đã duyệt mới được hiển thị công khai

### backend/src/main/java/com/doctorappointment/model/Doctor.java
- Import: `import com.fasterxml.jackson.annotation.JsonIgnoreProperties;`
- Class annotation: `@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})`
- User field annotation: `@JsonIgnoreProperties({"password", "appointments", "reviews", "hibernateLazyInitializer", "handler"})`

### backend/src/main/java/com/doctorappointment/model/User.java
- Import: `import com.fasterxml.jackson.annotation.JsonIgnoreProperties;`
- Class annotation: `@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})`

## Kiểm Tra Database

Trước khi fix, database có nhiều bài viết với slug "aaa":
```sql
SELECT id, title, slug, status, is_active, doctor_id 
FROM news_articles 
WHERE slug = 'aaa';
```

Kết quả:
```
+----+-------+------+----------+-----------+-----------+
| id | title | slug | status   | is_active | doctor_id |
+----+-------+------+----------+-----------+-----------+
| 15 | aaa   | aaa  | REJECTED | 1         | NULL      |
| 19 | aaa   | aaa  | REJECTED | 1         | NULL      |
| 21 | abc   | aaa  | REJECTED | 1         | NULL      |
| 22 | aaa   | aaa  | APPROVED | 1         | 8         |
+----+-------+------+----------+-----------+-----------+
```

Sau khi fix, query chỉ trả về bài viết ID 22 (APPROVED).

## Luồng Hoạt Động

### Trước khi fix:
1. User truy cập `/news/aaa`
2. Frontend gọi `GET /api/cms/news/aaa`
3. Backend tìm bài viết với `slug='aaa'` và `isActive=true`
4. Có thể tìm thấy bài viết REJECTED hoặc PENDING
5. Khi serialize Doctor relationship → Lỗi 500

### Sau khi fix:
1. User truy cập `/news/aaa`
2. Frontend gọi `GET /api/cms/news/aaa`
3. Backend tìm bài viết với `slug='aaa'`, `isActive=true`, và `status='APPROVED'`
4. Chỉ trả về bài viết đã duyệt (ID 22)
5. Serialize thành công với proper JSON annotations
6. Frontend hiển thị bài viết

## Testing

### Test Cases:
1. ✅ Xem bài viết APPROVED → Hiển thị thành công
2. ✅ Xem bài viết PENDING → Không tìm thấy (404)
3. ✅ Xem bài viết REJECTED → Không tìm thấy (404)
4. ✅ Bài viết có doctor_id → Serialize thành công
5. ✅ Bài viết không có doctor_id → Serialize thành công

### Endpoints Affected:
- `GET /api/cms/news/{slug}` - Xem chi tiết bài viết
- Bất kỳ endpoint nào trả về NewsArticle với Doctor relationship

## Build & Deploy

```bash
cd backend
mvn clean compile -DskipTests
mvn spring-boot:run
```

## Lợi Ích

1. **Bảo mật**: Chỉ bài viết APPROVED mới hiển thị công khai
2. **Ổn định**: Không còn lỗi 500 khi serialize
3. **Chính xác**: Không serialize password và dữ liệu nhạy cảm
4. **Hiệu suất**: Tránh circular references và lazy loading issues

## Status
✅ **HOÀN THÀNH** - Bài viết bác sĩ đã duyệt hiển thị thành công

## Lưu Ý Quan Trọng

### Về Slug Trùng Lặp
Database hiện có nhiều bài viết với cùng slug "aaa". Trong production, nên:
1. Thêm unique constraint cho slug column
2. Validate slug trước khi lưu
3. Tự động generate slug từ title nếu trùng

### Về JSON Serialization
Khi tạo model mới với relationships, luôn nhớ:
1. Thêm `@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})` ở class level
2. Thêm `@JsonIgnoreProperties` cho các relationship fields
3. Loại trừ password, circular references, và lazy collections
4. Test serialization với actual data

## Recommendations

### 1. Thêm Unique Constraint cho Slug
```sql
ALTER TABLE news_articles ADD UNIQUE INDEX idx_slug (slug);
```

### 2. Cleanup Duplicate Slugs
```sql
-- Giữ lại bài viết APPROVED, xóa các bài REJECTED với slug trùng
DELETE FROM news_articles 
WHERE slug = 'aaa' 
AND status = 'REJECTED';
```

### 3. Thêm Slug Validation trong Service
```java
public void validateSlug(String slug, Long excludeId) {
    Optional<NewsArticle> existing = newsArticleRepository.findBySlug(slug);
    if (existing.isPresent() && !existing.get().getId().equals(excludeId)) {
        throw new IllegalArgumentException("Slug already exists");
    }
}
```
