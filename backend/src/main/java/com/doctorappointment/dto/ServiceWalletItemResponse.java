package com.doctorappointment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceWalletItemResponse {
    private Long id;
    private Long orderId;
    private String orderNumber;
    private Long serviceId;
    private String serviceTitle;
    private String serviceImage;
    private String serviceSlug;
    private Integer quantity;
    private Integer usedQuantity;
    private Integer availableQuantity;
    private BigDecimal unitPrice;
    private String status;
    private LocalDateTime expiryDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
