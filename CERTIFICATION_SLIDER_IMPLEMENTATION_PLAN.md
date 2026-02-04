# Certification Slider Implementation Plan

## ✅ Completed Steps

### 1. Database Update
- ✅ Added `image_url` column to `certifications` table
- ✅ Updated existing records with sample descriptions
- ✅ SQL file: `database/update_certifications_add_fields.sql`

### 2. Backend Model Update
- ✅ Added `imageUrl` field to `Certification.java` model
- ✅ Field mapped to `image_url` column in database

### 3. Frontend Title Update
- ✅ Changed section title from "CHỨNG NHẬN & GIẢI THƯỞNG" to "CHỨNG CHỈ VÀ CƠ SỞ VẬT CHẤT"

## 🔄 Next Steps

### 4. Update CMS Form (AdminCMSPage.js)
**Location**: Around line 2341

**Changes needed**:
1. Change tab name from "Chứng nhận & Giải thưởng" to "Chứng chỉ và cơ sở vật chất"
2. Add image upload field (similar to banners/features)
3. Add description textarea (already exists, just need to make it visible)
4. Update form submission to handle image upload

**Code structure**:
```javascript
// In certifications form section
<Form.Item label="Tên chứng chỉ">
  <Input value={currentName} onChange={(e) => setCurrentName(e.target.value)} />
</Form.Item>

<Form.Item label="Mô tả">
  <Input.TextArea 
    rows={4}
    value={currentDescription} 
    onChange={(e) => setCurrentDescription(e.target.value)} 
    placeholder="Nhập mô tả chi tiết về chứng chỉ"
  />
</Form.Item>

<Form.Item label="Ảnh chứng chỉ">
  <Upload
    listType="picture-card"
    maxCount={1}
    beforeUpload={() => false}
    onChange={handleCertImageChange}
  >
    {!certImageUrl && <div><PlusOutlined /><div>Upload</div></div>}
  </Upload>
  {certImageUrl && <img src={certImageUrl} style={{width: 100}} />}
</Form.Item>
```

### 5. Update CMS API Calls
**File**: `frontend/src/services/cmsApi.js`

**Add/Update**:
```javascript
// Upload certification image
uploadCertificationImage: (formData) => api.post('/cms/certifications/upload-image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
}),
```

### 6. Update Backend Controller
**File**: `backend/src/main/java/com/doctorappointment/controller/CMSController.java`

**Add endpoint**:
```java
@PostMapping("/certifications/upload-image")
public ResponseEntity<Map<String, String>> uploadCertificationImage(
    @RequestParam("file") MultipartFile file) {
    try {
        String imageUrl = imageService.saveImage(file, "certifications");
        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
```

### 7. Create Certification Slider Component
**File**: `frontend/src/components/CertificationSlider.js`

**Features**:
- Display certification images in a carousel
- Show description text alongside images
- Navigation dots at bottom
- Auto-play with pause on hover
- Responsive design

**Structure**:
```javascript
import React, { useState } from 'react';
import { Carousel } from 'antd';

function CertificationSlider({ certifications }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  return (
    <div className="certification-slider">
      <Carousel
        autoplay
        dots={{ className: 'custom-dots' }}
        afterChange={setCurrentSlide}
      >
        {certifications.map((cert) => (
          <div key={cert.id} className="cert-slide">
            <div className="cert-image">
              <img src={cert.imageUrl || cert.icon} alt={cert.name} />
            </div>
            <div className="cert-content">
              <h3>{cert.name}</h3>
              <p>{cert.description}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default CertificationSlider;
```

### 8. Update HomePage to Use Slider
**File**: `frontend/src/pages/HomePage.js`

**Replace certifications section** (around line 875-950):
```javascript
import CertificationSlider from '../components/CertificationSlider';

// In render:
{certifications.length > 0 && (
  <div className="certifications-section">
    <div className="certifications-container">
      <div className="certifications-header">
        <Title level={2}>CHỨNG CHỈ VÀ CƠ SỞ VẬT CHẤT</Title>
        <Paragraph>Được công nhận bởi các tổ chức uy tín</Paragraph>
      </div>
      
      <CertificationSlider certifications={certifications} />
      
      {/* Facilities section below */}
      <div className="facilities-section">
        <Title level={3}>CƠ SỞ VẬT CHẤT</Title>
        <Row gutter={[24, 24]}>
          {/* Display facility images/info */}
        </Row>
      </div>
    </div>
  </div>
)}
```

### 9. Add Slider Styles
**File**: `frontend/src/styles/homepage.css`

**Add**:
```css
/* Certification Slider */
.certification-slider {
  max-width: 1000px;
  margin: 0 auto 60px;
}

.cert-slide {
  display: flex !important;
  gap: 40px;
  align-items: center;
  padding: 40px;
}

.cert-image {
  flex: 1;
  max-width: 500px;
}

.cert-image img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.cert-content {
  flex: 1;
  text-align: left;
}

.cert-content h3 {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16px;
}

.cert-content p {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
}

/* Custom dots */
.custom-dots {
  bottom: -40px !important;
}

.custom-dots li button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d9d9d9;
}

.custom-dots li.slick-active button {
  width: 32px;
  border-radius: 6px;
  background: #1890ff;
}

/* Facilities Section */
.facilities-section {
  margin-top: 80px;
}

.facilities-section h3 {
  text-align: center;
  font-size: 28px;
  margin-bottom: 40px;
  color: #262626;
}
```

### 10. Testing Checklist
- [ ] Upload certification image in CMS
- [ ] Add/edit certification with description
- [ ] View slider on homepage
- [ ] Test slider navigation (dots, auto-play)
- [ ] Test responsive design on mobile
- [ ] Verify image URLs are saved correctly
- [ ] Test with multiple certifications (3-6 items)

## 📝 Notes

### Image Upload Requirements
- **Accepted formats**: JPG, PNG, WEBP
- **Max size**: 5MB
- **Recommended dimensions**: 800x600px or 1200x900px
- **Storage location**: `uploads/certifications/`

### Slider Behavior
- **Auto-play**: 5 seconds per slide
- **Pause on hover**: Yes
- **Loop**: Infinite
- **Transition**: Fade or slide (configurable)
- **Mobile**: Swipe enabled

### CMS Form Fields
1. **Tên chứng chỉ** (name) - Required, text input
2. **Mô tả** (description) - Optional, textarea
3. **Ảnh** (imageUrl) - Optional, file upload
4. **Icon** (icon) - Optional, kept for backward compatibility
5. **Màu sắc** (color) - Optional, color picker
6. **Thứ tự hiển thị** (displayOrder) - Number input
7. **Trạng thái** (isActive) - Toggle switch

## 🚀 Implementation Priority

1. **High Priority** (Core functionality):
   - CMS image upload
   - Slider component
   - Homepage integration

2. **Medium Priority** (Enhancement):
   - Facilities section
   - Advanced slider controls
   - Image optimization

3. **Low Priority** (Nice to have):
   - Slider animations
   - Lightbox for images
   - Admin preview

## ⚠️ Important Considerations

1. **Backward Compatibility**: Keep `icon` field for existing certifications without images
2. **Performance**: Optimize images before upload (consider adding image compression)
3. **Accessibility**: Add alt text for all images
4. **SEO**: Use descriptive file names and alt attributes
5. **Mobile**: Ensure slider works well on touch devices

## 📚 Reference Files

- Database: `database/update_certifications_add_fields.sql`
- Model: `backend/src/main/java/com/doctorappointment/model/Certification.java`
- Controller: `backend/src/main/java/com/doctorappointment/controller/CMSController.java`
- CMS Page: `frontend/src/pages/AdminCMSPage.js`
- HomePage: `frontend/src/pages/HomePage.js`
- Styles: `frontend/src/styles/homepage.css`
- API: `frontend/src/services/cmsApi.js`
