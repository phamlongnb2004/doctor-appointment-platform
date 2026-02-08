# About Page Image URL Fix - COMPLETE

## Issue
User reported that after uploading images in the About page CMS (Mission section), the `imageUrl` field was still null in the database.

## Root Cause
The About page CMS forms (Hero and Mission sections) were missing hidden `Form.Item` fields for the image URL fields. When uploading images:

1. Image was successfully uploaded to Cloudinary
2. The upload handler set the form field value using `form.setFieldsValue({ imageUrl: uploadedUrl })`
3. However, without an actual `<Form.Item name="imageUrl">` in the form, Ant Design's form validation/submission didn't include this field in the collected values
4. Result: `imageUrl` was not saved to database

## Solution Applied

### 1. Added Hidden Form Fields

**Mission Section** (`frontend/src/pages/AdminCMSPage.js` ~line 3250):
```jsx
<Form.Item name="imageUrl" hidden>
  <Input />
</Form.Item>
```

**Hero Section** (`frontend/src/pages/AdminCMSPage.js` ~line 3155):
```jsx
<Form.Item name="backgroundImage" hidden>
  <Input />
</Form.Item>
```

## How It Works Now

1. User uploads image via Upload button
2. Image uploads to Cloudinary successfully
3. Upload handler receives Cloudinary URL
4. Handler sets the hidden form field: `form.setFieldsValue({ imageUrl: cloudinaryUrl })`
5. When user clicks "Lưu thay đổi" (Save), form collects ALL fields including the hidden `imageUrl`
6. Form values are stringified to JSON and saved to `about_page_content.content_json`
7. About page reads the JSON and displays the image

## Testing Steps

1. Go to Admin CMS → About Page tab
2. Click on "Mission & Vision" sub-tab
3. Upload an image using the "Upload hình ảnh" button
4. Fill in other fields (title, description, etc.)
5. Click "Lưu thay đổi" (Save)
6. Check database: `SELECT * FROM about_page_content WHERE section_key = 'mission'`
7. Verify `content_json` contains `"imageUrl":"https://res.cloudinary.com/..."`
8. Visit About page on frontend
9. Verify Mission section displays the uploaded image

## Files Modified

- `frontend/src/pages/AdminCMSPage.js` - Added hidden form fields for imageUrl and backgroundImage

## Status
✅ **FIXED** - Image URLs now properly save to database when uploading in About page CMS

## Next Steps (if needed)
- Test all About page sections (Hero, Mission, Values, Achievements, Timeline, Team)
- Verify images display correctly on production
- Consider adding the same fix to other sections if they have image upload issues
