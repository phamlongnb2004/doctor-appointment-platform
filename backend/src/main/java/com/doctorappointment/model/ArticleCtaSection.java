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
    
    @Column(name = "doctor_image", length = 500)
    @JsonProperty("doctorImage")
    private String doctorImage;
    
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
