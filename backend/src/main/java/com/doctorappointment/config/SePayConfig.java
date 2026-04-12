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
    
    @Value("${sepay.checkout-url:}")
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
        // Auto-select checkout URL based on environment if not explicitly set
        if (checkoutUrl == null || checkoutUrl.isEmpty()) {
            if ("production".equalsIgnoreCase(environment) || "live".equalsIgnoreCase(environment)) {
                return "https://pay.sepay.vn/v1/checkout/init";
            } else {
                return "https://pay-sandbox.sepay.vn/v1/checkout/init";
            }
        }
        return checkoutUrl;
    }
    
    public String getIpnUrl() {
        return ipnUrl;
    }
    
    public boolean isSandbox() {
        return "sandbox".equalsIgnoreCase(environment);
    }
}
