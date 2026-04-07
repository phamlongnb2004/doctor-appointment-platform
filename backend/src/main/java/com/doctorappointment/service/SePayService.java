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
            
            // Log data trước khi tính signature
            System.out.println("=== SEPAY DATA BEFORE SIGNATURE ===");
            System.out.println("Secret Key (first 10 chars): " + sePayConfig.getSecretKey().substring(0, Math.min(10, sePayConfig.getSecretKey().length())) + "...");
            requestData.forEach((key, value) -> System.out.println(key + " = " + value));
            
            // Generate signature TRƯỚC KHI thêm customer info
            String signature = generateSignature(requestData);
            requestData.put("signature", signature);
            
            // Optional customer info (thêm SAU signature, không dùng cho signature)
            if (order.getCustomerEmail() != null) {
                requestData.put("customer_email", order.getCustomerEmail());
            }
            if (order.getCustomerName() != null) {
                requestData.put("customer_name", order.getCustomerName());
            }
            if (order.getCustomerPhone() != null) {
                requestData.put("customer_phone", order.getCustomerPhone());
            }
            
            // Thêm checkout URL
            requestData.put("checkout_url", sePayConfig.getCheckoutUrl());
            
            // Log để debug
            System.out.println("=== SEPAY CHECKOUT DATA ===");
            System.out.println("Merchant: " + sePayConfig.getMerchantId());
            System.out.println("Order: " + order.getOrderNumber());
            System.out.println("Amount: " + order.getFinalAmount());
            System.out.println("Signature: " + signature);
            System.out.println("Checkout URL: " + sePayConfig.getCheckoutUrl());
            System.out.println("===========================");
            
            return requestData;
            
        } catch (Exception e) {
            throw new RuntimeException("Error creating SePay checkout form data", e);
        }
    }
    
    /**
     * Tạo chữ ký HMAC-SHA256 theo đúng cách của SePay SDK
     * Chỉ ký các field cụ thể, nối bằng dấu phẩy, encode Base64
     * QUAN TRỌNG: Thứ tự field phải theo thứ tự xuất hiện trong data (Object.keys)
     */
    private String generateSignature(Map<String, Object> data) {
        try {
            // Danh sách các field được phép sign
            Set<String> allowedSignedFields = new HashSet<>(Arrays.asList(
                "merchant", "env", "operation", "payment_method", "order_amount",
                "currency", "order_invoice_number", "order_description", "customer_id",
                "agreement_id", "agreement_name", "agreement_type",
                "agreement_payment_frequency", "agreement_amount_per_payment",
                "success_url", "error_url", "cancel_url", "order_id"
            ));
            
            // Lấy các field theo thứ tự xuất hiện trong data (giống Object.keys trong JS)
            // LinkedHashMap giữ nguyên thứ tự insert
            List<String> signedParts = new ArrayList<>();
            for (Map.Entry<String, Object> entry : data.entrySet()) {
                String fieldName = entry.getKey();
                Object value = entry.getValue();
                
                // Chỉ lấy field nằm trong allowedSignedFields và không null
                if (allowedSignedFields.contains(fieldName) && value != null) {
                    signedParts.add(fieldName + "=" + value);
                }
            }
            
            // Nối các field bằng dấu PHẨY (không phải &)
            String dataString = String.join(",", signedParts);
            
            // Log data string để debug
            System.out.println("=== SIGNATURE CALCULATION ===");
            System.out.println("Data String: " + dataString);
            
            // Generate HMAC-SHA256
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                sePayConfig.getSecretKey().getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
            );
            sha256Hmac.init(secretKey);
            
            byte[] hash = sha256Hmac.doFinal(dataString.getBytes(StandardCharsets.UTF_8));
            
            // Encode Base64 (KHÔNG phải hex)
            String signature = Base64.getEncoder().encodeToString(hash);
            System.out.println("Signature: " + signature);
            System.out.println("=============================");
            
            return signature;
            
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
