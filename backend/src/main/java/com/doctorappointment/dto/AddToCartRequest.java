package com.doctorappointment.dto;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Long serviceId;
    private Integer quantity;
    private String sessionId; // For guest users
}
