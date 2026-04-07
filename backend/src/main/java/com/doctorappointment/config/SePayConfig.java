package com.doctorappointment.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SePayConfig {
    
    @Value("${sepay.merchant-id}")
    private String merchantId;
    
    @Value("${sepay.secret-key}")
    private String secretKey;
    
    @Value("${sepay.env:sandbox}")
    private String environment;
    
    @Value("${sepay.checkout-url:https://pay.sepay.vn/v1/checkout/init}")
    private String checkoutUrl;
    
    @Value("${sepay.ipn-url}")
    private String ipnUrl;
    
    public String getMerchantId() {
        return merchantId;
    }
    
    public String getSecretKey() {
        return secretKey;
    }
    
    public String getEnvironment() {
        return environment;
    }
    
    public String getCheckoutUrl() {
        return checkoutUrl;
    }
    
    public String getIpnUrl() {
        return ipnUrl;
    }
    
    public boolean isSandbox() {
        return "sandbox".equalsIgnoreCase(environment);
    }
}
