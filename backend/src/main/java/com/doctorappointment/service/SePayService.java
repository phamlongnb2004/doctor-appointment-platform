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
     * Tạo form data để submit đến SePay (theo tài liệu SePay)
     * Trả về Map chứa các field cần thiết để tạo form HTML
     */
    public Map<String, Object> createCheckoutFormData(Order order, String successUrl, String errorUrl, String cancelUrl) {
        try {
            // Prepare request data - sử dụng snake_case theo SDK
            Map<String, Object> requestData = new LinkedHashMap<>();
            
            // Các field bắt buộc theo đúng thứ tự của SDK
            requestData.put("merchant", sePayConfig.getMerchantId());
            requestData.put("operation", "PURCHASE");
            requestData.put("payment_method", "BANK_TRANSFER");
            requestData.put("order_amount", order.getFinalAmount().setScale(0, BigDecimal.ROUND_HALF_UP).intValue());
            requestData.put("currency", "VND");
            requestData.put("order_invoice_number", order.getOrderNumber());
            requestData.put("order_description", "Thanh toan don hang " + order.getOrderNumber());
            requestData.put("success_url", successUrl);
            requestData.put("error_url", errorUrl);
            requestData.put("cancel_url", cancelUrl);
            
            // Optional customer info (không dùng cho signature)
            if (order.getCustomerEmail() != null) {
                requestData.put("customer_email", order.getCustomerEmail());
            }
            if (order.getCustomerName() != null) {
                requestData.put("customer_name", order.getCustomerName());
            }
            if (order.getCustomerPhone() != null) {
                requestData.put("customer_phone", order.getCustomerPhone());
            }
            
            // Generate signature từ các field đã có
            String signature = generateSignature(requestData);
            requestData.put("signature", signature);
            
            // Thêm checkout URL
            requestData.put("checkout_url", sePayConfig.getCheckoutUrl());
            
            return requestData;
            
        } catch (Exception e) {
            throw new RuntimeException("Error creating SePay checkout form data", e);
        }
    }
    
    /**
     * Tạo chữ ký HMAC-SHA256 theo đúng cách của SePay SDK
     * Chỉ ký các field cụ thể, nối bằng dấu phẩy, encode Base64
     */
    private String generateSignature(Map<String, Object> data) {
        try {
            // Danh sách các field cần ký theo thứ tự của SDK
            String[] signedFieldNames = {
                "merchant", "env", "operation", "payment_method", "order_amount",
                "currency", "order_invoice_number", "order_description", "customer_id",
                "agreement_id", "agreement_name", "agreement_type",
                "agreement_payment_frequency", "agreement_amount_per_payment",
                "success_url", "error_url", "cancel_url", "order_id"
            };
            
            // Chỉ lấy các field có trong data và nằm trong danh sách signedFieldNames
            List<String> signedParts = new ArrayList<>();
            for (String fieldName : signedFieldNames) {
                if (data.containsKey(fieldName) && data.get(fieldName) != null) {
                    signedParts.add(fieldName + "=" + data.get(fieldName));
                }
            }
            
            // Nối các field bằng dấu PHẨY (không phải &)
            String dataString = String.join(",", signedParts);
            
            // Generate HMAC-SHA256
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                sePayConfig.getSecretKey().getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
            );
            sha256Hmac.init(secretKey);
            
            byte[] hash = sha256Hmac.doFinal(dataString.getBytes(StandardCharsets.UTF_8));
            
            // Encode Base64 (KHÔNG phải hex)
            return Base64.getEncoder().encodeToString(hash);
            
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
