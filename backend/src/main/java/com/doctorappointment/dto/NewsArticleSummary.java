package com.doctorappointment.dto;

import com.doctorappointment.model.Doctor;
import com.doctorappointment.model.NewsArticle;
import java.time.LocalDateTime;

/**
 * Lightweight DTO for news article list (without full content)
 */
public class NewsArticleSummary {
    private Long id;
    private String title;
    private String slug;
    private String excerpt;
    private String imageUrl;  // Changed from featuredImage to imageUrl
    private String category;
    private String status;
    private Boolean featured;
    private Integer viewCount;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private Long authorId;
    private String authorName;

    public NewsArticleSummary() {}

    public static NewsArticleSummary fromNewsArticle(NewsArticle article) {
        NewsArticleSummary summary = new NewsArticleSummary();
        summary.setId(article.getId());
        summary.setTitle(article.getTitle());
        summary.setSlug(article.getSlug());
        summary.setExcerpt(article.getExcerpt());
        summary.setImageUrl(article.getImageUrl());
        summary.setCategory(article.getCategory());
        summary.setStatus(article.getStatus()); // status is already String
        summary.setFeatured(article.getIsFeatured()); // isFeatured instead of featured
        summary.setViewCount(0); // viewCount doesn't exist, default to 0
        summary.setPublishedAt(article.getPublishedAt());
        summary.setCreatedAt(article.getCreatedAt());
        
        // author is String, not User object
        summary.setAuthorName(article.getAuthor());
        
        // Try to get doctor's user ID, but handle lazy loading gracefully
        try {
            if (article.getDoctor() != null) {
                Doctor doctor = article.getDoctor();
                if (doctor.getUser() != null) {
                    summary.setAuthorId(doctor.getUser().getId());
                }
            }
        } catch (Exception e) {
            // Ignore lazy loading exceptions
        }
        
        return summary;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
}
