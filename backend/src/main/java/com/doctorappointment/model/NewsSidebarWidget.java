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
