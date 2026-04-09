package com.doctorappointment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceWalletResponse {
    private Long id;
    private Long userId;
    private List<ServiceWalletItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
