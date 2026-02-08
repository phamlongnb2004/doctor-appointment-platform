package com.doctorappointment.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@Slf4j
public class SendGridEmailService {
    
    @Value("${sendgrid.api-key:}")
    private String sendGridApiKey;
    
    @Value("${sendgrid.from-email:noreply@medlatec.com}")
    private String fromEmail;
    
    @Value("${sendgrid.from-name:MEDLATEC}")
    private String fromName;
    
    public void sendVerificationEmail(String toEmail, String name, String verificationCode) {
        if (sendGridApiKey == null || sendGridApiKey.trim().isEmpty()) {
            logEmailToConsole("VERIFICATION", toEmail, name, verificationCode);
            return;
        }
        
        try {
            Email from = new Email(fromEmail, fromName);
            Email to = new Email(toEmail);
            String subject = "Xác nhận đăng ký nhận tin từ MEDLATEC";
            Content content = new Content("text/html", buildVerificationEmailContent(name, verificationCode));
            
            Mail mail = new Mail(from, subject, to, content);
            
            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                log.info("✅ SendGrid verification email sent successfully to: {}", toEmail);
            } else {
                log.error("❌ SendGrid failed with status {}: {}", response.getStatusCode(), response.getBody());
                logEmailToConsole("VERIFICATION", toEmail, name, verificationCode);
            }
        } catch (IOException e) {
            log.error("❌ Failed to send verification email via SendGrid to: {}", toEmail, e);
            logEmailToConsole("VERIFICATION", toEmail, name, verificationCode);
        }
    }
    
    public void sendWelcomeEmail(String toEmail, String name) {
        if (sendGridApiKey == null || sendGridApiKey.trim().isEmpty()) {
            logWelcomeEmailToConsole(toEmail, name);
            return;
        }
        
        try {
            Email from = new Email(fromEmail, fromName);
            Email to = new Email(toEmail);
            String subject = "Chào mừng bạn đến với MEDLATEC!";
            Content content = new Content("text/html", buildWelcomeEmailContent(name));
            
            Mail mail = new Mail(from, subject, to, content);
            
            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                log.info("✅ SendGrid welcome email sent successfully to: {}", toEmail);
            } else {
                log.error("❌ SendGrid failed with status {}: {}", response.getStatusCode(), response.getBody());
                logWelcomeEmailToConsole(toEmail, name);
            }
        } catch (IOException e) {
            log.error("❌ Failed to send welcome email via SendGrid to: {}", toEmail, e);
            logWelcomeEmailToConsole(toEmail, name);
        }
    }
    
    private void logEmailToConsole(String type, String toEmail, String name, String verificationCode) {
        log.info("=================================================");
        log.info("📧 SENDING {} EMAIL (Console Mode - SendGrid not configured)", type);
        log.info("=================================================");
        log.info("To: {}", toEmail);
        log.info("Subject: Xác nhận đăng ký nhận tin từ MEDLATEC");
        log.info("");
        log.info("Xin chào {},", name != null ? name : "bạn");
        log.info("");
        log.info("Cảm ơn bạn đã đăng ký nhận tin từ MEDLATEC!");
        log.info("");
        log.info("🔑 Mã xác nhận của bạn là: {}", verificationCode);
        log.info("");
        log.info("Vui lòng nhập mã này vào trang web để hoàn tất đăng ký.");
        log.info("Mã có hiệu lực trong 15 phút.");
        log.info("=================================================");
    }
    
    private void logWelcomeEmailToConsole(String toEmail, String name) {
        log.info("=================================================");
        log.info("📧 SENDING WELCOME EMAIL (Console Mode - SendGrid not configured)");
        log.info("=================================================");
        log.info("To: {}", toEmail);
        log.info("Subject: Chào mừng bạn đến với MEDLATEC!");
        log.info("");
        log.info("Xin chào {},", name != null ? name : "bạn");
        log.info("");
        log.info("🎉 Chúc mừng! Bạn đã đăng ký nhận tin thành công.");
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
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #1890ff 0%%, #096dd9 100%%); color: white; padding: 40px 30px; text-align: center; }
                    .header h1 { margin: 0 0 10px 0; font-size: 32px; }
                    .content { padding: 40px 30px; }
                    .code-box { background: linear-gradient(135deg, #e6f7ff 0%%, #bae7ff 100%%); border: 3px dashed #1890ff; padding: 30px; text-align: center; margin: 30px 0; border-radius: 12px; }
                    .code { font-size: 42px; font-weight: 800; color: #1890ff; letter-spacing: 8px; font-family: 'Courier New', monospace; }
                    .footer { background: #f5f5f5; color: #666; padding: 30px; text-align: center; font-size: 13px; }
                    .unsubscribe { color: #999; font-size: 11px; margin-top: 15px; }
                    .unsubscribe a { color: #999; text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏥 DOCTOR APPOINTMENT PLATFORM</h1>
                        <p>Xác nhận đăng ký nhận tin</p>
                    </div>
                    <div class="content">
                        <p>Xin chào <strong>%s</strong>,</p>
                        <p>Cảm ơn bạn đã đăng ký nhận tin từ hệ thống của chúng tôi.</p>
                        <p>Để hoàn tất đăng ký, vui lòng sử dụng mã xác nhận sau:</p>
                        <div class="code-box">
                            <div class="code">%s</div>
                        </div>
                        <p style="color: #d46b08;">⏰ Mã xác nhận có hiệu lực trong <strong>15 phút</strong>.</p>
                        <p>Nếu bạn không yêu cầu đăng ký này, vui lòng bỏ qua email này.</p>
                    </div>
                    <div class="footer">
                        <p><strong>© 2026 DOCTOR APPOINTMENT PLATFORM</strong></p>
                        <p>Hệ thống đặt lịch khám bệnh trực tuyến</p>
                        <div class="unsubscribe">
                            <p>Email này được gửi tự động. Vui lòng không trả lời trực tiếp.</p>
                        </div>
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
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #10b981 0%%, #059669 100%%); color: white; padding: 40px 30px; text-align: center; }
                    .header h1 { margin: 0 0 10px 0; font-size: 32px; }
                    .content { padding: 40px 30px; }
                    .success-box { background: linear-gradient(135deg, #d1fae5 0%%, #a7f3d0 100%%); border: 3px solid #10b981; padding: 30px; text-align: center; margin: 30px 0; border-radius: 12px; }
                    .footer { background: #f5f5f5; color: #666; padding: 30px; text-align: center; font-size: 13px; }
                    .unsubscribe { color: #999; font-size: 11px; margin-top: 15px; }
                    .unsubscribe a { color: #999; text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏥 DOCTOR APPOINTMENT PLATFORM</h1>
                        <p>Chào mừng bạn</p>
                    </div>
                    <div class="content">
                        <div class="success-box">
                            <div style="font-size: 64px;">🎉</div>
                            <h2 style="margin: 0; color: #10b981;">Đăng ký thành công</h2>
                        </div>
                        <p>Xin chào <strong>%s</strong>,</p>
                        <p>Cảm ơn bạn đã xác nhận đăng ký nhận tin từ hệ thống của chúng tôi.</p>
                        <p>Bạn sẽ nhận được các thông báo và tin tức mới nhất qua email này.</p>
                    </div>
                    <div class="footer">
                        <p><strong>© 2026 DOCTOR APPOINTMENT PLATFORM</strong></p>
                        <p>Hệ thống đặt lịch khám bệnh trực tuyến</p>
                        <div class="unsubscribe">
                            <p>Email này được gửi tự động. Vui lòng không trả lời trực tiếp.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """, name != null ? name : "bạn");
    }
}
