# Triển khai Article CTA Section

## Mục đích
Thêm section "Lựa chọn dịch vụ" ở cuối mỗi trang chi tiết bài viết, có thể chỉnh sửa trong CMS.

## 1. Database ✅
**File**: `database/create_article_cta_section.sql`
- Đã tạo bảng `article_cta_section`
- Đã insert dữ liệu mẫu

## 2. Backend Model
**File**: `backend/src/main/java/com/doctorappointment/model/ArticleCtaSection.java`

```java
package com.doctorappointment.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "article_cta_section")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleCtaSection {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String subtitle;
    
    // CTA 1
    @Column(name = "cta1_image")
    @JsonProperty("cta1Image")
    private String cta1Image;
    
    @Column(name = "cta1_title")
    @JsonProperty("cta1Title")
    private String cta1Title;
    
    @Column(name = "cta1_description", columnDefinition = "TEXT")
    @JsonProperty("cta1Description")
    private String cta1Description;
    
    @Column(name = "cta1_button_text")
    @JsonProperty("cta1ButtonText")
    private String cta1ButtonText;
    
    @Column(name = "cta1_button_url")
    @JsonProperty("cta1ButtonUrl")
    private String cta1ButtonUrl;
    
    // CTA 2
    @Column(name = "cta2_image")
    @JsonProperty("cta2Image")
    private String cta2Image;
    
    @Column(name = "cta2_title")
    @JsonProperty("cta2Title")
    private String cta2Title;
    
    @Column(name = "cta2_description", columnDefinition = "TEXT")
    @JsonProperty("cta2Description")
    private String cta2Description;
    
    @Column(name = "cta2_button_text")
    @JsonProperty("cta2ButtonText")
    private String cta2ButtonText;
    
    @Column(name = "cta2_button_url")
    @JsonProperty("cta2ButtonUrl")
    private String cta2ButtonUrl;
    
    @Column(name = "background_color")
    @JsonProperty("backgroundColor")
    private String backgroundColor = "#1890ff";
    
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

## 3. Backend Repository
**File**: `backend/src/main/java/com/doctorappointment/repository/ArticleCtaSectionRepository.java`

```java
package com.doctorappointment.repository;

import com.doctorappointment.model.ArticleCtaSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ArticleCtaSectionRepository extends JpaRepository<ArticleCtaSection, Long> {
    Optional<ArticleCtaSection> findFirstByIsActiveTrueOrderByIdAsc();
}
```

## 4. Backend Service
**Thêm vào**: `backend/src/main/java/com/doctorappointment/service/CMSService.java`

```java
@Autowired
private ArticleCtaSectionRepository articleCtaSectionRepository;

// Article CTA Section Methods
public Optional<ArticleCtaSection> getArticleCtaSection() {
    return articleCtaSectionRepository.findFirstByIsActiveTrueOrderByIdAsc();
}

public ArticleCtaSection saveArticleCtaSection(ArticleCtaSection section) {
    return articleCtaSectionRepository.save(section);
}
```

## 5. Backend Controller
**Thêm vào**: `backend/src/main/java/com/doctorappointment/controller/CMSController.java`

```java
// ==================== ARTICLE CTA SECTION ENDPOINTS ====================

@GetMapping("/article-cta-section")
public ResponseEntity<ArticleCtaSection> getArticleCtaSection() {
    return cmsService.getArticleCtaSection()
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}

@PutMapping("/admin/article-cta-section/{id}")
public ResponseEntity<ArticleCtaSection> updateArticleCtaSection(
        @PathVariable Long id, 
        @RequestBody ArticleCtaSection section) {
    section.setId(id);
    return ResponseEntity.ok(cmsService.saveArticleCtaSection(section));
}
```

## 6. Frontend API
**Thêm vào**: `frontend/src/services/cmsApi.js`

```javascript
// Article CTA Section
getArticleCtaSection: () => {
  return axios.get(`${API_BASE_URL}/cms/article-cta-section`);
},

updateArticleCtaSection: (id, data) => {
  return axios.put(`${API_BASE_URL}/cms/admin/article-cta-section/${id}`, data);
},
```

## 7. Frontend Component
**File**: `frontend/src/components/ArticleCtaSection.js`

```javascript
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function ArticleCtaSection({ data }) {
  const navigate = useNavigate();

  if (!data) return null;

  return (
    <div style={{ 
      background: data.backgroundColor || '#1890ff',
      padding: '60px 24px',
      marginTop: 60
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Title */}
        {data.title && (
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ 
              color: '#fff', 
              fontSize: 32, 
              fontWeight: 600,
              marginBottom: 12
            }}>
              {data.title}
            </h2>
            {data.subtitle && (
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                {data.subtitle}
              </p>
            )}
          </div>
        )}

        {/* CTA Items */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 32
        }}>
          {/* CTA 1 */}
          {data.cta1Title && (
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 32,
              display: 'flex',
              gap: 24
            }}>
              {data.cta1Image && (
                <img 
                  src={data.cta1Image} 
                  alt={data.cta1Title}
                  style={{
                    width: 150,
                    height: 150,
                    objectFit: 'cover',
                    borderRadius: 12
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontSize: 18, 
                  fontWeight: 600,
                  marginBottom: 12,
                  color: '#262626'
                }}>
                  {data.cta1Title}
                </h3>
                <p style={{ 
                  color: '#666', 
                  fontSize: 14,
                  lineHeight: 1.6,
                  marginBottom: 20
                }}>
                  {data.cta1Description}
                </p>
                {data.cta1ButtonText && (
                  <Button 
                    type="primary"
                    size="large"
                    onClick={() => navigate(data.cta1ButtonUrl || '/appointment')}
                  >
                    {data.cta1ButtonText}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* CTA 2 */}
          {data.cta2Title && (
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 32,
              display: 'flex',
              gap: 24
            }}>
              {data.cta2Image && (
                <img 
                  src={data.cta2Image} 
                  alt={data.cta2Title}
                  style={{
                    width: 150,
                    height: 150,
                    objectFit: 'cover',
                    borderRadius: 12
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontSize: 18, 
                  fontWeight: 600,
                  marginBottom: 12,
                  color: '#262626'
                }}>
                  {data.cta2Title}
                </h3>
                <p style={{ 
                  color: '#666', 
                  fontSize: 14,
                  lineHeight: 1.6,
                  marginBottom: 20
                }}>
                  {data.cta2Description}
                </p>
                {data.cta2ButtonText && (
                  <Button 
                    type="primary"
                    size="large"
                    onClick={() => navigate(data.cta2ButtonUrl || '/appointment')}
                  >
                    {data.cta2ButtonText}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticleCtaSection;
```

## 8. Thêm vào NewsDetailPage
**File**: `frontend/src/pages/NewsDetailPage.js`

```javascript
import ArticleCtaSection from '../components/ArticleCtaSection';

// Trong component:
const [ctaSection, setCtaSection] = useState(null);

// Trong useEffect:
const ctaResponse = await cmsAPI.getArticleCtaSection();
setCtaSection(ctaResponse.data);

// Trong JSX, thêm trước Footer:
<ArticleCtaSection data={ctaSection} />
```

## 9. CMS Admin - Thêm Tab mới
**File**: `frontend/src/pages/AdminCMSPage.js`

### 9.1. Thêm state
```javascript
const [articleCtaSection, setArticleCtaSection] = useState(null);
```

### 9.2. Fetch data
```javascript
const ctaResponse = await cmsAPI.getArticleCtaSection();
setArticleCtaSection(ctaResponse.data || null);
```

### 9.3. Thêm menu item (trong group "Chi tiết bài viết")
```javascript
<Menu.ItemGroup key="article-detail" title="Chi tiết bài viết">
  <Menu.Item key="article-cta" icon={<AppstoreOutlined />}>
    Section cuối bài viết
  </Menu.Item>
</Menu.ItemGroup>
```

### 9.4. Thêm tab content
```javascript
{currentTab === 'article-cta' && (
  <Card 
    className="admin-cms-card"
    title="Section cuối bài viết"
    extra={
      <Button 
        type="primary" 
        onClick={() => handleEdit(articleCtaSection)}
      >
        Chỉnh sửa
      </Button>
    }
  >
    {/* Preview */}
    <div style={{ padding: 24, background: '#f5f5f5', borderRadius: 8 }}>
      <ArticleCtaSection data={articleCtaSection} />
    </div>
  </Card>
)}
```

### 9.5. Thêm form fields
```javascript
case 'article-cta':
  return (
    <>
      <Form.Item name="title" label="Tiêu đề chính">
        <Input placeholder="Lựa chọn dịch vụ" />
      </Form.Item>
      
      <Form.Item name="subtitle" label="Mô tả">
        <TextArea rows={2} />
      </Form.Item>

      <Divider>CTA 1</Divider>
      
      <Form.Item name="cta1Image" label="Hình ảnh 1">
        <Input placeholder="URL hình ảnh" />
      </Form.Item>
      
      <Form.Item name="cta1Title" label="Tiêu đề 1">
        <Input />
      </Form.Item>
      
      <Form.Item name="cta1Description" label="Mô tả 1">
        <TextArea rows={3} />
      </Form.Item>
      
      <Form.Item name="cta1ButtonText" label="Text nút 1">
        <Input />
      </Form.Item>
      
      <Form.Item name="cta1ButtonUrl" label="Link nút 1">
        <Input />
      </Form.Item>

      <Divider>CTA 2</Divider>
      
      <Form.Item name="cta2Image" label="Hình ảnh 2">
        <Input placeholder="URL hình ảnh" />
      </Form.Item>
      
      <Form.Item name="cta2Title" label="Tiêu đề 2">
        <Input />
      </Form.Item>
      
      <Form.Item name="cta2Description" label="Mô tả 2">
        <TextArea rows={3} />
      </Form.Item>
      
      <Form.Item name="cta2ButtonText" label="Text nút 2">
        <Input />
      </Form.Item>
      
      <Form.Item name="cta2ButtonUrl" label="Link nút 2">
        <Input />
      </Form.Item>

      <Form.Item name="backgroundColor" label="Màu nền">
        <Input type="color" />
      </Form.Item>
    </>
  );
```

### 9.6. Thêm save logic
```javascript
case 'article-cta':
  await cmsAPI.updateArticleCtaSection(editingItem.id, data);
  break;
```

## Tóm tắt
1. ✅ Database đã tạo
2. ⏳ Cần tạo backend model, repository, service, controller
3. ⏳ Cần tạo frontend component
4. ⏳ Cần thêm vào NewsDetailPage
5. ⏳ Cần thêm tab CMS

Bạn muốn tôi tiếp tục tạo các file code không?
