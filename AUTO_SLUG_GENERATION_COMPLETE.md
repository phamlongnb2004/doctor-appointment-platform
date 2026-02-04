# Tự động tạo Slug từ Tiêu đề - HOÀN THÀNH ✅

## Tổng quan
Đã hoàn thành tính năng tự động tạo slug từ tiêu đề bài viết và kiểm tra trùng lặp với cảnh báo cho người dùng.

**Áp dụng cho**:
- ✅ Bác sĩ đăng bài (DoctorArticlesPage)
- ✅ Admin quản lý tin tức (AdminCMSPage - tab News và Doctor Articles)

## Tính năng đã hoàn thành

### 1. Backend ✅

#### a. Utility Class - SlugUtils.java
**File**: `backend/src/main/java/com/doctorappointment/util/SlugUtils.java`

**Chức năng**:
- `toSlug(String input)`: Chuyển đổi tiêu đề tiếng Việt thành slug
  - Loại bỏ dấu tiếng Việt
  - Chuyển thành chữ thường
  - Thay khoảng trắng bằng dấu gạch ngang
  - Loại bỏ ký tự đặc biệt
  
**Ví dụ**:
```
"Bài viết về sức khỏe" → "bai-viet-ve-suc-khoe"
"Cách phòng tránh COVID-19" → "cach-phong-tranh-covid-19"
"Dinh dưỡng cho trẻ em" → "dinh-duong-cho-tre-em"
```

- `makeUniqueSlug(String baseSlug, int counter)`: Tạo slug unique bằng cách thêm số
  - "bai-viet" → "bai-viet-2" (nếu "bai-viet" đã tồn tại)

#### b. Repository Methods
**File**: `backend/src/main/java/com/doctorappointment/repository/NewsArticleRepository.java`

Thêm 2 methods:
```java
// Kiểm tra slug có tồn tại không
boolean existsBySlug(String slug);

// Kiểm tra slug tồn tại (loại trừ article hiện tại khi edit)
boolean existsBySlugAndIdNot(String slug, Long id);
```

#### c. Controller Endpoints
**File**: `backend/src/main/java/com/doctorappointment/controller/CMSController.java`

**1. Generate Slug Endpoint**:
```
GET /api/cms/slug/generate?title={title}
```
Response:
```json
{
  "slug": "bai-viet-ve-suc-khoe"
}
```

**2. Check Slug Endpoint**:
```
GET /api/cms/slug/check?slug={slug}&articleId={id}
```
Response (slug available):
```json
{
  "exists": false,
  "slug": "bai-viet-ve-suc-khoe"
}
```

Response (slug exists):
```json
{
  "exists": true,
  "slug": "bai-viet-ve-suc-khoe",
  "suggestion": "bai-viet-ve-suc-khoe-2"
}
```

### 2. Frontend ✅

#### a. API Methods
**File**: `frontend/src/services/cmsApi.js`

Thêm 2 methods:
```javascript
// Tạo slug từ tiêu đề
generateSlug: (title) => {
  return axios.get(`${API_BASE_URL}/cms/slug/generate`, {
    params: { title }
  });
}

// Kiểm tra slug có tồn tại không
checkSlug: (slug, articleId = null) => {
  const params = { slug };
  if (articleId) {
    params.articleId = articleId;
  }
  return axios.get(`${API_BASE_URL}/cms/slug/check`, { params });
}
```

#### b. DoctorArticlesPage (Bác sĩ đăng bài) ✅
**File**: `frontend/src/pages/DoctorArticlesPage.js`

**States**:
```javascript
const [slugChecking, setSlugChecking] = useState(false);
const [slugExists, setSlugExists] = useState(false);
const [slugSuggestion, setSlugSuggestion] = useState('');
```

**Event Handlers**:
- `handleTitleChange`: Tự động tạo slug khi nhập tiêu đề (chỉ khi tạo mới)
- `handleSlugChange`: Kiểm tra slug khi chỉnh sửa (debounce 500ms)
- `checkSlugExists`: Kiểm tra slug có tồn tại
- `useSuggestedSlug`: Sử dụng slug đề xuất

**Form Updates**:
```jsx
<Form.Item name="title" label="Tiêu đề">
  <Input onChange={handleTitleChange} placeholder="Nhập tiêu đề bài viết" />
</Form.Item>

<Form.Item 
  name="slug" 
  label="Slug (URL thân thiện)"
  validateStatus={slugExists ? 'error' : slugChecking ? 'validating' : ''}
  help={
    slugExists ? (
      <span style={{ color: '#ff4d4f' }}>
        ⚠️ Slug này đã tồn tại! 
        {slugSuggestion && (
          <span>
            {' '}Đề xuất: <a onClick={useSuggestedSlug}>
              {slugSuggestion}
            </a>
          </span>
        )}
      </span>
    ) : slugChecking ? 'Đang kiểm tra...' : 'Slug sẽ tự động tạo từ tiêu đề'
  }
>
  <Input onChange={handleSlugChange} disabled={slugChecking} />
</Form.Item>
```

#### c. AdminCMSPage (Admin quản lý) ✅
**File**: `frontend/src/pages/AdminCMSPage.js`

Tương tự DoctorArticlesPage, đã thêm:
- States cho slug validation
- Event handlers
- Form updates cho tab 'news' và 'doctor-articles'

## Cách sử dụng

### 1. Bác sĩ đăng bài (DoctorArticlesPage)

1. Đăng nhập với tài khoản bác sĩ
2. Vào trang "Bài viết của tôi"
3. Click "Tạo bài viết mới"
4. **Nhập tiêu đề**: Slug sẽ tự động được tạo
   - Ví dụ: "Cách phòng tránh cảm cúm" → slug: "cach-phong-tranh-cam-cum"
5. **Kiểm tra slug**:
   - ✅ Nếu slug chưa tồn tại: Hiển thị "Slug sẽ tự động tạo từ tiêu đề"
   - ⚠️ Nếu slug đã tồn tại: Hiển thị cảnh báo màu đỏ với slug đề xuất
6. **Sử dụng slug đề xuất**: Click vào link slug đề xuất để tự động điền
7. Điền các thông tin khác và submit

### 2. Admin quản lý tin tức (AdminCMSPage)

1. Đăng nhập admin
2. Vào Admin CMS → Tab "Tin tức" hoặc "Bài viết bác sĩ"
3. Click "Thêm mới"
4. Tương tự như bác sĩ đăng bài

### 3. Chỉnh sửa bài viết

1. Click Edit bài viết
2. Slug hiện tại được giữ nguyên
3. Có thể chỉnh sửa slug thủ công
4. Khi chỉnh sửa slug, hệ thống sẽ kiểm tra trùng lặp (loại trừ bài viết hiện tại)

### 4. Xử lý slug trùng

**Tình huống**: Bạn nhập tiêu đề "Bài viết về sức khỏe" nhưng slug "bai-viet-ve-suc-khoe" đã tồn tại

**Hiển thị**:
```
⚠️ Slug này đã tồn tại! Đề xuất: bai-viet-ve-suc-khoe-2
```

**Hành động**:
- Click vào "bai-viet-ve-suc-khoe-2" để tự động điền
- Hoặc tự chỉnh sửa slug thành tên khác

## Ví dụ chuyển đổi

| Tiêu đề | Slug |
|---------|------|
| Bài viết về sức khỏe | bai-viet-ve-suc-khoe |
| Cách phòng tránh COVID-19 | cach-phong-tranh-covid-19 |
| Dinh dưỡng cho trẻ em | dinh-duong-cho-tre-em |
| Tập thể dục buổi sáng | tap-the-duc-buoi-sang |
| Khám sức khỏe định kỳ | kham-suc-khoe-dinh-ky |
| Chăm sóc răng miệng | cham-soc-rang-mieng |

## Lợi ích

✅ **Tự động hóa**: Không cần nhập slug thủ công
✅ **SEO-friendly**: Slug không dấu, dễ đọc, thân thiện với công cụ tìm kiếm
✅ **Tránh trùng lặp**: Kiểm tra và cảnh báo slug trùng
✅ **Đề xuất thông minh**: Tự động đề xuất slug thay thế
✅ **UX tốt**: Cảnh báo rõ ràng, dễ sử dụng
✅ **Hỗ trợ tiếng Việt**: Chuyển đổi chính xác các ký tự có dấu
✅ **Áp dụng cho cả bác sĩ và admin**: Trải nghiệm nhất quán

## Files đã tạo/chỉnh sửa

### Backend
- ✅ `backend/src/main/java/com/doctorappointment/util/SlugUtils.java` (NEW)
- ✅ `backend/src/main/java/com/doctorappointment/repository/NewsArticleRepository.java`
- ✅ `backend/src/main/java/com/doctorappointment/controller/CMSController.java`

### Frontend
- ✅ `frontend/src/services/cmsApi.js`
- ✅ `frontend/src/pages/DoctorArticlesPage.js` (BÁC SĨ)
- ✅ `frontend/src/pages/AdminCMSPage.js` (ADMIN)

## Testing

### Test Cases

1. **Tạo slug từ tiêu đề tiếng Việt**
   - Input: "Bài viết về sức khỏe"
   - Expected: "bai-viet-ve-suc-khoe"

2. **Kiểm tra slug trùng**
   - Tạo bài viết với slug "test-article"
   - Tạo bài viết mới với cùng tiêu đề
   - Expected: Cảnh báo "Slug này đã tồn tại! Đề xuất: test-article-2"

3. **Chỉnh sửa bài viết không ảnh hưởng slug**
   - Edit bài viết có slug "existing-slug"
   - Slug field không bị cảnh báo trùng với chính nó

4. **Slug với ký tự đặc biệt**
   - Input: "COVID-19: Cách phòng tránh!!!"
   - Expected: "covid-19-cach-phong-tranh"

### Manual Testing

#### Test cho Bác sĩ:
1. ✅ Đăng nhập với tài khoản bác sĩ
2. ✅ Vào trang "Bài viết của tôi"
3. ✅ Click "Tạo bài viết mới"
4. ✅ Nhập tiêu đề → Slug tự động tạo
5. ✅ Nhập tiêu đề trùng → Hiển thị cảnh báo

#### Test cho Admin:
1. ✅ Đăng nhập admin
2. ✅ Vào http://localhost:3000/admin/cms
3. ✅ Tab "Tin tức" → Click "Thêm mới"
4. ✅ Nhập tiêu đề → Slug tự động tạo
5. ✅ Nhập tiêu đề trùng → Hiển thị cảnh báo

---
**Hoàn thành lúc**: 2026-02-04
**Status**: COMPLETE ✅
**Tested**: ✅
**Áp dụng cho**: Bác sĩ + Admin ✅
