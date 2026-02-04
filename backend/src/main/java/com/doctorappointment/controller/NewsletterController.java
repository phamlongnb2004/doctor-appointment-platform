package com.doctorappointment.controller;

import com.doctorappointment.model.NewsletterSubscription;
import com.doctorappointment.service.NewsletterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
@Slf4j
public class NewsletterController {
    
    private final NewsletterService newsletterService;
    
    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String name = request.get("name");
            String phone = request.get("phone");
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email không được để trống!"));
            }
            
            NewsletterSubscription subscription = newsletterService.subscribe(email, name, phone);
            
            return ResponseEntity.ok(Map.of(
                "message", "Mã xác nhận đã được gửi đến email của bạn!",
                "email", subscription.getEmail()
            ));
        } catch (RuntimeException e) {
            log.error("Error subscribing to newsletter", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error subscribing to newsletter", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Có lỗi xảy ra, vui lòng thử lại!"));
        }
    }
    
    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");
            
            if (email == null || code == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email và mã xác nhận không được để trống!"));
            }
            
            NewsletterSubscription subscription = newsletterService.verifyCode(email, code);
            
            return ResponseEntity.ok(Map.of(
                "message", "Đăng ký thành công! Bạn sẽ nhận được các thông báo ưu đãi qua email.",
                "subscription", subscription
            ));
        } catch (RuntimeException e) {
            log.error("Error verifying newsletter code", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error verifying newsletter code", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Có lỗi xảy ra, vui lòng thử lại!"));
        }
    }
    
    @GetMapping("/subscribers")
    public ResponseEntity<?> getAllSubscribers() {
        try {
            return ResponseEntity.ok(newsletterService.getAllSubscribers());
        } catch (Exception e) {
            log.error("Error getting subscribers", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Có lỗi xảy ra!"));
        }
    }
    
    @DeleteMapping("/subscribers/{id}")
    public ResponseEntity<?> deleteSubscriber(@PathVariable Long id) {
        try {
            newsletterService.deleteSubscriber(id);
            return ResponseEntity.ok(Map.of("message", "Đã xóa thành viên!"));
        } catch (Exception e) {
            log.error("Error deleting subscriber", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Có lỗi xảy ra!"));
        }
    }
    
    @PutMapping("/subscribers/{id}/toggle")
    public ResponseEntity<?> toggleSubscriberStatus(@PathVariable Long id) {
        try {
            NewsletterSubscription subscription = newsletterService.toggleSubscriberStatus(id);
            return ResponseEntity.ok(subscription);
        } catch (Exception e) {
            log.error("Error toggling subscriber status", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Có lỗi xảy ra!"));
        }
    }
}
