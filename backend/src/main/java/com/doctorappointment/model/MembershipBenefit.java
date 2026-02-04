package com.doctorappointment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "membership_benefits")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MembershipBenefit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 500)
    private String subtitle;
    
    @Column(name = "benefit_1")
    private String benefit1;
    
    @Column(name = "benefit_2")
    private String benefit2;
    
    @Column(name = "benefit_3")
    private String benefit3;
    
    @Column(name = "benefit_4")
    private String benefit4;
    
    @Column(name = "benefit_5")
    private String benefit5;
    
    @Column(name = "image_1", length = 500)
    private String image1;
    
    @Column(name = "image_2", length = 500)
    private String image2;
    
    @Column(name = "image_3", length = 500)
    private String image3;
    
    @Column(name = "email_placeholder")
    private String emailPlaceholder;
    
    @Column(name = "button_1_text", length = 100)
    private String button1Text;
    
    @Column(name = "button_1_url")
    private String button1Url;
    
    @Column(name = "button_2_text", length = 100)
    private String button2Text;
    
    @Column(name = "button_2_url")
    private String button2Url;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "display_order")
    private Integer displayOrder = 0;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
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
