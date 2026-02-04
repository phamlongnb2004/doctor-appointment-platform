# Sửa lỗi Layout Type không được lưu cho News Sections

## Vấn đề
Khi admin chọn layout type (Default hoặc Grid) trong CMS cho News Sections và ấn lưu, sau khi reload trang thì layout vẫn giữ nguyên như cũ, không thay đổi theo lựa chọn.

## Nguyên nhân

### 1. Logic trong NewsSection component
```javascript
// TRƯỚC (SAI)
const useGridLayout = layoutType === 'grid' || isHomePage;
```

Logic này có nghĩa là:
- Nếu `isHomePage = true` → **LUÔN** dùng grid (bất kể `layoutType` là gì)
- Điều này khiến cho dù admin chọn layout gì trong CMS, HomePage vẫn luôn hiển thị grid

### 2. Prop isHomePage được truyền vào
```javascript
// HomePage.js
<NewsSection 
  layoutType={section.layoutType || 'default'}
  isHomePage={true}  // ← Force grid layout
/>
```

## Giải pháp

### 1. Sửa logic trong NewsSection component
**File**: `frontend/src/components/NewsSection.js`

```javascript
// SAU (ĐÚNG)
const useGridLayout = layoutType === 'grid';
```

Bây giờ layout chỉ phụ thuộc vào `layoutType` từ database, không bị force bởi `isHomePage`.

### 2. Bỏ prop isHomePage khỏi HomePage
**File**: `frontend/src/pages/HomePage.js`

```javascript
// TRƯỚC
<NewsSection 
  layoutType={section.layoutType || 'default'}
  isHomePage={true}
/>

// SAU
<NewsSection 
  layoutType={section.layoutType || 'default'}
/>
```

### 3. Thêm default value khi edit
**File**: `frontend/src/pages/AdminCMSPage.js`

```javascript
const handleEdit = (item) => {
  // ...
  
  // Set default layoutType if not present for news-sections
  if (currentTab === 'news-sections' && !formData.layoutType) {
    formData.layoutType = 'default';
  }
  
  form.setFieldsValue(formData);
  // ...
};
```

### 4. Thêm debug logs
**Frontend**: `frontend/src/pages/AdminCMSPage.js`
```javascript
// Debug log for news-sections
if (currentTab === 'news-sections') {
  console.log('News Section d