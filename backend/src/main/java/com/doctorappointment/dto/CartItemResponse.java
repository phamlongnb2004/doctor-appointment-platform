package com.doctorappointment.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemResponse {
    private Long id;
    private Long serviceId;
    private String serviceTitle;
    private String serviceImage;
    private String serviceSlug;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
    private Integer availableQuantity;
}
