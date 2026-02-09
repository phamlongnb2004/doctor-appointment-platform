package com.doctorappointment.controller;

import com.doctorappointment.dto.AddToCartRequest;
import com.doctorappointment.dto.CartResponse;
import com.doctorappointment.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(
            @RequestParam(required = false) Long userId,
            @RequestBody AddToCartRequest request) {
        CartResponse cart = cartService.addToCart(userId, request);
        return ResponseEntity.ok(cart);
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String sessionId) {
        CartResponse cart = cartService.getCart(userId, sessionId);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long itemId,
            @RequestParam Integer quantity,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String sessionId) {
        CartResponse cart = cartService.updateCartItem(userId, sessionId, itemId, quantity);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeCartItem(
            @PathVariable Long itemId,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String sessionId) {
        CartResponse cart = cartService.removeCartItem(userId, sessionId, itemId);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String sessionId) {
        cartService.clearCart(userId, sessionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/merge")
    public ResponseEntity<CartResponse> mergeCart(
            @RequestParam Long userId,
            @RequestParam String sessionId) {
        CartResponse cart = cartService.mergeCart(userId, sessionId);
        return ResponseEntity.ok(cart);
    }
}
