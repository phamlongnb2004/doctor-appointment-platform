package com.doctorappointment.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "news_sections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsSection {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(nullable = false)
    private String title;
    
    @Column(name = "layout_type")
    @JsonProperty("layoutType")
    private String layoutType = "default"; // 'default' or 'grid'
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "display_order")
    @JsonProperty("displayOrder")
    private Integer displayOrder = 0;
    
    @Column(name = "background_color")
    @JsonProperty("backgroundColor")
    private String backgroundColor = "#fff";
    
    @Column(name = "title_align")
    @JsonProperty("titleAlign")
    private String titleAlign = "left";
    
    @Column(name = "articles_limit")
    @JsonProperty("articlesLimit")
    private Integer articlesLimit = 4;
    
    @Column(name = "show_more_button")
    @JsonProperty("showMoreButton")
    private Boolean showMoreButton = true;
    
    @Column(name = "more_button_text")
    @JsonProperty("moreButtonText")
    private String moreButtonText = "Xem thêm";
    
    @Column(name = "category_filter")
    @JsonProperty("categoryFilter")
    private String categoryFilter; // Lọc tin tức theo danh mục (NULL = tất cả)
    
    @Column(length = 50)
    private String page = "both"; // 'home', 'news', or 'both'
    
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
