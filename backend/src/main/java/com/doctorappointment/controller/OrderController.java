package com.doctorappointment.controller;

import com.doctorappointment.dto.CheckoutRequest;
import com.doctorappointment.dto.OrderResponse;
import com.doctorappointment.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

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
}
