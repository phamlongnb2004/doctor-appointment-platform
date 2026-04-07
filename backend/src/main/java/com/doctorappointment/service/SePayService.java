package com.doctorappointment.service;

import com.doctorappointment.config.SePayConfig;
import com.doctorappointment.model.Order;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Service
public class SePayService {
    
    @Autowired
    private SePayConfig sePayConfig;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Tạo checkout URL từ SePay API
     */
    public Map<String, Object> createCheckout(Order order, String successUrl, String errorUrl, String cancelUrl) {
        try {
            // Prepare request data
            Map<String, Object> requestData = new LinkedHashMap<>();
            requestData.put("merchant_id", sePayConfig.getMerchantId());
            requestData.put("payment_method", "BANK_TRANSFER");
            requestData.put("order_invoice_number", order.getOrderNumber());
            requestData.put("order_amount", order.getFinalAmount().setScale(0, BigDecimal.ROUND_HALF_UP).intValue());
            requestData.put("currency", "VND");
            requestData.put("order_description", "Thanh toan don hang " + order.getOrderNumber());
            requestData.put("success_url", successUrl);
            requestData.put("error_url", errorUrl);
            requestData.put("cancel_url", cancelUrl);
            
            // Optional customer info
            if (order.getCustomerName() != null) {
                requestData.put("customer_name", order.getCustomerName());
            }
            if (order.getCustomerEmail() != null) {
                requestData.put("customer_email", order.getCustomerEmail());
            }
            if (order.getCustomerPhone() != null) {
                requestData.put("customer_phone", order.getCustomerPhone());
            }
            
            // Generate signature
            String signature = generateSignature(requestData);
            requestData.put("signature", signature);
            
            // Call SePay API
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestData, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                sePayConfig.getCheckoutUrl(),
                request,
                Map.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            } else {
                throw new RuntimeException("Failed to create checkout: " + response.getStatusCode());
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Error creating SePay checkout", e);
        }
    }
    
    /**
     * Tạo chữ ký HMAC-SHA256
     */
    private String generateSignature(Map<String, Object> data) {
        try {
            // Sort keys
            List<String> keys = new ArrayList<>(data.keySet());
            Collections.sort(keys);
            
            // Build data string
            StringBuilder dataBuilder = new StringBuilder();
            for (String key : keys) {
                if (dataBuilder.length() > 0) {
                    dataBuilder.append("&");
                }
                dataBuilder.append(key).append("=").append(data.get(key));
            }
            String dataString = dataBuilder.toString();
            
            // Generate HMAC-SHA256
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                sePayConfig.getSecretKey().getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
            );
            sha256Hmac.init(secretKey);
            
            byte[] hash = sha256Hmac.doFinal(dataString.getBytes(StandardCharsets.UTF_8));
            
            // Convert to hex string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            return hexString.toString();
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Error generating signature", e);
        }
    }
    
    /**
     * Xác thực IPN callback từ SePay (JSON data)
     */
    public boolean verifyIpnSignature(Map<String, Object> ipnData) {
        Object receivedSignatureObj = ipnData.get("signature");
        if (receivedSignatureObj == null) {
            return false;
        }
        String receivedSignature = receivedSignatureObj.toString();
        
        // Remove signature from data for verification
        Map<String, Object> verifyData = new LinkedHashMap<>(ipnData);
        verifyData.remove("signature");
        
        String calculatedSignature = generateSignature(verifyData);
        return calculatedSignature.equals(receivedSignature);
    }
}
