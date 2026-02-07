# Fix: CMS Admin Page 400 Error

## Problem
Trang CMS Admin hiển thị lỗi:
```
Lỗi khi tải dữ liệu: Request failed with status code 400
```

## Root Cause
Các API endpoints trong `cmsApi.js` không khớp với backend endpoints thực tế:

### Sai:
- `getAllNewsCategories()` → `/cms/news-categories` (public endpoint)
- `getAllNewsSections()` → `/cms/admin/news-sections/all` (không tồn tại)
- `getAllNewsSidebarWidgets()` → `/cms/admin/news-sidebar-widgets/all` (không tồn tại)
- `getAllAboutSections()` → `/cms/admin/about/all` (không tồn tại)

### Đúng (Backend endpoints):
- News Categories: `/cms/admin/news-categories`
- News Sections: `/cms/admin/news-sections`
- News Sidebar Widgets: `/cms/admin/news-sidebar-widgets`
- About Sections: `/cms/about`

## Solution
Sửa các API endpoints trong `frontend/src/services/cmsApi.js`:

### 1. getAllNewsCategories
```javascript
// Before
getAllNewsCategories: () => axios.get(`${API_BASE_URL}/cms/news-categories`),

// After
getAllNewsCategories: () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_BASE_URL}/cms/admin/news-categories`, {
    headers: { Authorization: `Bearer ${token}` }
  });
},
```

### 2. getAllNewsSections
```javascript
// Before
getAllNewsSections: () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_BASE_URL}/cms/admin/news-sections/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
},

// After
getAllNewsSections: () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_BASE_URL}/cms/admin/news-sections`, {
    headers: { Authorization: `Bearer ${token}` }
  });
},
```

### 3. getAllNewsSidebarWidgets
```javascript
// Before
getAllNewsSidebarWidgets: () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_BASE_URL}/cms/admin/news-sidebar-widgets/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
},

// After
getAllNewsSidebarWidgets: () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_BASE_URL}/cms/admin/news-sidebar-widgets`, {
    headers: { Authorization: `Bearer ${token}` }
  });
},
```

### 4. getAllAboutSections
```javascript
// Before
getAllAboutSections: () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_BASE_URL}/cms/admin/about/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
},

// After
getAllAboutSections: () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_BASE_URL}/cms/about`, {
    headers: { Authorization: `Bearer ${token}` }
  });
},
```

## Additional Improvements
Thêm error logging chi tiết hơn trong `AdminCMSPage.js`:

```javascript
const fetchWithFallback = async (adminEndpoint, publicEndpoint) => {
  try {
    console.log('Fetching:', adminEndpoint);
    return await axios.get(adminEndpoint, { headers });
  } catch (error) {
    console.error(`Error fetching ${adminEndpoint}:`, error.response?.status, error.response?.data);
    console.log(`Admin endpoint not available, using public: ${publicEndpoint}`);
    return await axios.get(publicEndpoint);
  }
};
```

## Result
✅ Trang CMS Admin load thành công
✅ Tất cả dữ liệu hiển thị đúng
✅ Không còn lỗi 400
✅ Frontend compiled successfully

## Files Modified
- `frontend/src/services/cmsApi.js` - Sửa 4 API endpoints
- `frontend/src/pages/AdminCMSPage.js` - Thêm error logging

## Status
**COMPLETE** - Trang CMS Admin hoạt động bình thường.
