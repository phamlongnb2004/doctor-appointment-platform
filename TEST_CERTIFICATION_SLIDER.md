# How to Test Certification Slider

## Quick Test Steps

### 1. Access Admin CMS
1. Open browser: `http://localhost:3000`
2. Login as admin
3. Go to Admin Dashboard
4. Click "Quản lý CMS"

### 2. Navigate to Certifications
1. In the left menu, find "Chứng chỉ và cơ sở vật chất" (under "Trang chủ" section)
2. Click on it
3. You should see the certifications table

### 3. Add Image to Existing Certification
1. Click the Edit button (pencil icon) on "ISO 15189:2022"
2. In the form, you'll see:
   - Tên chứng chỉ: ISO 15189:2022
   - Mô tả: (empty - add description)
   - **Ảnh chứng chỉ (Slider)**: Click "Upload Ảnh Chứng chỉ"
   - Icon: (optional)
   - Màu sắc: (color picker)
3. Add a description like: "Chứng nhận chất lượng phòng xét nghiệm y tế quốc tế"
4. Click "Upload Ảnh Chứng chỉ" and select an image from your computer
5. Wait for upload to complete (you'll see preview)
6. Click OK to save

### 4. View on Homepage
1. Go to homepage: `http://localhost:3000`
2. Scroll down to "CHỨNG CHỈ VÀ CƠ SỞ VẬT CHẤT" section
3. You should see:
   - The certification image displayed
   - Description text overlay
   - Navigation dots at the bottom
   - Auto-play after 5 seconds

### 5. Test Slider Navigation
1. Click on the dots at the bottom
2. Slider should change to different certifications
3. Wait 5 seconds - slider should auto-advance

### 6. Add More Certifications
1. Go back to Admin CMS → Chứng chỉ và cơ sở vật chất
2. Click "Thêm chứng nhận"
3. Fill in:
   - Tên chứng chỉ: "Cơ sở vật chất hiện đại"
   - Mô tả: "Trang thiết bị y tế hiện đại, đạt chuẩn quốc tế"
   - Upload an image of medical facilities
   - Choose a color
4. Save and view on homepage

## Expected Results

### Admin CMS
- ✅ Menu shows "Chứng chỉ và cơ sở vật chất" (not "Chứng nhận & Giải thưởng")
- ✅ Form has image upload field
- ✅ Image preview shows after upload
- ✅ Table shows image preview in first column
- ✅ Can edit and update images

### Homepage
- ✅ Section title is "CHỨNG CHỈ VÀ CƠ SỞ VẬT CHẤT"
- ✅ Slider shows certification images
- ✅ Description text appears over image
- ✅ Navigation dots work
- ✅ Auto-play works (5 second interval)
- ✅ Smooth fade transitions
- ✅ Responsive on mobile

## Sample Images to Use

You can use any images, but here are suggestions:
1. **ISO Certificate**: Any ISO certification image
2. **Medical Facility**: Hospital room, lab equipment
3. **Award**: Trophy or award certificate
4. **Building**: Hospital building exterior
5. **Equipment**: MRI machine, CT scanner, etc.

## Troubleshooting

### Image not uploading
- Check file size (should be < 5MB)
- Check file format (JPG, PNG, WEBP)
- Check backend is running on port 8080
- Check browser console for errors

### Slider not showing
- Make sure at least one certification has an image
- Check browser console for errors
- Hard refresh (Ctrl+F5)
- Check certification is active (is_active = 1)

### Changes not appearing
- Hard refresh browser (Ctrl+F5)
- Clear browser cache
- Check backend logs for errors

## Current Database Status

Existing certifications (without images):
1. ISO 15189:2022
2. CAP ACCREDITED
3. Bộ Y Tế
4. TOP 10 VN
5. JCI STANDARD

All are active but need images to appear in slider.

## Next Steps After Testing

1. Add images to all 5 certifications
2. Add descriptions to each
3. Test on mobile devices
4. Adjust colors if needed
5. Reorder certifications if needed
6. Add more certifications for facilities

---
**Ready to test!** Follow the steps above and report any issues.
