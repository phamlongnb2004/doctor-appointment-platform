package com.doctorappointment.dto;

import java.util.Map;

public class SePayCheckoutResponse {
    private String checkoutUrl;
    private Map<String, String> formFields;
    private String orderNumber;
    
    public SePayCheckoutResponse() {
    }
    
    public SePayCheckoutResponse(String checkoutUrl, Map<String, String> formFields, String orderNumber) {
        this.checkoutUrl = checkoutUrl;
        this.formFields = formFields;
        this.orderNumber = orderNumber;
    }
    
    public String getCheckoutUrl() {
        return checkoutUrl;
    }
    
    public void setCheckoutUrl(String checkoutUrl) {
        this.checkoutUrl = checkoutUrl;
    }
    
    public Map<String, String> getFormFields() {
        return formFields;
    }
    
    public void setFormFields(Map<String, String> formFields) {
        this.formFields = formFields;
    }
    
    public String getOrderNumber() {
        return orderNumber;
    }
    
    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }
}
