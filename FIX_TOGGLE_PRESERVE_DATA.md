# Fix Toggle Status - Preserve All Data ✅

## Problem
When toggling Switch OFF, the item's content (title, description, etc.) was being lost and showing "Không có" in the table.

## Root Cause
The `handleToggleStatus` function was only sending `{ isActive: newStatus }` to the backend. The backend PUT/UPDATE endpoint was replacing the entire record with just this one field, causing all other fields to become null or empty.

## Solution
Modified `handleToggleStatus` to:
1. **Get current item data** from state
2. **Spread all existing fields** into updateData
3. **Only change isActive** field
4. **Remove datetime fields** (let backend handle them)
5. **Send complete data** to backend

## Changes Made

### Before (Incorrect):
```javascript
const handleToggleStatus = async (id, currentStatus, type) => {
  const newStatus = !currentStatus;
  const updateData = { isActive: newStatus }; // ❌ Only this field!
  
  await cmsAPI.updateService(id, updateData);
  // Result: All other fields become null
};
```

### After (Correct):
```javascript
const handleToggleStatus = async (id, currentStatus, type) => {
  const newStatus = !currentStatus;
  
  // Get current item from state
  const currentItem = services.find(item => item.id === id);
  
  // Keep ALL existing data, only change isActive
  const updateData = {
    ...currentItem,        // ✅ All existing fields
    isActive: newStatus    // ✅ Only change this
  };
  
  // Remove datetime fields
  delete updateData.createdAt;
  delete updateData.updatedAt;
  delete updateData.publishedAt;
  
  await cmsAPI.updateService(id, updateData);
  // Result: All fields preserved, only isActive changed
};
```

## How It Works Now

1. **User clicks Switch** to toggle OFF
2. **Find current item** in state array (services, features, etc.)
3. **Spread all fields** from current item
4. **Change only isActive** to false
5. **Send complete object** to backend
6. **Backend updates** record with all fields intact
7. **Table refreshes** - all content still visible, just Switch is gray

## Example Flow

### Toggle Service OFF:
```javascript
// Current item in state:
{
  id: 1,
  title: "Đặt lịch khám",
  description: "Quy khách hàng sử dụng...",
  imageUrl: "http://...",
  color: "#10b981",
  isActive: true,
  displayOrder: 1
}

// After toggle OFF:
{
  id: 1,
  title: "Đặt lịch khám",           // ✅ Preserved
  description: "Quy khách hàng...",  // ✅ Preserved
  imageUrl: "http://...",            // ✅ Preserved
  color: "#10b981",                  // ✅ Preserved
  isActive: false,                   // ✅ Changed
  displayOrder: 1                    // ✅ Preserved
}
```

## Benefits

- ✅ All content preserved when toggling
- ✅ Title, description, images stay intact
- ✅ Only isActive field changes
- ✅ Can toggle ON/OFF without losing data
- ✅ No need to re-enter information

## Files Modified
- `frontend/src/pages/AdminCMSPage.js` - Updated handleToggleStatus function

## Testing

1. Go to Admin CMS → Services (or any section)
2. Note the title and description of an item
3. Toggle Switch OFF
4. Check table → Title and description still visible ✅
5. Switch shows gray ✅
6. Toggle Switch ON
7. Check table → All data still there ✅
8. Switch shows green ✅
9. Check homepage → Item appears/disappears based on status ✅

## Status
✅ handleToggleStatus updated to preserve all data
✅ Only isActive field changes
✅ All content (title, description, etc.) preserved
✅ Ready to test
