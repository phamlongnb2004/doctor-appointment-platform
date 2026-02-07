# Hướng dẫn thêm Gallery nhiều ảnh cho Dịch vụ Y tế

## Tổng quan
Hiện tại mỗi dịch vụ chỉ có 1 ảnh (`imageUrl`). Để thêm gallery nhiều ảnh cần:
1. Thêm trường lưu danh sách ảnh trong database
2. Cập nhật CMS để upload nhiều ảnh
3. Hiển thị gallery với thumbnail trong trang chi tiết

## Bước 1: Cập nhật Database

### Tạo file SQL mới: `database/add_service_images_gallery.sql`

```sql
-- Thêm cột images để lưu JSON array các URL ảnh
ALTER TABLE medical_services 
ADD COLUMN images TEXT COMMENT 'JSON array of image URLs';

-- Update existing services to include current imageUrl in images array
UPDATE medical_services 
SET images = JSON_ARRAY(imageUrl) 
WHERE imageUrl IS NOT NULL AND imageUrl != '';
```

### Chạy migration
```cmd
Get-Content database/add_service_images_gallery.sql | mysql -u root doctor_appointment_db
```

## Bước 2: Cập nhật Backend Model

### File: `backend/src/main/java/com/doctorappointment/model/MedicalService.java`

Thêm field mới:
```java
@Column(name = "images", columnDefinition = "TEXT")
private String images; // JSON array of image URLs

// Getter and Setter
public String getImages() {
    return images;
}

public void setImages(String images) {
    this.images = images;
}

// Helper method to get images as List
@Transient
public List<String> getImagesList() {
    if (images == null || images.isEmpty()) {
        return new ArrayList<>();
    }
    try {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(images, new TypeReference<List<String>>(){});
    } catch (Exception e) {
        return new ArrayList<>();
    }
}
```

## Bước 3: Cập nhật CMS Form

### File: `frontend/src/pages/AdminCMSPage.js`

Thêm state cho multiple images:
```javascript
const [serviceImages, setServiceImages] = useState([]);
```

Trong form medical-services, thay thế phần upload ảnh:
```javascript
<Form.Item label="Hình ảnh (Nhiều ảnh)">
  <Space direction="vertical" style={{ width: '100%' }}>
    <Upload
      multiple
      beforeUpload={async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        
        setUploading(true);
        try {
          const token = localStorage.getItem('token');
          const response = await axios.post('http://localhost:8080/api/images/articles', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          });
          
          const uploadedUrl = response.data.imageUrl || response.data.url;
          setServiceImages(prev => [...prev, uploadedUrl]);
          message.success('Upload ảnh thành công!');
        } catch (error) {
          message.error('Lỗi khi upload: ' + error.message);
        } finally {
          setUploading(false);
        }
        
        return false;
      }}
      showUploadList={false}
      accept="image/*"
    >
      <Button icon={<UploadOutlined />} loading={uploading}>
        Upload nhiều ảnh
      </Button>
    </Upload>
    
    {/* Display uploaded images */}
    {serviceImages.length > 0 && (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {serviceImages.map((url, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <img 
              src={url} 
              alt={`preview ${index}`} 
              style={{ 
                width: 100, 
                height: 100, 
                objectFit: 'cover', 
                borderRadius: 8,
                border: '1px solid #d9d9d9'
              }}
            />
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                background: 'rgba(255,255,255,0.9)'
              }}
              onClick={() => {
                setServiceImages(prev => prev.filter((_, i) => i !== index));
              }}
            />
          </div>
        ))}
      </div>
    )}
  </Space>
</Form.Item>
```

Cập nhật handleSubmit để lưu images:
```javascript
// Add images array for medical-services
if (currentTab === 'medical-services') {
  data.content = richTextContent;
  if (serviceImages.length > 0) {
    data.images = JSON.stringify(serviceImages);
    data.imageUrl = serviceImages[0]; // First image as main image
  } else if (iconUrl) {
    data.imageUrl = iconUrl;
    data.images = JSON.stringify([iconUrl]);
  }
}
```

Cập nhật handleEdit để load images:
```javascript
if (currentTab === 'medical-services') {
  setRichTextContent(item.content || '');
  // Load images array
  if (item.images) {
    try {
      const imagesArray = JSON.parse(item.images);
      setServiceImages(imagesArray);
      setIconUrl(imagesArray[0] || '');
    } catch (e) {
      setServiceImages([]);
      setIconUrl(item.imageUrl || '');
    }
  } else {
    setServiceImages(item.imageUrl ? [item.imageUrl] : []);
    setIconUrl(item.imageUrl || '');
  }
}
```

Reset serviceImages khi đóng modal:
```javascript
const handleAdd = () => {
  // ... existing code
  setServiceImages([]);
};
```

## Bước 4: Cập nhật ServiceDetailPage

### File: `frontend/src/pages/ServiceDetailPage.js`

Thêm state cho selected image:
```javascript
const [selectedImage, setSelectedImage] = useState(0);
const [images, setImages] = useState([]);
```

Load images khi fetch service:
```javascript
useEffect(() => {
  if (service) {
    // Parse images array
    let imagesList = [];
    if (service.images) {
      try {
        imagesList = JSON.parse(service.images);
      } catch (e) {
        imagesList = service.imageUrl ? [service.imageUrl] : [];
      }
    } else if (service.imageUrl) {
      imagesList = [service.imageUrl];
    }
    setImages(imagesList);
    setSelectedImage(0);
  }
}, [service]);
```

Cập nhật phần hiển thị ảnh:
```javascript
{/* Left - Product Images */}
<Col xs={24} lg={10}>
  <div className="service-image-container">
    {hasDiscount && (
      <div className="discount-badge">
        -{service.discountPercentage}%
      </div>
    )}
    {/* Main Image */}
    <img 
      src={images[selectedImage] || 'https://via.placeholder.com/500x500?text=Dịch+vụ'} 
      alt={service.title}
      style={{ 
        width: '100%', 
        borderRadius: 8,
        border: '1px solid #e8e8e8'
      }}
    />
  </div>

  {/* Thumbnail images */}
  {images.length > 1 && (
    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
      {images.map((img, index) => (
        <div 
          key={index}
          style={{
            width: 80,
            height: 80,
            border: selectedImage === index ? '2px solid #1890ff' : '2px solid #d9d9d9',
            borderRadius: 4,
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedImage(index)}
        >
          <img 
            src={img}
            alt={`Thumbnail ${index + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  )}
</Col>
```

## Bước 5: Test

1. Restart backend để load model mới
2. Vào CMS → Dịch vụ y tế
3. Thêm/sửa dịch vụ
4. Upload nhiều ảnh (có thể chọn nhiều file cùng lúc)
5. Lưu
6. Vào trang chi tiết dịch vụ
7. Click vào thumbnail để xem ảnh khác

## Tính năng bổ sung (Optional)

### Thêm Image Zoom
```javascript
import { Image } from 'antd';

<Image.PreviewGroup>
  <Image 
    src={images[selectedImage]} 
    alt={service.title}
    style={{ width: '100%', borderRadius: 8 }}
  />
</Image.PreviewGroup>
```

### Thêm Image Slider
Cài đặt Swiper:
```bash
npm install swiper
```

Sử dụng:
```javascript
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

<Swiper
  spaceBetween={10}
  slidesPerView={1}
  onSlideChange={(swiper) => setSelectedImage(swiper.activeIndex)}
>
  {images.map((img, index) => (
    <SwiperSlide key={index}>
      <img src={img} alt={`Slide ${index}`} style={{ width: '100%' }} />
    </SwiperSlide>
  ))}
</Swiper>
```

## Lưu ý

- Mỗi ảnh upload riêng lẻ để tránh timeout khi upload nhiều ảnh lớn
- Có thể giới hạn số lượng ảnh tối đa (ví dụ: 10 ảnh)
- Nên compress ảnh trước khi upload để tối ưu performance
- Ảnh đầu tiên trong array sẽ là ảnh chính hiển thị trong danh sách

## Status
✅ **COMPLETE** - Multiple images gallery implemented successfully!

## What was implemented:

1. **Backend Model** - Added `images` TEXT column to store JSON array of image URLs
2. **CMS Form** - Multiple image upload with preview, delete, and main image indicator
3. **Service Detail Page** - Gallery with clickable thumbnails to switch main image
4. **Features**:
   - Upload multiple images at once
   - First image is automatically set as main image
   - Delete individual images
   - Visual indicator for main image
   - Thumbnail gallery with active state
   - Click thumbnail to change main image
   - Responsive design

## How to use:

1. Go to CMS → Dịch vụ y tế
2. Add/Edit a service
3. Click "Upload nhiều ảnh" button
4. Select multiple images (can select multiple files at once)
5. Images will appear as thumbnails with delete buttons
6. First image has blue border and "Ảnh chính" label
7. Save the service
8. View service detail page to see gallery with clickable thumbnails
