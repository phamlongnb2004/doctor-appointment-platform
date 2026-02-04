# Rich Text Editor với Upload Ảnh - Hướng dẫn

## Tổng quan

Hệ thống đã được nâng cấp với Rich Text Editor (WYSIWYG) sử dụng React Quill, cho phép:
- Định dạng văn bản phong phú (bold, italic, underline, màu sắc, v.v.)
- Upload và chèn ảnh trực tiếp vào nội dung
- Upload ảnh đại diện cho bài viết
- Xem trước ảnh trước khi đăng

## Tính năng đã triển khai

### 1. Backend - Image Upload API

#### Endpoint mới
```
POST /api/images/articles
```

**Mô tả**: Upload ảnh cho bài viết (ảnh đại diện hoặc ảnh trong nội dung)

**Headers**:
- `Content-Type: multipart/form-data`
- `Authorization: Bearer {token}`

**Body**:
- `image`: File ảnh (JPG, PNG, GIF, WEBP)

**Response**:
```json
{
  "message": "Article image uploaded successfully",
  "imageUrl": "http://localhost:8080/api/images/articles/uuid.jpg",
  "url": "http://localhost:8080/api/images/articles/uuid.jpg"
}
```

**Giới hạn**:
- Kích thước tối đa: 5MB
- Định dạng: JPG, PNG, GIF, WEBP

#### Endpoint GET ảnh
```
GET /api/images/articles/{filename}
```

**Mô tả**: Lấy ảnh đã upload

**Response**: Binary image data

#### Files đã cập nhật
- `backend/src/main/java/com/doctorappointment/controller/ImageController.java`
  - Thêm method `uploadArticleImage()`
  - Thêm method `getArticleImage()`
  
- `backend/src/main/java/com/doctorappointment/service/ImageService.java`
  - Thêm method `uploadArticleImage()`

### 2. Frontend - Rich Text Editor Component

#### Component mới: RichTextEditor

**Location**: `frontend/src/components/RichTextEditor.js`

**Props**:
- `value`: String - Nội dung HTML
- `onChange`: Function - Callback khi nội dung thay đổi
- `placeholder`: String - Placeholder text

**Tính năng**:
- Thanh công cụ đầy đủ với các tùy chọn định dạng
- Upload ảnh bằng cách click icon ảnh
- Tự động resize ảnh trong editor
- Hỗ trợ copy/paste ảnh
- Responsive design

**Cách sử dụng**:
```jsx
import RichTextEditor from '../components/RichTextEditor';

function MyComponent() {
  const [content, setContent] = useState('');
  
  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Nhập nội dung..."
    />
  );
}
```

#### Thanh công cụ Editor

**Định dạng văn bản**:
- Headers (H1-H6)
- Font family
- Font size
- Bold, Italic, Underline, Strike
- Text color, Background color
- Subscript, Superscript

**Căn chỉnh**:
- Align left, center, right, justify
- Indent, Outdent

**Danh sách**:
- Ordered list (số)
- Bullet list (dấu chấm)

**Chèn nội dung**:
- Link
- Image (upload)
- Video (embed)
- Blockquote
- Code block

**Khác**:
- Clear formatting

### 3. DoctorArticlesPage - Cập nhật

#### Tính năng mới

**Upload ảnh đại diện**:
- Click vào khung "Tải ảnh lên"
- Chọn ảnh từ máy tính
- Xem trước ảnh ngay lập tức
- Ảnh được upload khi submit form

**Rich Text Editor**:
- Thay thế textarea đơn giản
- Định dạng văn bản phong phú
- Chèn ảnh vào bất kỳ vị trí nào trong nội dung

**Workflow**:
1. Click "Tạo bài viết mới"
2. Nhập tiêu đề, slug, tóm tắt
3. Upload ảnh đại diện (optional)
4. Viết nội dung với Rich Text Editor
5. Click icon ảnh trên thanh công cụ để chèn ảnh vào nội dung
6. Submit form

## Hướng dẫn sử dụng

### Cho Bác sĩ

#### Tạo bài viết mới

1. **Đăng nhập** với tài khoản bác sĩ
2. Click nút **"Đăng bài"** trên Header (hoặc vào `/doctor/articles`)
3. Click **"Tạo bài viết mới"**
4. Điền thông tin:
   - **Tiêu đề**: Tiêu đề bài viết
   - **Slug**: URL thân thiện (VD: `bai-viet-ve-suc-khoe`)
   - **Tóm tắt**: Mô tả ngắn gọn
   - **Ảnh đại diện**: Click vào khung để upload ảnh
   - **Nội dung**: Sử dụng Rich Text Editor

#### Chèn ảnh vào nội dung

**Cách 1: Upload từ máy tính**
1. Đặt con trỏ tại vị trí muốn chèn ảnh
2. Click icon **ảnh** trên thanh công cụ
3. Chọn file ảnh từ máy tính
4. Đợi upload hoàn tất
5. Ảnh sẽ tự động xuất hiện trong editor

**Cách 2: Copy/Paste**
1. Copy ảnh từ clipboard
2. Paste vào editor (Ctrl+V)
3. Ảnh sẽ được chèn tại vị trí con trỏ

#### Định dạng văn bản

- **Bold**: Ctrl+B hoặc click icon **B**
- **Italic**: Ctrl+I hoặc click icon *I*
- **Underline**: Ctrl+U hoặc click icon U
- **Heading**: Chọn từ dropdown (H1-H6)
- **Màu chữ**: Click icon màu
- **Danh sách**: Click icon list

#### Lưu bài viết

1. Kiểm tra lại nội dung
2. Click **"Tạo bài viết"**
3. Bài viết sẽ có trạng thái **"Chờ duyệt"**
4. Đợi admin phê duyệt

### Cho Admin

Admin có thể:
- Xem tất cả bài viết của bác sĩ
- Duyệt/Từ chối bài viết
- Chỉnh sửa bài viết
- Xóa bài viết

Truy cập: `/admin/cms` → Tab "Bài viết bác sĩ"

## Cấu trúc thư mục Upload

```
uploads/
└── articles/
    ├── uuid-1.jpg
    ├── uuid-2.png
    └── uuid-3.gif
```

Tất cả ảnh bài viết được lưu trong thư mục `uploads/articles/` với tên file UUID duy nhất.

## API Endpoints Summary

### Upload ảnh bài viết
```
POST /api/images/articles
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body: { image: File }

Response: {
  "imageUrl": "http://localhost:8080/api/images/articles/uuid.jpg"
}
```

### Lấy ảnh bài viết
```
GET /api/images/articles/{filename}

Response: Binary image data
```

### Tạo bài viết (Doctor)
```
POST /api/cms/doctor/news
Authorization: Bearer {token}

Body: {
  "title": "Tiêu đề",
  "slug": "tieu-de",
  "excerpt": "Tóm tắt",
  "content": "<p>Nội dung HTML...</p>",
  "imageUrl": "http://localhost:8080/api/images/articles/uuid.jpg",
  "author": "Tên bác sĩ",
  "doctor": { "id": 1 }
}
```

## Dependencies

### Frontend
```json
{
  "react-quill": "^2.0.0"
}
```

### Backend
- Spring Boot MultipartFile
- Java NIO Files API

## Cài đặt

### Frontend
```bash
cd frontend
npm install react-quill
```

### Backend
Không cần cài đặt thêm, đã có sẵn trong Spring Boot.

## Troubleshooting

### Lỗi: "File size must be less than 5MB"
**Nguyên nhân**: File ảnh quá lớn
**Giải pháp**: Nén ảnh hoặc chọn ảnh nhỏ hơn

### Lỗi: "Invalid file type"
**Nguyên nhân**: File không phải ảnh
**Giải pháp**: Chỉ chọn file JPG, PNG, GIF, WEBP

### Ảnh không hiển thị trong editor
**Nguyên nhân**: Lỗi upload hoặc URL không đúng
**Giải pháp**: 
- Kiểm tra console log
- Kiểm tra backend có nhận được request
- Kiểm tra thư mục uploads/articles/ có file không

### Editor không hiển thị
**Nguyên nhân**: Chưa import CSS của Quill
**Giải pháp**: Đảm bảo có dòng:
```jsx
import 'react-quill/dist/quill.snow.css';
```

## Best Practices

### Tối ưu ảnh
- Nén ảnh trước khi upload
- Sử dụng định dạng WebP cho ảnh web
- Kích thước đề xuất: < 1MB

### Viết nội dung
- Sử dụng heading để phân đoạn
- Thêm ảnh minh họa phù hợp
- Kiểm tra lỗi chính tả
- Xem trước trước khi đăng

### Bảo mật
- Validate file type ở cả client và server
- Giới hạn kích thước file
- Sử dụng UUID cho tên file
- Kiểm tra quyền truy cập

## Files đã thay đổi

### Backend
- ✅ `backend/src/main/java/com/doctorappointment/controller/ImageController.java`
- ✅ `backend/src/main/java/com/doctorappointment/service/ImageService.java`

### Frontend
- ✅ `frontend/src/components/RichTextEditor.js` (Mới)
- ✅ `frontend/src/pages/DoctorArticlesPage.js` (Cập nhật)
- ✅ `frontend/package.json` (Thêm react-quill)

### Documentation
- ✅ `RICH_TEXT_EDITOR_GUIDE.md` (File này)

## Status: COMPLETE ✅

Tất cả tính năng đã được triển khai và sẵn sàng sử dụng!
