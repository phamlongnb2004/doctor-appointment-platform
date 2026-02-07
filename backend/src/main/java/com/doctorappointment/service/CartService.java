package com.doctorappointment.service;

import com.doctorappointment.dto.AddToCartRequest;
import com.doctorappointment.dto.CartItemResponse;
import com.doctorappointment.dto.CartResponse;
import com.doctorappointment.model.Cart;
import com.doctorappointment.model.CartItem;
import com.doctorappointment.model.MedicalService;
import com.doctorappointment.repository.CartItemRepository;
import com.doctorappointment.repository.CartRepository;
import com.doctorappointment.repository.MedicalServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private MedicalServiceRepository medicalServiceRepository;

    @Transactional
    public CartResponse addToCart(Long userId, AddToCartRequest request) {
        // Get or create cart
        Cart cart = getOrCreateCart(userId, request.getSessionId());

        // Get service
        MedicalService service = medicalServiceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndServiceId(cart.getId(), service.getId());

        if (existingItem.isPresent()) {
            // Update quantity
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            // Add new item
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setServiceId(service.getId());
            newItem.setQuantity(request.getQuantity());
            // Use discounted price if available, otherwise original price
            BigDecimal price = service.getDiscountedPrice() != null ? 
                service.getDiscountedPrice() : service.getOriginalPrice();
            newItem.setPrice(price);
            cartItemRepository.save(newItem);
        }

        return getCart(userId, request.getSessionId());
    }

    public CartResponse getCart(Long userId, String sessionId) {
        Optional<Cart> cartOpt = userId != null ? 
            cartRepository.findByUserId(userId) : 
            cartRepository.findBySessionId(sessionId);

        if (cartOpt.isEmpty()) {
            return createEmptyCartResponse();
        }

        Cart cart = cartOpt.get();
        CartResponse response = new CartResponse();
        response.setId(cart.getId());

        List<CartItemResponse> items = cart.getItems().stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());

        response.setItems(items);
        response.setTotalItems(items.stream().mapToInt(CartItemResponse::getQuantity).sum());
        response.setTotalAmount(items.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        return response;
    }

    @Transactional
    public CartResponse updateCartItem(Long userId, String sessionId, Long itemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return getCart(userId, sessionId);
    }

    @Transactional
    public CartResponse removeCartItem(Long userId, String sessionId, Long itemId) {
        System.out.println("=== removeCartItem called ===");
        System.out.println("itemId: " + itemId);
        System.out.println("userId: " + userId);
        System.out.println("sessionId: " + sessionId);
        
        // Check if item exists
        Optional<CartItem> itemOpt = cartItemRepository.findById(itemId);
        if (itemOpt.isEmpty()) {
            System.out.println("Item not found!");
            throw new RuntimeException("Cart item not found with id: " + itemId);
        }
        
        CartItem item = itemOpt.get();
        Long cartId = item.getCart().getId();
        
        System.out.println("Item found, deleting...");
        cartItemRepository.delete(item);
        cartItemRepository.flush(); // Force flush to database
        System.out.println("Item deleted and flushed successfully");
        
        // Get fresh cart from database
        Optional<Cart> cartOpt = cartRepository.findById(cartId);
        if (cartOpt.isEmpty()) {
            return createEmptyCartResponse();
        }
        
        Cart cart = cartOpt.get();
        CartResponse response = new CartResponse();
        response.setId(cart.getId());

        List<CartItemResponse> items = cart.getItems().stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());

        response.setItems(items);
        response.setTotalItems(items.stream().mapToInt(CartItemResponse::getQuantity).sum());
        response.setTotalAmount(items.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        
        System.out.println("Remaining items: " + response.getItems().size());
        return response;
    }

    @Transactional
    public void clearCart(Long userId, String sessionId) {
        Optional<Cart> cartOpt = userId != null ? 
            cartRepository.findByUserId(userId) : 
            cartRepository.findBySessionId(sessionId);

        cartOpt.ifPresent(cart -> {
            cartItemRepository.deleteAll(cart.getItems());
            cart.getItems().clear();
            cartRepository.save(cart);
        });
    }

    private Cart getOrCreateCart(Long userId, String sessionId) {
        Optional<Cart> cartOpt = userId != null ? 
            cartRepository.findByUserId(userId) : 
            cartRepository.findBySessionId(sessionId);

        if (cartOpt.isPresent()) {
            return cartOpt.get();
        }

        Cart newCart = new Cart();
        newCart.setUserId(userId);
        newCart.setSessionId(sessionId);
        return cartRepository.save(newCart);
    }

    private CartItemResponse mapToCartItemResponse(CartItem item) {
        CartItemResponse response = new CartItemResponse();
        response.setId(item.getId());
        response.setServiceId(item.getServiceId());
        response.setQuantity(item.getQuantity());
        response.setPrice(item.getPrice());
        response.setSubtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));

        if (item.getService() != null) {
            response.setServiceTitle(item.getService().getTitle());
            response.setServiceImage(item.getService().getImageUrl());
            response.setServiceSlug(item.getService().getSlug());
            response.setAvailableQuantity(item.getService().getQuantity());
        }

        return response;
    }

    private CartResponse createEmptyCartResponse() {
        CartResponse response = new CartResponse();
        response.setItems(new ArrayList<>());
        response.setTotalItems(0);
        response.setTotalAmount(BigDecimal.ZERO);
        return response;
    }
}
