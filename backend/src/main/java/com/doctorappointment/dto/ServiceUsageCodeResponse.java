package com.doctorappointment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceUsageCodeResponse {
    private Long id;
    private String code;
    private Long walletItemId;
    private Long userId;
    private String userName;
    private Long serviceId;
    private String serviceTitle;
    private String status;
    private Long usedByDoctorId;
    private String usedByDoctorName;
    private LocalDateTime usedAt;
    private LocalDateTime expiryDate;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean valid;
}
