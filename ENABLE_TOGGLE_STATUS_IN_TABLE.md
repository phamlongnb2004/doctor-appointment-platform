# Enable Toggle Status in Table - Complete ✅

## Feature
Added ability to toggle isActive status directly from table without opening edit modal. Users can now click the Switch in the "Trạng thái" column to instantly activate/deactivate items.

## Changes Made

### 1. Added handleToggleStatus Function
**File**: `frontend/src/pages/AdminCMSPage.js`

Created new function to handle status toggle:
```jsx
const handleToggleStatus = async (id, currentStatus, type) => {
  try {
    const newStatus = !currentStatus;
    const updateData = { isActive: newStatus };
    
    switch (type) {
      case 'homepage':
        await cmsAPI.updateHomePageContent(id, updateData);
        break;
      case 'services':
        await cmsAPI.updateService(id, updateData);
        break;
      // ... all other types
    }
    
    message.success(newStatus ? 'Đã kích hoạt!' : 'Đã tắt!');
    fetchAllData();
  } catch (error) {
    message.error('Lỗi khi cập nhật trạng thái: ' + error.message);
  }
};
```

### 2. Updated All Table Column Definitions
Changed Switch from `disabled` to clickable with `onChange` handler.

**Before**:
```jsx
{ 
  title: 'Trạng thái', 
  dataIndex: 'isActive', 
  key: 'isActive',
  render: (isActive) => <Switch checked={isActive} disabled />
}
```

**After**:
```jsx
{ 
  title: 'Trạng thái', 
  dataIndex: 'isActive', 
  key: 'isActive',
  render: (isActive, record) => (
    <Switch 
      checked={isActive} 
      onChange={() => handleToggleStatus(record.id, isActive, 'services')}
    />
  )
}
```

### 3. Updated Tables
Applied to all 9 tables:
1. ✅ Homepage Content (homePageColumns)
2. ✅ Services (servicesColumns)
3. ✅ News Articles (newsColumns)
4. ✅ Testimonials (testimonialsColumns)
5. ✅ Features (featuresColumns)
6. ✅ Banners (bannerColumns)
7. ✅ Specialties (specialtiesColumns)
8. ✅ Statistics (statisticsColumns)
9. ✅ Certifications (certificationsColumns)

## How It Works

1. **User clicks Switch** in "Trạng thái" column
2. **handleToggleStatus** is called with:
   - `id`: Item ID
   - `currentStatus`: Current isActive value
   - `type`: Table type (services, features, etc.)
3. **API call** updates only `isActive` field
4. **Success message** shows "Đã kích hoạt!" or "Đã tắt!"
5. **Table refreshes** to show updated status

## Benefits

- ✅ **Quick toggle**: No need to open edit modal
- ✅ **Instant feedback**: Success message confirms action
- ✅ **Visual update**: Table refreshes automatically
- ✅ **Green color**: Active switches show green (#10b981)
- ✅ **Better UX**: Faster workflow for admins

## User Experience

### Before:
1. Click Edit button
2. Wait for modal to open
3. Toggle switch in modal
4. Click OK
5. Wait for save
6. Modal closes

### After:
1. Click switch in table → Done! ✅

## API Calls
Each toggle makes a PATCH/PUT request to update only the `isActive` field:
```javascript
// Example for services
PUT /api/cms/services/{id}
Body: { isActive: true }
```

## Files Modified
- `frontend/src/pages/AdminCMSPage.js` - Added handleToggleStatus + updated 9 column definitions

## Testing
1. Go to Admin CMS → Any section (Services, Features, etc.)
2. Look at "Trạng thái" column
3. Click on a Switch
4. Should see success message: "Đã kích hoạt!" or "Đã tắt!"
5. Switch should change color (green when ON, gray when OFF)
6. Table should refresh automatically
7. Check homepage to verify item is shown/hidden

## Status
✅ handleToggleStatus function added
✅ All 9 tables updated
✅ Switch now clickable (not disabled)
✅ Success messages added
✅ Auto-refresh after toggle
✅ Green color for active switches
✅ Ready to test
