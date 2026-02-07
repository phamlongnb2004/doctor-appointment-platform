package com.doctorappointment.service;

import com.doctorappointment.model.NewsletterSubscription;
import com.doctorappointment.repository.NewsletterSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class NewsletterService {
    
    private final NewsletterSubscriptionRepository subscriptionRepository;
    private final EmailService emailService;
    
    @Transactional
    public NewsletterSubscription subscribe(String email, String name, String phone) {
        // Check if email already exists
        if (subscriptionRepository.existsByEmail(email)) {
            var existing = subscriptionRepository.findByEmail(email).orElseThrow();
            
            // If already verified, return error
            if (existing.getIsVerified()) {
                throw new RuntimeException("Email này đã được đăng ký!");
            }
            
            // If not verified, resend verification code
            String newCode = generateVerificationCode();
            existing.setVerificationCode(newCode);
            existing.setExpiresAt(LocalDateTime.now().plusMinutes(15));
            existing.setName(name);
            existing.setPhone(phone);
            
            subscriptionRepository.save(existing);
            
            // Send verification email (non-blocking, log if fails)
            try {
                emailService.sendVerificationEmail(email, name, newCode);
            } catch (Exception e) {
                log.warn("Failed to send verification email to {}, but code updated. Code: {}", email, newCode);
            }
            
            log.info("Resent verification code to existing subscription: {}", email);
            return existing;
        }
        
        // Create new subscription
        String verificationCode = generateVerificationCode();
        
        NewsletterSubscription subscription = new NewsletterSubscription();
        subscription.setEmail(email);
        subscription.setName(name);
        subscription.setPhone(phone);
        subscription.setVerificationCode(verificationCode);
        subscription.setIsVerified(false);
        subscription.setIsActive(true);
        subscription.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        
        subscriptionRepository.save(subscription);
        
        // Send verification email (non-blocking, log if fails)
        try {
            emailService.sendVerificationEmail(email, name, verificationCode);
        } catch (Exception e) {
            log.warn("Failed to send verification email to {}, but subscription created. Code: {}", email, verificationCode);
        }
        
        log.info("Created new newsletter subscription for: {}", email);
        return subscription;
    }
    
    @Transactional
    public NewsletterSubscription verifyCode(String email, String code) {
        NewsletterSubscription subscription = subscriptionRepository
            .findByEmailAndVerificationCode(email, code)
            .orElseThrow(() -> new RuntimeException("Mã xác nhận không đúng!"));
        
        // Check if code expired
        if (LocalDateTime.now().isAfter(subscription.getExpiresAt())) {
            throw new RuntimeException("Mã xác nhận đã hết hạn! Vui lòng đăng ký lại.");
        }
        
        // Check if already verified
        if (subscription.getIsVerified()) {
            throw new RuntimeException("Email này đã được xác nhận!");
        }
        
        // Verify subscription
        subscription.setIsVerified(true);
        subscription.setVerifiedAt(LocalDateTime.now());
        subscriptionRepository.save(subscription);
        
        // Send welcome email (non-blocking, log if fails)
        try {
            emailService.sendWelcomeEmail(email, subscription.getName());
        } catch (Exception e) {
            log.warn("Failed to send welcome email to {}, but subscription verified", email);
        }
        
        log.info("Verified newsletter subscription for: {}", email);
        return subscription;
    }
    
    public java.util.List<NewsletterSubscription> getAllSubscribers() {
        return subscriptionRepository.findAll();
    }
    
    @Transactional
    public void deleteSubscriber(Long id) {
        subscriptionRepository.deleteById(id);
        log.info("Deleted newsletter subscription with id: {}", id);
    }
    
    @Transactional
    public NewsletterSubscription toggleSubscriberStatus(Long id) {
        NewsletterSubscription subscription = subscriptionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy thành viên!"));
        
        subscription.setIsActive(!subscription.getIsActive());
        subscriptionRepository.save(subscription);
        
        log.info("Toggled status for subscription id {}: {}", id, subscription.getIsActive());
        return subscription;
    }
    
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 6-digit code
        return String.valueOf(code);
    }
}
