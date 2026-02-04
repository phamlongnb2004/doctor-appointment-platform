# Fix Disabled Switch Color - Show Green When Active ✅

## Problem
In Admin CMS tables, Switch components are displayed as `disabled` (read-only, not clickable) to show status. However, disabled switches were showing gray color even when checked/active, making it impossible to distinguish between active and inactive states.

## Root Cause
Ant Design's default behavior sets disabled switches to gray color regardless of checked state. The CSS was not targeting `.ant-switch-disabled` specifically.

## Solution Applied

### 1. Updated Inline CSS in AdminCMSPage
**File**: `frontend/src/pages/AdminCMSPage.js`

Added CSS for disabled switches:
```jsx
const switchStyle = `
  .ant-switch-checked {
    background-color: #10b981 !important;
  }
  .ant-switch-checked:hover:not(.ant-switch-disabled) {
    background-color: #059669 !important;
  }
  .ant-switch-checked.ant-switch-disabled {
    background-color: #10b981 !important;
    opacity: 1 !important;
  }
  .ant-switch.ant-switch-disabled {
    opacity: 0.6 !important;
  }
`;
```

### 2. Updated admin-cms.css
**File**: `frontend/src/styles/admin-cms.css`

Added disabled switch styling:
```css
/* Disabled switches should still show color */
.admin-cms-table .ant-switch-checked.ant-switch-disabled {
  background: #10b981 !important;
  opacity: 1 !important;
}

.admin-cms-table .ant-switch.ant-switch-disabled {
  opacity: 0.6 !important;
}

.ant-switch-checked.ant-switch-disabled {
  background-color: #10b981 !important;
  opacity: 1 !important;
}
```

### 3. Updated global.css
**File**: `frontend/src/styles/global.css`

Added global disabled switch styling:
```css
.ant-switch-checked.ant-switch-disabled {
  background-color: #10b981 !important;
  opacity: 1 !important;
}

.ant-switch.ant-switch-disabled {
  opacity: 0.6 !important;
}
```

## Key Changes
- **Disabled + Checked**: Green #10b981 with full opacity (opacity: 1)
- **Disabled + Unchecked**: Gray with reduced opacity (opacity: 0.6)
- Used `.ant-switch-checked.ant-switch-disabled` selector to target both states
- Applied `!important` to override Ant Design defaults

## Visual Result
### In Table (Disabled Switches):
- ✅ Active/Checked → **Bright green** #10b981 (full opacity)
- ✅ Inactive/Unchecked → **Gray** (60% opacity)

### In Modal Form (Enabled Switches):
- ✅ Active/Checked → **Bright green** #10b981
- ✅ Hover → **Darker green** #059669
- ✅ Inactive/Unchecked → **Gray**

## Files Modified
- `frontend/src/pages/AdminCMSPage.js` - Added disabled switch CSS
- `frontend/src/styles/admin-cms.css` - Enhanced disabled switch styling
- `frontend/src/styles/global.css` - Added global disabled switch styling

## Testing
1. **Hard refresh** the Admin CMS page (Ctrl+F5)
2. Go to any table (Services, Features, Specialties, Statistics, Certifications)
3. Look at "Trạng thái" (Status) column
4. **Active switches** (checked) should show **bright green color**
5. **Inactive switches** (unchecked) should show **gray color**
6. Open edit modal - switch should still be green when active

## Status
✅ Inline CSS updated with disabled switch styling
✅ admin-cms.css updated
✅ global.css updated
✅ Disabled switches now show green when active
✅ Full opacity for active disabled switches
✅ Ready to test - please hard refresh (Ctrl+F5)
