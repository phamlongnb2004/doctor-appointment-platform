# Cập nhật HomePage.js - Loại bỏ Hardcode Cuối Cùng

## ✅ Đã hoàn thành

1. ✅ SQL đã chạy thành công
2. ✅ Backend đã restart và đang chạy
3. ✅ Đã thêm states: specialties, statistics, certifications
4. ✅ Đã cập nhật fetchAllData để fetch 3 loại data mới

## 🔄 Cần cập nhật tiếp

Do file HomePage.js rất dài (1500+ dòng), tôi sẽ hướng dẫn bạn cập nhật từng phần:

### 1. Xóa các default arrays (không cần nữa)

Tìm và XÓA các dòng sau:

```javascript
// Dòng ~138-157: Xóa defaultSpecialties
const defaultSpecialties = [
  { name: 'Chuyên khoa Nội', icon: '🫁', color: '#1890ff' },
  ...
];

// Dòng ~160-190: Xóa defaultNewsArticles  
const defaultNewsArticles = [
  ...
];
```

### 2. Cập nhật Specialties Section (dòng ~907-980)

TÌM:
```javascript
{/* Specialties Section */}
<div style={{ 
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: 2,
  background: '#f0f0f0',
  borderRadius: 12,
  overflow: 'hidden'
}}>
  {specialties.map((specialty, index) => (
```

THAY BẰNG:
```javascript
{/* Specialties Section */}
<div style={{ 
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: 2,
  background: '#f0f0f0',
  borderRadius: 12,
  overflow: 'hidden'
}}>
  {specialties.length > 0 ? specialties.map((specialty, index) => (
    <div
      key={specialty.id}
      style={{
        background: '#fff',
        padding: '32px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: specialty.isFeatured ? '3px solid #1890ff' : 'none',
        position: 'relative',
        minHeight: 140
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#f0f9ff';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(24,144,255,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#fff';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onClick={() => navigate('/doctors')}
    >
      <div style={{ fontSize: 40, marginBottom: 16 }}>{specialty.icon}</div>
      <div style={{ 
        color: specialty.color, 
        fontWeight: 600,
        fontSize: 14,
        lineHeight: 1.4
      }}>
        {specialty.name}
      </div>
      {specialty.isFeatured && (
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: '#1890ff',
          color: '#fff',
          fontSize: 10,
          padding: '4px 8px',
          borderRadius: 4,
          fontWeight: 600
        }}>
          HOT
        </div>
      )}
    </div>
  )) : (
    <div style={{ padding: 40, textAlign: 'center', gridColumn: '1 / -1' }}>
      <Paragraph>Chưa có dữ liệu chuyên khoa</Paragraph>
    </div>
  )}
</div>
```

### 3. Cập nhật Statistics Section (dòng ~1000-1100)

TÌM phần Statistics với hardcode:
```javascript
<Row gutter={[48, 48]}>
  <Col xs={12} sm={6}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 48, fontWeight: 700, color: '#FFD700' }}>
        30+
      </div>
      <div style={{ fontSize: 16, fontWeight: 500 }}>
        Năm kinh nghiệm
      </div>
    </div>
  </Col>
  ...
</Row>
```

THAY BẰNG:
```javascript
<Row gutter={[48, 48]}>
  {statistics.length > 0 ? statistics.map((stat) => (
    <Col xs={12} sm={6} key={stat.id}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: 48, 
          fontWeight: 700, 
          color: stat.color || '#FFD700',
          marginBottom: 8,
          lineHeight: 1
        }}>
          {stat.icon && <span style={{ marginRight: 8 }}>{stat.icon}</span>}
          {stat.value}
        </div>
        <div style={{ fontSize: 16, fontWeight: 500 }}>
          {stat.label}
        </div>
      </div>
    </Col>
  )) : (
    <Col span={24}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Paragraph>Chưa có dữ liệu thống kê</Paragraph>
      </div>
    </Col>
  )}
</Row>
```

### 4. Cập nhật Certifications Section (dòng ~1100-1200)

TÌM phần Certifications với hardcode:
```javascript
<Row gutter={[32, 32]} justify="center">
  <Col xs={12} sm={8} md={4}>
    <div style={{ 
      textAlign: 'center',
      padding: 24,
      background: '#f8f9fa',
      borderRadius: 12,
      border: '2px solid #1890ff'
    }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🏆</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#1890ff' }}>
        ISO 15189:2022
      </div>
    </div>
  </Col>
  ...
</Row>
```

THAY BẰNG:
```javascript
<Row gutter={[32, 32]} justify="center">
  {certifications.length > 0 ? certifications.map((cert) => (
    <Col xs={12} sm={8} md={4} key={cert.id}>
      <div style={{ 
        textAlign: 'center',
        padding: 24,
        background: '#f8f9fa',
        borderRadius: 12,
        border: `2px solid ${cert.color || '#1890ff'}`,
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>{cert.icon}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: cert.color || '#1890ff' }}>
          {cert.name}
        </div>
        {cert.description && (
          <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
            {cert.description}
          </div>
        )}
      </div>
    </Col>
  )) : (
    <Col span={24}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Paragraph>Chưa có dữ liệu chứng nhận</Paragraph>
      </div>
    </Col>
  )}
</Row>
```

### 5. Cập nhật Testimonials Section (dòng ~1400-1500)

TÌM phần Testimonials với hardcode 3 cards:
```javascript
<Row gutter={[24, 24]}>
  <Col xs={24} md={8}>
    <Card>
      <Avatar src="https://images.unsplash.com/..." />
      <div>Chị Nguyễn Thị Lan</div>
      ...
    </Card>
  </Col>
  ...
</Row>
```

THAY BẰNG:
```javascript
<Row gutter={[24, 24]}>
  {testimonials.length > 0 ? testimonials.map((testimonial) => (
    <Col xs={24} md={8} key={testimonial.id}>
      <Card style={{ 
        borderRadius: 16,
        border: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        height: '100%'
      }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Avatar size={48} src={testimonial.customerImage || 'https://ui-avatars.com/api/?name=' + testimonial.customerName} />
            <div>
              <div style={{ fontWeight: 600, color: '#262626' }}>{testimonial.customerName}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{testimonial.customerTitle}</div>
            </div>
          </div>
          <div style={{ color: '#FFD700', fontSize: 16, marginBottom: 8 }}>
            {'⭐'.repeat(testimonial.rating || 5)}
          </div>
        </div>
        <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, fontStyle: 'italic' }}>
          "{testimonial.testimonialText}"
        </Paragraph>
      </Card>
    </Col>
  )) : (
    <Col span={24}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Paragraph>Chưa có đánh giá khách hàng</Paragraph>
      </div>
    </Col>
  )}
</Row>
```

## ✅ Sau khi cập nhật xong

1. Save file HomePage.js
2. Frontend sẽ tự động reload
3. Truy cập http://localhost:3000
4. Kiểm tra tất cả sections đã hiển thị dynamic data

## 🎯 Kết quả

- ✅ Specialties: 18 chuyên khoa từ database
- ✅ Statistics: 4 số liệu từ database
- ✅ Certifications: 6 chứng nhận từ database
- ✅ Testimonials: Từ database (thay vì hardcode)
- ✅ Tất cả có thể quản lý qua Admin CMS

Bạn muốn tôi tạo file HomePage.js hoàn chỉnh không? Hoặc bạn tự cập nhật theo hướng dẫn trên?
