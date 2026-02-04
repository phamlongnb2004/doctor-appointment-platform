# Admin Mobile Responsive - Hướng dẫn sửa đúng cách

## Vấn đề hiện tại
CSS không hoạt động vì Ant Design Layout sử dụng inline styles và có specificity cao hơn.

## Giải pháp đúng

### 1. Sử dụng Ant Design Sider Props

Trong file `AdminDashboard.js` và `AdminCMSPage.js`, cần thêm props cho Sider:

```javascript
<Sider
  breakpoint="md"  // Collapse at 768px
  collapsedWidth="0"  // Width = 0 when collapsed
  onBreakpoint={(broken) => {
    console.log(broken);
  }}
  trigger={null}  // Hide default trigger
  style={{
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
  }}
>
  {/* Menu content */}
</Sider>
```

### 2. Thêm responsive Layout props

```javascript
<Layout hasSider>
  <Sider
    breakpoint="md"
    collapsedWidth="0"
    // ... other props
  />
  <Layout style={{ marginLeft: 200 }}>  {/* Remove margin on mobile */}
    <Content>
      {/* Content */}
    </Content>
  </Layout>
</Layout>
```

### 3. Sử dụng CSS với !important và inline styles

Nếu vẫn không work, cần override trực tiếp trong component:

```javascript
const isMobile = window.innerWidth <= 768;

<Layout>
  {!isMobile && (
    <Sider>
      {/* Sidebar content */}
    </Sider>
  )}
  <Layout style={{ marginLeft: isMobile ? 0 : 200 }}>
    <Content>
      {/* Content */}
    </Content>
  </Layout>
</Layout>
```

### 4. Sử dụng useMediaQuery hook

```javascript
import { useMediaQuery } from 'react-responsive';

function AdminDashboard() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  return (
    <Layout>
      {!isMobile && <Sider>...</Sider>}
      <Layout style={{ marginLeft: isMobile ? 0 : 200 }}>
        ...
      </Layout>
    </Layout>
  );
}
```

## Các file cần sửa

1. **frontend/src/pages/AdminDashboard.js**
   - Thêm breakpoint prop cho Sider
   - Thêm responsive margin cho Content
   - Thêm mobile menu button (hamburger)

2. **frontend/src/pages/AdminCMSPage.js**
   - Thêm breakpoint prop cho Sider
   - Thêm responsive margin cho Content
   - Thêm mobile menu button

3. **frontend/src/styles/admin.css**
   - Đã có CSS responsive (có thể cần điều chỉnh)

4. **frontend/src/styles/admin-cms.css**
   - Đã có CSS responsive (có thể cần điều chỉnh)

## Cách test

1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Open DevTools
4. Toggle device toolbar (Ctrl+Shift+M)
5. Select mobile device
6. Check if sidebar is hidden
7. Check if content is full width

## Nếu vẫn không work

Có thể cần:
1. Check xem CSS file có được import không
2. Check xem có CSS conflict không (inspect element)
3. Sử dụng inline styles thay vì CSS file
4. Sử dụng conditional rendering thay vì CSS

## Khuyến nghị

Vì tôi không thể sửa trực tiếp code component (chỉ có thể sửa CSS), bạn có 2 lựa chọn:

**Option 1**: Cho tôi xem code của AdminDashboard.js và AdminCMSPage.js để tôi có thể sửa đúng

**Option 2**: Tự sửa theo hướng dẫn trên (thêm breakpoint prop cho Sider)

**Option 3**: Accept rằng admin page là desktop-only (như hầu hết các admin panel)
