package com.doctorappointment.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailService {
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username:noreply@khamnow.com}")
    private String fromEmail;
    
    public void sendVerificationEmail(String toEmail, String name, String verificationCode) {
        if (mailSender == null) {
            logEmailToConsole("VERIFICATION", toEmail, name, verificationCode);
            return;
        }
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Xác nhận đăng ký nhận tin từ KHAMNOW");
            helper.setText(buildVerificationEmailContent(name, verificationCode), true);
            
            mailSender.send(message);
            log.info("✅ Verification email sent successfully to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("❌ Failed to send verification email to: {}", toEmail, e);
            // Fallback to console log
            logEmailToConsole("VERIFICATION", toEmail, name, verificationCode);
        }
    }
    
    public void sendWelcomeEmail(String toEmail, String name) {
        if (mailSender == null) {
            logWelcomeEmailToConsole(toEmail, name);
            return;
        }
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Chào mừng bạn đến với KHAMNOW!");
            helper.setText(buildWelcomeEmailContent(name), true);
            
            mailSender.send(message);
            log.info("✅ Welcome email sent successfully to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("❌ Failed to send welcome email to: {}", toEmail, e);
            logWelcomeEmailToConsole(toEmail, name);
        }
    }
    
    private void logEmailToConsole(String type, String toEmail, String name, String verificationCode) {
        log.info("=================================================");
        log.info("📧 SENDING {} EMAIL (Console Mode)", type);
        log.info("=================================================");
        log.info("To: {}", toEmail);
        log.info("Subject: Xác nhận đăng ký nhận tin từ KHAMNOW");
        log.info("");
        log.info("Xin chào {},", name != null ? name : "bạn");
        log.info("");
        log.info("Cảm ơn bạn đã đăng ký nhận tin từ KHAMNOW!");
        log.info("");
        log.info("Mã xác nhận của bạn là: {}", verificationCode);
        log.info("");
        log.info("Vui lòng nhập mã này vào trang web để hoàn tất đăng ký.");
        log.info("Mã có hiệu lực trong 15 phút.");
        log.info("");
        log.info("Sau khi xác nhận, bạn sẽ nhận được các thông báo ưu đãi và tin tức y tế mới nhất từ KHAMNOW.");
        log.info("");
        log.info("Trân trọng,");
        log.info("Đội ngũ KHAMNOW");
        log.info("=================================================");
    }
    
    private void logWelcomeEmailToConsole(String toEmail, String name) {
        log.info("=================================================");
        log.info("📧 SENDING WELCOME EMAIL (Console Mode)");
        log.info("=================================================");
        log.info("To: {}", toEmail);
        log.info("Subject: Chào mừng bạn đến với KHAMNOW!");
        log.info("");
        log.info("Xin chào {},", name != null ? name : "bạn");
        log.info("");
        log.info("Chúc mừng! Bạn đã đăng ký nhận tin thành công.");
        log.info("");
        log.info("Từ giờ, bạn sẽ nhận được:");
        log.info("✅ Thông tin về các chương trình khuyến mãi đặc biệt");
        log.info("✅ Tin tức y tế và sức khỏe mới nhất");
        log.info("✅ Các dịch vụ và gói khám sức khỏe ưu đãi");
        log.info("");
        log.info("Cảm ơn bạn đã tin tưởng KHAMNOW!");
        log.info("");
        log.info("Trân trọng,");
        log.info("Đội ngũ KHAMNOW");
        log.info("=================================================");
    }
    
    private String buildVerificationEmailContent(String name, String verificationCode) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        line-height: 1.6; 
                        color: #333; 
                        margin: 0;
                        padding: 0;
                        background-color: #f5f5f5;
                    }
                    .container { 
                        max-width: 600px; 
                        margin: 20px auto; 
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    }
                    .header { 
                        background: linear-gradient(135deg, #0066cc 0%%, #004d99 100%%); 
                        color: white; 
                        padding: 40px 30px; 
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0 0 10px 0;
                        font-size: 32px;
                        font-weight: 700;
                        letter-spacing: 1px;
                    }
                    .header p {
                        margin: 0;
                        font-size: 16px;
                        opacity: 0.95;
                    }
                    .content { 
                        padding: 40px 30px;
                        background: white;
                    }
                    .content p {
                        margin: 0 0 16px 0;
                        font-size: 15px;
                        line-height: 1.6;
                    }
                    .code-box { 
                        background: linear-gradient(135deg, #e6f2ff 0%%, #cce5ff 100%%);
                        border: 3px dashed #0066cc; 
                        padding: 30px; 
                        text-align: center; 
                        margin: 30px 0; 
                        border-radius: 12px;
                    }
                    .code { 
                        font-size: 42px; 
                        font-weight: 800; 
                        color: #0066cc; 
                        letter-spacing: 8px;
                        font-family: 'Courier New', monospace;
                    }
                    .benefits {
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 20px 0;
                    }
                    .benefits ul {
                        margin: 10px 0;
                        padding-left: 20px;
                    }
                    .benefits li {
                        margin: 8px 0;
                        font-size: 14px;
                    }
                    .footer { 
                        background: #262626; 
                        color: #999; 
                        padding: 30px; 
                        text-align: center; 
                        font-size: 13px;
                    }
                    .footer p {
                        margin: 5px 0;
                    }
                    .warning {
                        background: #fff7e6;
                        border-left: 4px solid #faad14;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 4px;
                    }
                    .warning strong {
                        color: #d46b08;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>KHAMNOW</h1>
                        <p>Xác nhận đăng ký nhận tin</p>
                    </div>
                    <div class="content">
                        <p>Xin chào <strong>%s</strong>,</p>
                        <p>Cảm ơn bạn đã đăng ký nhận tin từ <strong>KHAMNOW</strong>!</p>
                        <p>Để hoàn tất đăng ký, vui lòng nhập mã xác nhận sau vào trang web:</p>
                        <div class="code-box">
                            <div class="code">%s</div>
                        </div>
                        <div class="warning">
                            <p><strong>Lưu ý:</strong> Mã xác nhận có hiệu lực trong <strong>15 phút</strong>.</p>
                        </div>
                        <div class="benefits">
                            <p><strong>Sau khi xác nhận, bạn sẽ nhận được:</strong></p>
                            <ul>
                                <li>Thông tin về các chương trình khuyến mãi đặc biệt</li>
                                <li>Tin tức y tế và sức khỏe mới nhất</li>
                                <li>Các dịch vụ và gói khám sức khỏe ưu đãi</li>
                                <li>Tư vấn sức khỏe từ đội ngũ chuyên gia</li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer">
                        <p><strong>© 2026 KHAMNOW</strong> - Nền tảng đặt khám trực tuyến</p>
                        <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                        <p style="margin-top: 15px; font-size: 11px; color: #666;">
                            Nếu bạn không đăng ký nhận tin, vui lòng bỏ qua email này.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """, name != null ? name : "bạn", verificationCode);
    }
    
    private String buildWelcomeEmailContent(String name) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        line-height: 1.6; 
                        color: #333; 
                        margin: 0;
                        padding: 0;
                        background-color: #f5f5f5;
                    }
                    .container { 
                        max-width: 600px; 
                        margin: 20px auto; 
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    }
                    .header { 
                        background: linear-gradient(135deg, #0066cc 0%%, #004d99 100%%); 
                        color: white; 
                        padding: 40px 30px; 
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0 0 10px 0;
                        font-size: 32px;
                        font-weight: 700;
                    }
                    .header p {
                        margin: 0;
                        font-size: 18px;
                        opacity: 0.95;
                    }
                    .content { 
                        padding: 40px 30px;
                        background: white;
                    }
                    .content p {
                        margin: 0 0 16px 0;
                        font-size: 15px;
                        line-height: 1.6;
                    }
                    .success-box {
                        background: linear-gradient(135deg, #e6f2ff 0%%, #cce5ff 100%%);
                        border: 3px solid #0066cc;
                        padding: 30px;
                        text-align: center;
                        margin: 30px 0;
                        border-radius: 12px;
                    }
                    .success-icon {
                        font-size: 48px;
                        margin-bottom: 15px;
                        color: #0066cc;
                        font-weight: 700;
                    }
                    .benefits {
                        background: #f8f9fa;
                        padding: 25px;
                        border-radius: 8px;
                        margin: 20px 0;
                    }
                    .benefits h3 {
                        margin: 0 0 15px 0;
                        color: #0066cc;
                        font-size: 18px;
                    }
                    .benefits ul {
                        margin: 0;
                        padding-left: 20px;
                    }
                    .benefits li {
                        margin: 10px 0;
                        font-size: 15px;
                    }
                    .cta-button {
                        display: inline-block;
                        background: #0066cc;
                        color: white;
                        padding: 15px 40px;
                        text-decoration: none;
                        border-radius: 8px;
                        margin: 20px 0;
                        font-weight: 600;
                        font-size: 16px;
                    }
                    .footer { 
                        background: #262626; 
                        color: #999; 
                        padding: 30px; 
                        text-align: center; 
                        font-size: 13px;
                    }
                    .footer p {
                        margin: 5px 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>KHAMNOW</h1>
                        <p>Chào mừng bạn!</p>
                    </div>
                    <div class="content">
                        <div class="success-box">
                            <h2 style="margin: 0; color: #0066cc;">✓ Đăng ký thành công!</h2>
                        </div>
                        <p>Xin chào <strong>%s</strong>,</p>
                        <p>Chúc mừng! Bạn đã trở thành thành viên nhận tin của <strong>KHAMNOW</strong>.</p>
                        <div class="benefits">
                            <h3>Bạn sẽ nhận được:</h3>
                            <ul>
                                <li><strong>Ưu đãi độc quyền</strong> - Các chương trình khuyến mãi đặc biệt dành riêng cho thành viên</li>
                                <li><strong>Tin tức y tế</strong> - Cập nhật kiến thức sức khỏe mới nhất từ các chuyên gia</li>
                                <li><strong>Gói khám ưu đãi</strong> - Các dịch vụ khám chữa bệnh với giá đặc biệt</li>
                                <li><strong>Tư vấn miễn phí</strong> - Hỗ trợ tư vấn sức khỏe từ đội ngũ bác sĩ giàu kinh nghiệm</li>
                                <li><strong>Nhắc lịch khám</strong> - Nhắc nhở định kỳ về các lịch khám sức khỏe quan trọng</li>
                            </ul>
                        </div>
                        <p style="text-align: center;">
                            <a href="http://localhost:3000" class="cta-button">Khám phá dịch vụ</a>
                        </p>
                        <p style="margin-top: 30px; color: #666; font-size: 14px;">
                            Cảm ơn bạn đã tin tưởng và lựa chọn KHAMNOW làm đối tác chăm sóc sức khỏe!
                        </p>
                    </div>
                    <div class="footer">
                        <p><strong>© 2026 KHAMNOW</strong> - Nền tảng đặt khám trực tuyến</p>
                        <p>Hotline: <strong>1900 56 56 56</strong></p>
                        <p style="margin-top: 15px; font-size: 11px; color: #666;">
                            Nếu bạn muốn hủy đăng ký, vui lòng liên hệ với chúng tôi.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """, name != null ? name : "bạn");
    }
}
