package com.doctorappointment.service;

import com.doctorappointment.dto.*;
import com.doctorappointment.model.*;
import com.doctorappointment.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private MedicalServiceRepository medicalServiceRepository;

    @Transactional
    public OrderResponse createOrder(Long userId, CheckoutRequest request) {
        // Get cart
        Cart cart = userId != null ?
                cartRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Cart not found")) :
                cartRepository.findBySessionId(request.getSessionId()).orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Create order
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUserId(userId);
        order.setSessionId(request.getSessionId());
        
        // Customer info
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerPhone(request.getCustomerPhone());
        
        // Shipping info
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingCity(request.getShippingCity());
        order.setShippingDistrict(request.getShippingDistrict());
        order.setShippingWard(request.getShippingWard());
        order.setShippingNotes(request.getShippingNotes());
        
        // Calculate amounts
        BigDecimal totalAmount = cart.getItems().stream()
                .map(item -> {
                    BigDecimal price = item.getPrice() != null ? item.getPrice() : BigDecimal.ZERO;
                    Integer quantity = item.getQuantity() != null ? item.getQuantity() : 1;
                    return price.multiply(BigDecimal.valueOf(quantity));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        order.setTotalAmount(totalAmount);
        order.setShippingFee(BigDecimal.ZERO); // Free shipping
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setFinalAmount(totalAmount);
        
        // Payment
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD");
        order.setPaymentStatus("PENDING");
        order.setStatus("PENDING");
        
        // Save order
        order = orderRepository.save(order);

        // Create order items from cart items
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setServiceId(cartItem.getServiceId());
            
            // Fetch service details if not loaded
            MedicalService service = cartItem.getService();
            if (service == null && cartItem.getServiceId() != null) {
                service = medicalServiceRepository.findById(cartItem.getServiceId()).orElse(null);
            }
            
            if (service != null) {
                orderItem.setServiceTitle(service.getTitle());
                orderItem.setServiceImage(service.getImageUrl());
                orderItem.setServiceSlug(service.getSlug());
            } else {
                orderItem.setServiceTitle("Unknown Service");
                orderItem.setServiceImage(null);
                orderItem.setServiceSlug(null);
            }
            
            orderItem.setQuantity(cartItem.getQuantity() != null ? cartItem.getQuantity() : 1);
            orderItem.setUnitPrice(cartItem.getPrice() != null ? cartItem.getPrice() : BigDecimal.ZERO);
            orderItem.setSubtotal(orderItem.getUnitPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())));
            
            order.getItems().add(orderItem);
        }
        
        orderItemRepository.saveAll(order.getItems());

        // DON'T clear cart immediately - only clear when payment is confirmed
        // User might cancel the order and want to keep items in cart
        // cartItemRepository.deleteAll(cart.getItems());
        // cart.getItems().clear();
        // cartRepository.save(cart);

        return mapToOrderResponse(order);
    }

    public OrderResponse getOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToOrderResponse(order);
    }

    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToOrderResponse(order);
    }

    public List<OrderResponse> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        return orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(status);
        
        if ("COMPLETED".equals(status)) {
            order.setCompletedAt(LocalDateTime.now());
            if ("COD".equals(order.getPaymentMethod())) {
                order.setPaymentStatus("PAID");
                order.setPaidAt(LocalDateTime.now());
            }
        } else if ("CANCELLED".equals(status)) {
            order.setCancelledAt(LocalDateTime.now());
        }
        
        order = orderRepository.save(order);
        return mapToOrderResponse(order);
    }

    @Transactional
    public OrderResponse updatePaymentStatus(Long orderId, String paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setPaymentStatus(paymentStatus);
        
        if ("PAID".equals(paymentStatus)) {
            order.setPaidAt(LocalDateTime.now());
            // Tự động chuyển trạng thái đơn hàng sang CONFIRMED
            if ("PENDING".equals(order.getStatus())) {
                order.setStatus("CONFIRMED");
            }
            // Clear cart after successful payment
            clearCartForOrder(order);
        }
        
        order = orderRepository.save(order);
        return mapToOrderResponse(order);
    }

    @Transactional
    public void confirmPayment(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setPaymentStatus("PAID");
        order.setPaidAt(LocalDateTime.now());
        
        // Tự động chuyển trạng thái đơn hàng sang CONFIRMED
        if ("PENDING".equals(order.getStatus())) {
            order.setStatus("CONFIRMED");
        }
        
        orderRepository.save(order);
        
        // Clear cart after successful payment
        clearCartForOrder(order);
    }
    
    private void clearCartForOrder(Order order) {
        try {
            Cart cart = null;
            if (order.getUserId() != null) {
                cart = cartRepository.findByUserId(order.getUserId()).orElse(null);
            } else if (order.getSessionId() != null) {
                cart = cartRepository.findBySessionId(order.getSessionId()).orElse(null);
            }
            
            if (cart != null && !cart.getItems().isEmpty()) {
                cartItemRepository.deleteAll(cart.getItems());
                cart.getItems().clear();
                cartRepository.save(cart);
            }
        } catch (Exception e) {
            // Log error but don't fail the payment confirmation
            System.err.println("Error clearing cart: " + e.getMessage());
        }
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Only allow cancellation if order is still PENDING
        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
        }
        
        order.setStatus("CANCELLED");
        order.setCancelledAt(LocalDateTime.now());
        order.setPaymentStatus("CANCELLED");
        
        order = orderRepository.save(order);
        return mapToOrderResponse(order);
    }

    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.format("%04d", (int)(Math.random() * 10000));
        return "ORD" + timestamp + random;
    }

    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setCustomerName(order.getCustomerName());
        response.setCustomerEmail(order.getCustomerEmail());
        response.setCustomerPhone(order.getCustomerPhone());
        response.setShippingAddress(order.getShippingAddress());
        response.setShippingCity(order.getShippingCity());
        response.setShippingDistrict(order.getShippingDistrict());
        response.setShippingWard(order.getShippingWard());
        response.setShippingNotes(order.getShippingNotes());
        response.setTotalAmount(order.getTotalAmount());
        response.setShippingFee(order.getShippingFee());
        response.setDiscountAmount(order.getDiscountAmount());
        response.setFinalAmount(order.getFinalAmount());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setStatus(order.getStatus());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        List<OrderItemResponse> items = order.getItems().stream()
                .map(this::mapToOrderItemResponse)
                .collect(Collectors.toList());
        response.setItems(items);

        return response;
    }

    private OrderItemResponse mapToOrderItemResponse(OrderItem item) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(item.getId());
        response.setServiceId(item.getServiceId());
        response.setServiceTitle(item.getServiceTitle());
        response.setServiceImage(item.getServiceImage());
        response.setServiceSlug(item.getServiceSlug());
        response.setQuantity(item.getQuantity());
        response.setUnitPrice(item.getUnitPrice());
        response.setSubtotal(item.getSubtotal());
        return response;
    }
}
