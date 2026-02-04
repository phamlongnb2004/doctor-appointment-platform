# News Sidebar Widgets - Implementation Guide

## ✅ Đã hoàn thành
1. Database: Tạo bảng `news_sidebar_widgets`
2. Dữ liệu mẫu: Hotline widget + Banner widget

## 🎯 Mục tiêu
Tạo sidebar cho trang tin tức với:
- Card Hotline (ảnh nền, số hotline, mô tả, nút CTA)
- Card Banner/Quảng cáo (ảnh + text overlay)
- 10 tin tức mới nhất (tự động fetch)
- CMS để quản lý widgets

## 📋 Cần làm tiếp

### Backend

#### 1. Model: `NewsSidebarWidget.java`
```java
package com.doctorappointment.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "news_sidebar_widgets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsSidebarWidget {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "widget_type", nullable = false)
    @JsonProperty("widgetType")
    private String widgetType; // hotline, banner, latest-news
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String subtitle;
    
    @Column(name = "image_url")
    @JsonProperty("imageUrl")
    private String imageUrl;
    
    @Column(name = "button_text")
    @JsonProperty("buttonText")
    private String buttonText;
    
    @Column(name = "button_url")
    @JsonProperty("buttonUrl")
    private String buttonUrl;
    
    private String hotline;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "display_order")
    @JsonProperty("displayOrder")
    private Integer displayOrder = 0;
    
    @Column(name = "is_active")
    @JsonProperty("isActive")
    private Boolean isActive = true;
    
    @Column(name = "created_at", updatable = false)
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

#### 2. Repository: `NewsSidebarWidgetRepository.java`
```java
package com.doctorappointment.repository;

import com.doctorappointment.model.NewsSidebarWidget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NewsSidebarWidgetRepository extends JpaRepository<NewsSidebarWidget, Long> {
    
    @Query("SELECT w FROM NewsSidebarWidget w WHERE w.isActive = true ORDER BY w.displayOrder ASC")
    List<NewsSidebarWidget> findAllActiveOrderByDisplayOrder();
    
    List<NewsSidebarWidget> findAllByOrderByDisplayOrderAsc();
}
```

#### 3. Thêm vào CMSService.java
```java
// News Sidebar Widgets
public List<NewsSidebarWidget> getAllNewsSidebarWidgets() {
    return newsSidebarWidgetRepository.findAllByOrderByDisplayOrderAsc();
}

public List<NewsSidebarWidget> getActiveNewsSidebarWidgets() {
    return newsSidebarWidgetRepository.findAllActiveOrderByDisplayOrder();
}

public NewsSidebarWidget getNewsSidebarWidgetById(Long id) {
    return newsSidebarWidgetRepository.findById(id).orElse(null);
}

public NewsSidebarWidget createNewsSidebarWidget(NewsSidebarWidget widget) {
    return newsSidebarWidgetRepository.save(widget);
}

public NewsSidebarWidget updateNewsSidebarWidget(Long id, NewsSidebarWidget widget) {
    widget.setId(id);
    return newsSidebarWidgetRepository.save(widget);
}

public void deleteNewsSidebarWidget(Long id) {
    newsSidebarWidgetRepository.deleteById(id);
}
```

#### 4. Thêm vào CMSController.java
```java
// ==================== NEWS SIDEBAR WIDGETS ====================

@GetMapping("/news-sidebar-widgets")
public ResponseEntity<List<NewsSidebarWidget>> getActiveNewsSidebarWidgets() {
    return ResponseEntity.ok(cmsService.getActiveNewsSidebarWidgets());
}

@GetMapping("/admin/news-sidebar-widgets")
public ResponseEntity<List<NewsSidebarWidget>> getAllNewsSidebarWidgets() {
    return ResponseEntity.ok(cmsService.getAllNewsSidebarWidgets());
}

@GetMapping("/admin/news-sidebar-widgets/{id}")
public ResponseEntity<NewsSidebarWidget> getNewsSidebarWidgetById(@PathVariable Long id) {
    return ResponseEntity.ok(cmsService.getNewsSidebarWidgetById(id));
}

@PostMapping("/admin/news-sidebar-widgets")
public ResponseEntity<NewsSidebarWidget> createNewsSidebarWidget(@RequestBody NewsSidebarWidget widget) {
    return ResponseEntity.ok(cmsService.createNewsSidebarWidget(widget));
}

@PutMapping("/admin/news-sidebar-widgets/{id}")
public ResponseEntity<NewsSidebarWidget> updateNewsSidebarWidget(
        @PathVariable Long id,
        @RequestBody NewsSidebarWidget widget) {
    return ResponseEntity.ok(cmsService.updateNewsSidebarWidget(id, widget));
}

@DeleteMapping("/admin/news-sidebar-widgets/{id}")
public ResponseEntity<Void> deleteNewsSidebarWidget(@PathVariable Long id) {
    cmsService.deleteNewsSidebarWidget(id);
    return ResponseEntity.ok().build();
}
```

### Frontend

#### 1. Thêm vào cmsApi.js
```javascript
// News Sidebar Widgets
getNewsSidebarWidgets: () => {
  return axios.get(`${API_BASE_URL}/cms/news-sidebar-widgets`);
},

getAllNewsSidebarWidgets: () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_BASE_URL}/cms/admin/news-sidebar-widgets`, {
    headers: { Authorization: `Bearer ${token}` }
  });
},

createNewsSidebarWidget: (data) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API_BASE_URL}/cms/admin/news-sidebar-widgets`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
},

updateNewsSidebarWidget: (id, data) => {
  const token = localStorage.getItem('token');
  return axios.put(`${API_BASE_URL}/cms/admin/news-sidebar-widgets/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
},

deleteNewsSidebarWidget: (id) => {
  const token = localStorage.getItem('token');
  return axios.delete(`${API_BASE_URL}/cms/admin/news-sidebar-widgets/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
```

#### 2. Component: NewsSidebar.js
Tạo component sidebar hiển thị widgets

#### 3. Cập nhật NewsListPage.js
Layout 2 cột: Sections (trái) + Sidebar (phải)

#### 4. Thêm tab CMS trong AdminCMSPage.js
Tab "Sidebar Tin tức" để quản lý widgets

## 🎨 Design Sidebar

### Hotline Widget
- Background image với overlay
- Icon điện thoại
- Số hotline lớn, nổi bật
- Mô tả ngắn
- Button CTA

### Banner Widget  
- Ảnh full width
- Text overlay (title + subtitle)
- Có thể click để navigate

### Latest News
- List 10 tin mới nhất
- Mỗi tin: Ảnh nhỏ + Tiêu đề + Ngày
- Nút "Xem thêm" ở cuối

## 📝 Hướng dẫn sử dụng

### Tạo widget mới
1. Vào Admin CMS > Sidebar Tin tức
2. Click "Thêm widget"
3. Chọn loại: Hotline / Banner
4. Upload ảnh, điền thông tin
5. Lưu

### Sắp xếp thứ tự
- Thay đổi `displayOrder` để sắp xếp widgets

### Bật/tắt widget
- Toggle switch `isActive`
