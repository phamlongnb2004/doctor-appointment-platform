package com.doctorappointment.service;

import com.doctorappointment.model.PasswordResetToken;
import com.doctorappointment.model.User;
import com.doctorappointment.repository.PasswordResetTokenRepository;
import com.doctorappointment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PasswordResetService {
    
    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final SendGridEmailService emailService;
    private final PasswordEncoder passwordEncoder;
    
    private static final int TOKEN_LENGTH = 6;
    private static final int TOKEN_VALIDITY_MINUTES = 15;
    private static final String DIGITS = "0123456789";
    
    /**
     * Tạo và gửi mã reset password
     */
    @Transactional
    public void sendPasswordResetToken(String email) {
        // Tìm user theo email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với email: " + email));
        
        // Xóa tất cả token cũ của user này
        tokenRepository.deleteByUserId(user.getId());
        
        // Tạo token mới (6 chữ số)
        String token = generateNumericToken();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(TOKEN_VALIDITY_MINUTES);
        
        // Lưu token vào database
        PasswordResetToken resetToken = new PasswordResetToken(user.getId(), token, expiresAt);
        tokenRepository.save(resetToken);
        
        // Gửi email
        String fullName = user.getFirstName() + " " + user.getLastName();
        emailService.sendPasswordResetEmail(email, fullName, token);
        
        System.out.println("✅ Password reset token sent to: " + email);
        System.out.println("Token: " + token + " (expires in " + TOKEN_VALIDITY_MINUTES + " minutes)");
    }
    
    /**
     * Xác minh token reset password
     */
    public boolean verifyResetToken(String token) {
        Optional<PasswordResetToken> resetTokenOpt = tokenRepository.findByToken(token);
        
        if (resetTokenOpt.isEmpty()) {
            System.out.println("❌ Token not found: " + token);
            return false;
        }
        
        PasswordResetToken resetToken = resetTokenOpt.get();
        
        if (resetToken.isUsed()) {
            System.out.println("❌ Token already used: " + token);
            return false;
        }
        
        if (resetToken.isExpired()) {
            System.out.println("❌ Token expired: " + token);
            return false;
        }
        
        System.out.println("✅ Token valid: " + token);
        return true;
    }
    
    /**
     * Reset mật khẩu với token
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        // Tìm token
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Mã xác nhận không hợp lệ"));
        
        // Kiểm tra token
        if (resetToken.isUsed()) {
            throw new RuntimeException("Mã xác nhận đã được sử dụng");
        }
        
        if (resetToken.isExpired()) {
            throw new RuntimeException("Mã xác nhận đã hết hạn");
        }
        
        // Tìm user
        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        // Validate password
        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("Mật khẩu phải có ít nhất 6 ký tự");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Đánh dấu token đã sử dụng
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
        
        System.out.println("✅ Password reset successfully for user: " + user.getEmail());
    }
    
    /**
     * Tạo token số ngẫu nhiên 6 chữ số
     */
    private String generateNumericToken() {
        SecureRandom random = new SecureRandom();
        StringBuilder token = new StringBuilder(TOKEN_LENGTH);
        
        for (int i = 0; i < TOKEN_LENGTH; i++) {
            token.append(DIGITS.charAt(random.nextInt(DIGITS.length())));
        }
        
        return token.toString();
    }
    
    /**
     * Tự động xóa token hết hạn mỗi giờ
     */
    @Scheduled(fixedRate = 3600000) // Chạy mỗi 1 giờ
    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
        System.out.println("🧹 Cleaned up expired password reset tokens");
    }
}
