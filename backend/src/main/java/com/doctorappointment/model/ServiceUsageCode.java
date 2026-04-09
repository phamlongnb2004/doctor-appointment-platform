package com.doctorappointment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_usage_codes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceUsageCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", unique = true, nullable = false, length = 20)
    private String code;

    @Column(name = "wallet_item_id", nullable = false)
    private Long walletItemId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "service_id", nullable = false)
    private Long serviceId;

    @Column(name = "service_title", nullable = false)
    private String serviceTitle;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "ACTIVE"; // ACTIVE, USED, EXPIRED, CANCELLED

    @Column(name = "used_by_doctor_id")
    private Long usedByDoctorId;

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

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

    public boolean isValid() {
        return "ACTIVE".equals(status) &&
               (expiryDate == null || expiryDate.isAfter(LocalDateTime.now()));
    }
}
