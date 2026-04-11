package com.doctorappointment.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class SendGridEmailService {
    
    @Value("${sendgrid.api-key:}")
    private String sendGridApiKey;
    
    @Value("${sendgrid.from-email:noreply@khamnow.com}")
    private String fromEmail;
    
    @Value("${sendgrid.from-name:KHAMNOW}")
    private String fromName;
    
    public void sendVerificationEmail(String toEmail, String name, String verificationCode) {
        if (sendGridApiKey == null || sendGridApiKey.trim().isEmpty()) {
            logEmailToConsole("VERIFICATION", toEmail, name, verificationCode);
            return;
        }
        
        try {
            Email from = new Email(fromEmail, fromName);
            Email to = new Email(toEmail);
            String subject = "Xác nhận đăng ký nhận tin từ KHAMNOW";
            Content content = new Content("text/html", buildVerificationEmailContent(name, verificationCode));
            
            Mail mail = new Mail(from, subject, to, content);
            
            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                System.out.println("✅ SendGrid verification email sent successfully to: " + toEmail);
            } else {
                System.err.println("❌ SendGrid failed with status " + response.getStatusCode() + ": " + response.getBody());
                
                // If 401 (Unauthorized) or 402 (Payment Required), disable SendGrid for this session
                if (response.getStatusCode() == 401 || response.getStatusCode() == 402) {
                    System.err.println("⚠️  SendGrid credits exceeded or unauthorized. Falling back to console logging.");
                    sendGridApiKey = ""; // Disable for this session
                }
                
                logEmailToConsole("VERIFICATION", toEmail, name, verificationCode);
            }
        } catch (IOException e) {
            // log.error("❌ Failed to send verification email via SendGrid to: {}", toEmail, e);
            System.err.println("❌ Failed to send verification email via SendGrid to: " + toEmail);
            e.printStackTrace();
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
            String subject = "Chào mừng bạn đến với KHAMNOW!";
            Content content = new Content("text/html", buildWelcomeEmailContent(name));
            
            Mail mail = new Mail(from, subject, to, content);
            
            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                System.out.println("✅ SendGrid welcome email sent successfully to: " + toEmail);
            } else {
                System.err.println("❌ SendGrid failed with status " + response.getStatusCode() + ": " + response.getBody());
                
                // If 401 (Unauthorized) or 402 (Payment Required), disable SendGrid for this session
                if (response.getStatusCode() == 401 || response.getStatusCode() == 402) {
                    System.err.println("⚠️  SendGrid credits exceeded or unauthorized. Falling back to console logging.");
                    sendGridApiKey = ""; // Disable for this session
                }
                
                logWelcomeEmailToConsole(toEmail, name);
            }
        } catch (IOException e) {
            // log.error("❌ Failed to send welcome email via SendGrid to: {}", toEmail, e);
            System.err.println("❌ Failed to send welcome email via SendGrid to: " + toEmail);
            e.printStackTrace();
            logWelcomeEmailToConsole(toEmail, name);
        }
    }
    
    private void logEmailToConsole(String type, String toEmail, String name, String verificationCode) {
        System.out.println("=================================================");
        System.out.println("📧 SENDING " + type + " EMAIL (Console Mode - SendGrid not configured)");
        System.out.println("=================================================");
        System.out.println("To: " + toEmail);
        System.out.println("Subject: Xác nhận đăng ký nhận tin từ KHAMNOW");
        System.out.println("");
        System.out.println("Xin chào " + (name != null ? name : "bạn") + ",");
        System.out.println("");
        System.out.println("Cảm ơn bạn đã đăng ký nhận tin từ KHAMNOW!");
        System.out.println("");
        System.out.println("🔑 Mã xác nhận của bạn là: " + verificationCode);
        System.out.println("");
        System.out.println("Vui lòng nhập mã này vào trang web để hoàn tất đăng ký.");
        System.out.println("Mã có hiệu lực trong 15 phút.");
        System.out.println("=================================================");
    }
    
    private void logWelcomeEmailToConsole(String toEmail, String name) {
        System.out.println("=================================================");
        System.out.println("📧 SENDING WELCOME EMAIL (Console Mode - SendGrid not configured)");
        System.out.println("=================================================");
        System.out.println("To: " + toEmail);
        System.out.println("Subject: Chào mừng bạn đến với KHAMNOW!");
        System.out.println("");
        System.out.println("Xin chào " + (name != null ? name : "bạn") + ",");
        System.out.println("");
        System.out.println("🎉 Chúc mừng! Bạn đã đăng ký nhận tin thành công.");
        System.out.println("=================================================");
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
                    .header { background: linear-gradient(135deg, #0066cc 0%%, #004d99 100%%); color: white; padding: 40px 30px; text-align: center; }
                    .header h1 { margin: 0 0 10px 0; font-size: 32px; font-weight: 700; letter-spacing: 1px; }
                    .content { padding: 40px 30px; }
                    .code-box { background: linear-gradient(135deg, #e6f2ff 0%%, #cce5ff 100%%); border: 3px dashed #0066cc; padding: 30px; text-align: center; margin: 30px 0; border-radius: 12px; }
                    .code { font-size: 42px; font-weight: 800; color: #0066cc; letter-spacing: 8px; font-family: 'Courier New', monospace; }
                    .footer { background: #f5f5f5; color: #666; padding: 30px; text-align: center; font-size: 13px; }
                    .unsubscribe { color: #999; font-size: 11px; margin-top: 15px; }
                    .unsubscribe a { color: #999; text-decoration: underline; }
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
                        <p>Cảm ơn bạn đã đăng ký nhận tin từ hệ thống của chúng tôi.</p>
                        <p>Để hoàn tất đăng ký, vui lòng sử dụng mã xác nhận sau:</p>
                        <div class="code-box">
                            <div class="code">%s</div>
                        </div>
                        <p style="color: #d46b08;">⏰ Mã xác nhận có hiệu lực trong <strong>15 phút</strong>.</p>
                        <p>Nếu bạn không yêu cầu đăng ký này, vui lòng bỏ qua email này.</p>
                    </div>
                    <div class="footer">
                        <p><strong>© 2026 KHAMNOW</strong> - Nền tảng đặt khám trực tuyến</p>
                        <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                        <div class="unsubscribe">
                            <p>Nếu bạn không đăng ký nhận tin, vui lòng bỏ qua email này.</p>
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
                    .header { background: linear-gradient(135deg, #0066cc 0%%, #004d99 100%%); color: white; padding: 40px 30px; text-align: center; }
                    .header h1 { margin: 0 0 10px 0; font-size: 32px; font-weight: 700; letter-spacing: 1px; }
                    .content { padding: 40px 30px; }
                    .success-box { background: linear-gradient(135deg, #e6f2ff 0%%, #cce5ff 100%%); border: 3px solid #0066cc; padding: 30px; text-align: center; margin: 30px 0; border-radius: 12px; }
                    .footer { background: #f5f5f5; color: #666; padding: 30px; text-align: center; font-size: 13px; }
                    .unsubscribe { color: #999; font-size: 11px; margin-top: 15px; }
                    .unsubscribe a { color: #999; text-decoration: underline; }
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
                        <p>Cảm ơn bạn đã xác nhận đăng ký nhận tin từ hệ thống của chúng tôi.</p>
                        <p>Bạn sẽ nhận được các thông báo và tin tức mới nhất qua email này.</p>
                    </div>
                    <div class="footer">
                        <p><strong>© 2026 KHAMNOW</strong> - Nền tảng đặt khám trực tuyến</p>
                        <p>Hotline: <strong>1900 56 56 56</strong></p>
                        <div class="unsubscribe">
                            <p>Nếu bạn muốn hủy đăng ký, vui lòng liên hệ với chúng tôi.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """, name != null ? name : "bạn");
    }
}
