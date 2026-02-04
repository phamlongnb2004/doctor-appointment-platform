# Hướng dẫn Refactor HomePage với BEM

## Tổng quan
File `HomePage.js` hiện đang sử dụng inline styles. Cần chuyển tất cả sang CSS file với chuẩn BEM (Block Element Modifier).

## Chuẩn BEM đã áp dụng

### Cấu trúc BEM:
- **Block**: `.homepage` - Component chính
- **Element**: `.homepage__services`, `.homepage__doctors` - Các phần tử con
- **Modifier**: `.homepage__title--highlight` - Biến thể của element

### Mapping từ inline styles sang BEM classes:

#### 1. Services Section
```jsx
// CŨ (inline):
<div style={{ background: '#f8f9fa', padding: '80px 24px' }}>

// MỚI (BEM):
<div className="homepage__services">
```

#### 2. Booking Card
```jsx
// CŨ:
<Card style={{ height: '100%', borderRadius: 16, ... }}>

// MỚI:
<Card className="homepage__booking-card">
```

#### 3. Service Cards
```jsx
// CŨ:
<Card hoverable style={{ height: '100%', minHeight: 280, ... }}>

// MỚI:
<Card hoverable className="homepage__service-card">
```

## Các class BEM đã định nghĩa trong homepage.css

### Loading
- `.homepage__loading`
- `.homepage__loading-content`
- `.homepage__loading-spinner`
- `.homepage__loading-text`

### Services Section
- `.homepage__services`
- `.homepage__services-container`
- `.homepage__services-header`
- `.homepage__services-title`
- `.homepage__booking-card`
- `.homepage__booking-card-body`
- `.homepage__booking-title`
- `.homepage__booking-description`
- `.homepage__booking-label`
- `.homepage__booking-button`
- `.homepage__booking-footer`
- `.homepage__booking-footer-text`
- `.homepage__booking-footer-link`
- `.homepage__service-card`
- `.homepage__service-card-body`
- `.homepage__service-icon`
- `.homepage__service-icon-img`
- `.homepage__service-title`
- `.homepage__service-description`
- `.homepage__service-button-wrapper`
- `.homepage__service-button`

### Features Section
- `.homepage__features`
- `.homepage__features-container`
- `.homepage__features-header`
- `.homepage__features-title`
- `.homepage__features-title--highlight` (modifier)
- `.homepage__features-description`
- `.homepage__feature-item`
- `.homepage__feature-icon`
- `.homepage__feature-icon-img`
- `.homepage__feature-title`
- `.homepage__feature-description`

### News Section
- `.homepage__news`
- `.homepage__news-container`
- `.homepage__news-header`
- `.homepage__news-title`
- `.homepage__news-card`
- `.homepage__news-card-cover`
- `.homepage__news-card-title`
- `.homepage__news-card-excerpt`
- `.homepage__news-card-button`
- `.homepage__news-more`
- `.homepage__news-more-button`

### Doctors Section
- `.homepage__doctors`
- `.homepage__doctors-container`
- `.homepage__doctors-header`
- `.homepage__doctors-title`
- `.homepage__doctors-grid`
- `.homepage__doctors-loading`
- `.homepage__doctors-loading-text`
- `.homepage__doctor-card`
- `.homepage__doctor-avatar-wrapper`
- `.homepage__doctor-avatar`
- `.homepage__doctor-avatar-img`
- `.homepage__doctor-avatar-placeholder`
- `.homepage__doctor-avatar-status`
- `.homepage__doctor-name`
- `.homepage__doctor-name-link`
- `.homepage__doctor-specialty`
- `.homepage__doctor-rating`
- `.homepage__doctor-rating-img`
- `.homepage__doctor-experience`
- `.homepage__doctor-experience-text`
- `.homepage__doctor-book-button`
- `.homepage__doctors-more`
- `.homepage__doctors-more-button`

### Specialties Section
- `.homepage__specialties`
- `.homepage__specialties-container`
- `.homepage__specialties-header`
- `.homepage__specialties-title`
- `.homepage__specialties-title--highlight` (modifier)
- `.homepage__specialties-grid-empty`

### Statistics Section
- `.homepage__statistics`
- `.homepage__statistics--gradient` (modifier)
- `.homepage__statistics-overlay`
- `.homepage__statistics-container`
- `.homepage__statistics-header`
- `.homepage__statistics-title`
- `.homepage__statistics-description`
- `.homepage__statistics-description--fallback` (modifier)
- `.homepage__statistic-card`
- `.homepage__statistic-card-deco-1`
- `.homepage__statistic-card-deco-2`
- `.homepage__statistic-card-content`
- `.homepage__statistic-value`
- `.homepage__statistic-label`
- `.homepage__statistic-icon`
- `.homepage__statistic-icon-img`

### Certifications Section
- `.homepage__certifications`
- `.homepage__certifications-container`
- `.homepage__certifications-header`
- `.homepage__certifications-title`
- `.homepage__certifications-description`

### Membership Benefits Section
- `.homepage__membership`
- `.homepage__membership-container`
- `.homepage__membership-header`
- `.homepage__membership-title`
- `.homepage__membership-subtitle`
- `.homepage__membership-image-wrapper`
- `.homepage__membership-image`
- `.homepage__membership-content`
- `.homepage__membership-benefits`
- `.homepage__membership-benefit`
- `.homepage__membership-benefit-icon`
- `.homepage__membership-benefit-text`
- `.homepage__membership-email`
- `.homepage__membership-email-label`
- `.homepage__membership-email-input`
- `.homepage__membership-button-primary`
- `.homepage__membership-button-secondary`

### Testimonials Section
- `.homepage__testimonials`
- `.homepage__testimonials-container`
- `.homepage__testimonials-header`
- `.homepage__testimonials-title`
- `.homepage__testimonial-card`
- `.homepage__testimonial-header`
- `.homepage__testimonial-user`
- `.homepage__testimonial-user-info`
- `.homepage__testimonial-user-name`
- `.homepage__testimonial-user-title`
- `.homepage__testimonial-rating`
- `.homepage__testimonial-text`

## Lợi ích của BEM

1. **Dễ bảo trì**: Tất cả styles ở một nơi, không rải rác trong JSX
2. **Tái sử dụng**: Có thể dùng lại classes cho các component khác
3. **Performance**: CSS classes nhanh hơn inline styles
4. **Tổ chức tốt**: Cấu trúc rõ ràng, dễ tìm kiếm
5. **Không xung đột**: BEM naming convention tránh class name conflicts

## Ghi chú

- File `homepage.css` hiện tại đã có các class nhưng chưa theo chuẩn BEM hoàn toàn
- Cần refactor HomePage.js để thay thế tất cả inline styles bằng className
- Một số class hiện tại như `.service-card` cần đổi thành `.homepage__service-card`
- Đã có sẵn các class tương ứng, chỉ cần áp dụng vào JSX
