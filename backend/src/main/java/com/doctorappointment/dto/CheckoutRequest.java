package com.doctorappointment.dto;

import lombok.Data;

@Data
public class CheckoutRequest {
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String shippingAddress;
    private String shippingCity;
    private String shippingDistrict;
    private String shippingWard;
    private String shippingNotes;
    private String paymentMethod;
    private String sessionId;
}
