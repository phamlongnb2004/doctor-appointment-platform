package com.doctorappointment.controller;

import com.doctorappointment.dto.CheckoutRequest;
import com.doctorappointment.dto.OrderResponse;
import com.doctorappointment.service.OrderService;
import com.doctorappointment.service.SePayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private SePayService sePayService;
    
    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Order system working!");
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(
            @RequestParam(required = false) Long userId,
            @RequestBody CheckoutRequest request) {
        OrderResponse order = orderService.createOrder(userId, request);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
        OrderResponse order = orderService.getOrder(id);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderResponse> getOrderByNumber(@PathVariable String orderNumber) {
        OrderResponse order = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/user")
    public ResponseEntity<List<OrderResponse>> getUserOrders(@RequestParam Long userId) {
        List<OrderResponse> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        OrderResponse order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/payment-status")
    public ResponseEntity<OrderResponse> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String paymentStatus = request.get("paymentStatus");
        OrderResponse order = orderService.updatePaymentStatus(id, paymentStatus);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Long id) {
        OrderResponse order = orderService.cancelOrder(id);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/cancel-by-number/{orderNumber}")
    public ResponseEntity<OrderResponse> cancelOrderByNumber(@PathVariable String orderNumber) {
        OrderResponse order = orderService.cancelOrderByNumber(orderNumber);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/webhook/payment")
    public ResponseEntity<String> paymentWebhook(@RequestBody Map<String, Object> payload) {
        // Webhook để nhận thông báo thanh toán từ ngân hàng
        // Payload sẽ chứa: orderNumber, amount, transactionId, status
        try {
            String orderNumber = (String) payload.get("orderNumber");
            String status = (String) payload.get("status");
            
            if ("SUCCESS".equals(status)) {
                orderService.confirmPayment(orderNumber);
            }
            
            return ResponseEntity.ok("Webhook received");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing webhook");
        }
    }
    
    /**
     * Tạo checkout SePay - trả về form data để frontend submit
     */
    @PostMapping("/sepay/checkout")
    public ResponseEntity<Map<String, Object>> createSePayCheckout(
            @RequestParam(required = false) Long userId,
            @RequestBody CheckoutRequest request) {
        
        // Tạo đơn hàng trước
        OrderResponse order = orderService.createOrder(userId, request);
        
        // Log frontend URL để debug
        System.out.println("=== FRONTEND URL DEBUG ===");
        System.out.println("frontendUrl value: [" + frontendUrl + "]");
        System.out.println("frontendUrl length: " + frontendUrl.length());
        System.out.println("frontendUrl trimmed: [" + frontendUrl.trim() + "]");
        
        // Tạo form data để submit đến SePay - trim để loại bỏ khoảng trắng
        String cleanFrontendUrl = frontendUrl.trim();
        String successUrl = cleanFrontendUrl + "/order-success/" + order.getOrderNumber();
        String errorUrl = cleanFrontendUrl + "/checkout?error=payment_failed&order=" + order.getOrderNumber();
        String cancelUrl = cleanFrontendUrl + "/checkout?cancelled=true&order=" + order.getOrderNumber();
        
        System.out.println("Success URL: [" + successUrl + "]");
        System.out.println("==========================");
        
        Map<String, Object> formData = sePayService.createCheckoutFormData(
            orderService.getOrderEntity(order.getId()),
            successUrl,
            errorUrl,
            cancelUrl
        );
        
        // Thêm thông tin đơn hàng vào response
        formData.put("order_id", order.getId());
        formData.put("order_number", order.getOrderNumber());
        
        return ResponseEntity.ok(formData);
    }
    
    /**
     * IPN callback từ SePay (nhận JSON data)
     * Format theo tài liệu: https://docs.sepay.vn
     */
    @PostMapping("/sepay/ipn")
    public ResponseEntity<Map<String, Object>> sePayIpn(@RequestBody Map<String, Object> ipnData) {
        try {
            // Log IPN data để debug
            System.out.println("Received SePay IPN: " + ipnData);
            
            // Kiểm tra notification_type
            String notificationType = (String) ipnData.get("notification_type");
            
            if ("ORDER_PAID".equals(notificationType)) {
                // Lấy thông tin order từ nested object
                @SuppressWarnings("unchecked")
                Map<String, Object> orderData = (Map<String, Object>) ipnData.get("order");
                
                if (orderData != null) {
                    String orderInvoiceNumber = (String) orderData.get("order_invoice_number");
                    String orderStatus = (String) orderData.get("order_status");
                    
                    // Kiểm tra order_status = "CAPTURED" (thanh toán thành công)
                    if ("CAPTURED".equals(orderStatus)) {
                        orderService.confirmPayment(orderInvoiceNumber);
                        
                        return ResponseEntity.ok(Map.of(
                            "success", true,
                            "message", "Payment confirmed for order: " + orderInvoiceNumber
                        ));
                    }
                }
            }
            
            // Trả về 200 để SePay biết đã nhận được IPN
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "IPN received"
            ));
            
        } catch (Exception e) {
            // Log lỗi
            System.err.println("Error processing SePay IPN: " + e.getMessage());
            e.printStackTrace();
            
            // Vẫn trả về 200 để tránh SePay retry liên tục
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Error: " + e.getMessage()
            ));
        }
    }
}
