package com.doctorappointment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_wallet_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceWalletItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private ServiceWallet wallet;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "order_number", nullable = false, length = 50)
    private String orderNumber;

    @Column(name = "service_id", nullable = false)
    private Long serviceId;

    @Column(name = "service_title", nullable = false)
    private String serviceTitle;

    @Column(name = "service_image", columnDefinition = "TEXT")
    private String serviceImage;

    @Column(name = "service_slug", length = 255)
    private String serviceSlug;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    @Column(name = "used_quantity", nullable = false)
    private Integer usedQuantity = 0;

    @Column(name = "unit_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "ACTIVE"; // ACTIVE, USED, EXPIRED

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

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

    public boolean isAvailable() {
        return "ACTIVE".equals(status) && usedQuantity < quantity &&
               (expiryDate == null || expiryDate.isAfter(LocalDateTime.now()));
    }

    public int getAvailableQuantity() {
        return quantity - usedQuantity;
    }
}
