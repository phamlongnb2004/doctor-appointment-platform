# Fix Remaining Hardcoded URLs

## Files cần fix thủ công (quá nhiều chỗ):

### 1. frontend/src/pages/DoctorArticlesPage.js
Thêm ở đầu file (sau imports):
```javascript
// Get API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
```

Thay thế:
- Line 93: `http://localhost:8080/api/doctors/user/${user.id}` → `${API_BASE_URL}/doctors/user/${user.id}`
- Line 295: `http://localhost:8080/api/images/articles` → `${API_BASE_URL}/images/articles`

### 2. frontend/src/pages/AdminDashboard.js
Thêm ở đầu file (sau imports):
```javascript
// Get API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
```

Thay thế:
- Line 112: `http://localhost:8080${response.data.profileImage}` → `${API_BASE_URL.replace('/api', '')}${response.data.profileImage}`
- Line 132: `http://localhost:8080/api/api/newsletter/subscribers` → `${API_BASE_URL}/newsletter/subscribers` (fix double /api/)
- Line 137: `http://localhost:8080/api/orders/all` → `${API_BASE_URL}/orders/all`
- Line 215: `http://localhost:8080/api/users/${userId}/promote` → `${API_BASE_URL}/users/${userId}/promote`
- Line 240: `http://localhost:8080/api/users/${userId}/promote` → `${API_BASE_URL}/users/${userId}/promote`
- Line 855: `http://localhost:8080/api/api/newsletter/subscribers/${record.id}/toggle` → `${API_BASE_URL}/newsletter/subscribers/${record.id}/toggle` (fix double /api/)
- Line 906: `http://localhost:8080/api/api/newsletter/subscribers/${record.id}` → `${API_BASE_URL}/newsletter/subscribers/${record.id}` (fix double /api/)
- Line 1111: `http://localhost:8080/api/orders/${record.id}/status` → `${API_BASE_URL}/orders/${record.id}/status`

## Đã fix:
✅ PaymentTestPage.js
✅ OrderSuccessPage.js
✅ MyOrdersPage.js
✅ CheckoutPage.js
✅ RichTextEditor.js
✅ HomePage.js
✅ AdminCMSPage.js
✅ LoginPage.js
✅ websocket.js
✅ chatWebSocket.js
