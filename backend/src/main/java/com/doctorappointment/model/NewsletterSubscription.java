package com.doctorappointment.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "newsletter_subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsletterSubscription {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private String name;
    
    private String phone;
    
    @Column(name = "verification_code", nullable = false)
    @JsonProperty("verificationCode")
    private String verificationCode;
    
    @Column(name = "is_verified")
    @JsonProperty("isVerified")
    private Boolean isVerified = false;
    
    @Column(name = "is_active")
    @JsonProperty("isActive")
    private Boolean isActive = true;
    
    @Column(name = "created_at", updatable = false)
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
    
    @Column(name = "verified_at")
    @JsonProperty("verifiedAt")
    private LocalDateTime verifiedAt;
    
    @Column(name = "expires_at", nullable = false)
    @JsonProperty("expiresAt")
    private LocalDateTime expiresAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (expiresAt == null) {
            expiresAt = LocalDateTime.now().plusMinutes(15); // Code expires in 15 minutes
        }
    }
}
