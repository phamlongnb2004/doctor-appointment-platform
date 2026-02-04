# Hướng dẫn sử dụng NewsSection Component

## Tổng quan
Component `NewsSection` là một component tái sử dụng để hiển thị danh sách tin tức với thiết kế nhất quán. Bạn có thể sử dụng nó nhiều lần với các tham số khác nhau để hiển thị các category tin tức khác nhau.

## Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `title` | string | - | Tiêu đề của section (bắt buộc) |
| `articles` | array | - | Mảng các bài viết tin tức (bắt buộc) |
| `showMoreButton` | boolean | true | Hiển thị nút "Xem thêm" |
| `moreButtonText` | string | 'Xem thêm' | Text của nút "Xem thêm" |
| `moreButtonUrl` | string | '/news' | URL khi click nút "Xem thêm" |
| `backgroundColor` | string | '#fff' | Màu nền của section |
| `titleAlign` | string | 'left' | Căn lề tiêu đề ('left', 'center', 'right') |
| `columns` | object | { xs: 24, sm: 12, lg: 6 } | Responsive columns (Ant Design Col props) |

## Cấu trúc dữ liệu Article

```javascript
{
  id: number,
  title: string,
  imageUrl: string, // hoặc image
  excerpt: string,  // hoặc desc
  slug: string      // hoặc dùng id
}
```

## Ví dụ sử dụng

### 1. Section Tin tức nổi bật (Featured News)

```jsx
// Trong HomePage.js
const [featuredNews, setFeaturedNews] = useState([]);

// Fetch data
useEffect(() => {
  const fetchFeaturedNews = async () => {
    const response = await cmsAPI.getNewsByCategory('featured', 4);
    setFeaturedNews(response.data);
  };
  fetchFeaturedNews();
}, []);

// Render
<NewsSection 
  title="TIN TỨC NỔI BẬT"
  articles={featuredNews}
  showMoreButton={true}
  moreButtonText="Xem tất cả tin nổi bật"
  moreButtonUrl="/news?category=featured"
  backgroundColor="#f8f9fa"
  titleAlign="center"
  columns={{ xs: 24, sm: 12, lg: 6 }}
/>
```

### 2. Section Y khoa MEDLATEC

```jsx
const [medlatecNews, setMedlatecNews] = useState([]);

// Fetch data
useEffect(() => {
  const fetchMedlatecNews = async () => {
    const response = await cmsAPI.getNewsByCategory('medlatec', 4);
    setMedlatecNews(response.data);
  };
  fetchMedlatecNews();
}, []);

// Render
<NewsSection 
  title="Y KHOA MEDLATEC"
  articles={medlatecNews}
  showMoreButton={true}
  moreButtonText="Xem thêm"
  moreButtonUrl="/news?category=medlatec"
  backgroundColor="#fff"
  titleAlign="left"
  columns={{ xs: 24, sm: 12, lg: 6 }}
/>
```

### 3. Section Sức khỏe cộng đồng

```jsx
const [healthNews, setHealthNews] = useState([]);

// Fetch data
useEffect(() => {
  const fetchHealthNews = async () => {
    const response = await cmsAPI.getNewsByCategory('health', 3);
    setHealthNews(response.data);
  };
  fetchHealthNews();
}, []);

// Render
<NewsSection 
  title="SỨC KHỎE CỘNG ĐỒNG"
  articles={healthNews}
  showMoreButton={true}
  moreButtonText="Đọc thêm"
  moreButtonUrl="/news?category=health"
  backgroundColor="#f0f9ff"
  titleAlign="center"
  columns={{ xs: 24, sm: 12, lg: 8 }}
/>
```

### 4. Section không có nút "Xem thêm"

```jsx
<NewsSection 
  title="TIN TỨC MỚI NHẤT"
  articles={latestNews}
  showMoreButton={false}
  backgroundColor="#fff"
  titleAlign="left"
  columns={{ xs: 24, sm: 12, lg: 6 }}
/>
```

### 5. Section với layout 3 cột

```jsx
<NewsSection 
  title="CHUYÊN ĐỀ Y HỌC"
  articles={medicalTopics}
  showMoreButton={true}
  moreButtonText="Xem tất cả chuyên đề"
  moreButtonUrl="/news?category=medical-topics"
  backgroundColor="#fff"
  titleAlign="center"
  columns={{ xs: 24, sm: 12, md: 8 }}
/>
```

## Ví dụ đầy đủ trong HomePage.js

```jsx
import React, { useState, useEffect } from 'react';
import NewsSection from '../components/NewsSection';
import cmsAPI from '../services/cmsApi';

function HomePage() {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [medlatecNews, setMedlatecNews] = useState([]);
  const [healthNews, setHealthNews] = useState([]);

  useEffect(() => {
    fetchAllNews();
  }, []);

  const fetchAllNews = async () => {
    try {
      const [featured, medlatec, health] = await Promise.all([
        cmsAPI.getNewsByCategory('featured', 4),
        cmsAPI.getNewsByCategory('medlatec', 4),
        cmsAPI.getNewsByCategory('health', 3)
      ]);

      setFeaturedNews(featured.data || []);
      setMedlatecNews(medlatec.data || []);
      setHealthNews(health.data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  return (
    <div className="homepage-container">
      {/* Section 1: Tin tức nổi bật */}
      <NewsSection 
        title="TIN TỨC NỔI BẬT"
        articles={featuredNews}
        backgroundColor="#f8f9fa"
        titleAlign="center"
      />

      {/* Section 2: Y khoa MEDLATEC */}
      <NewsSection 
        title="Y KHOA MEDLATEC"
        articles={medlatecNews}
        backgroundColor="#fff"
        titleAlign="left"
      />

      {/* Section 3: Sức khỏe cộng đồng */}
      <NewsSection 
        title="SỨC KHỎE CỘNG ĐỒNG"
        articles={healthNews}
        backgroundColor="#f0f9ff"
        titleAlign="center"
        columns={{ xs: 24, sm: 12, lg: 8 }}
      />
    </div>
  );
}

export default HomePage;
```

## Backend API cần bổ sung

Để hỗ trợ việc lấy tin tức theo category, bạn cần thêm endpoint trong backend:

### CMSController.java

```java
@GetMapping("/news/category/{category}")
public ResponseEntity<List<NewsArticle>> getNewsByCategory(
    @PathVariable String category,
    @RequestParam(defaultValue = "4") int limit
) {
    List<NewsArticle> articles = cmsService.getNewsByCategory(category, limit);
    return ResponseEntity.ok(articles);
}
```

### CMSService.java

```java
public List<NewsArticle> getNewsByCategory(String category, int limit) {
    return newsArticleRepository
        .findByCategoryAndIsActiveTrue(category, PageRequest.of(0, limit))
        .getContent();
}
```

### NewsArticleRepository.java

```java
Page<NewsArticle> findByCategoryAndIsActiveTrue(String category, Pageable pageable);
```

## Lợi ích

1. **Tái sử dụng**: Một component cho tất cả các section tin tức
2. **Nhất quán**: Thiết kế giống nhau cho tất cả sections
3. **Linh hoạt**: Dễ dàng tùy chỉnh qua props
4. **Dễ bảo trì**: Chỉ cần sửa một nơi, tất cả sections đều được cập nhật
5. **Performance**: Component được tối ưu hóa

## Ghi chú

- Component tự động ẩn nếu không có articles
- Responsive design tự động
- Hover effects được tích hợp sẵn
- Click vào card hoặc nút "Xem chi tiết" đều navigate đến trang chi tiết
- Có thể dễ dàng thêm nhiều section khác nhau chỉ bằng cách thay đổi props
