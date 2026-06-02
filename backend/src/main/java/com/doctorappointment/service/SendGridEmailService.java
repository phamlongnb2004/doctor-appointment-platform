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
    
    public void sendAccountCreationEmail(String toEmail, String name, String password, 
                                          String specialty, String doctorName, String appointmentTime) {
        if (sendGridApiKey == null || sendGridApiKey.trim().isEmpty()) {
            logAccountCreationEmailToConsole(toEmail, name, password, specialty, doctorName, appointmentTime);
            return;
        }
        
        try {
            Email from = new Email(fromEmail, fromName);
            Email to = new Email(toEmail);
            String subject = "Tài khoản KHAMNOW của bạn đã được tạo - Thông tin lịch hẹn";
            Content content = new Content("text/html", 
                buildAccountCreationEmailContent(name, password, specialty, doctorName, appointmentTime));
            
            Mail mail = new Mail(from, subject, to, content);
            
            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                System.out.println("✅ SendGrid account creation email sent successfully to: " + toEmail);
            } else {
                System.err.println("❌ SendGrid failed with status " + response.getStatusCode() + ": " + response.getBody());
                
                if (response.getStatusCode() == 401 || response.getStatusCode() == 402) {
                    System.err.println("⚠️  SendGrid credits exceeded or unauthorized. Falling back to console logging.");
                    sendGridApiKey = "";
                }
                
                logAccountCreationEmailToConsole(toEmail, name, password, specialty, doctorName, appointmentTime);
            }
        } catch (IOException e) {
            System.err.println("❌ Failed to send account creation email via SendGrid to: " + toEmail);
            e.printStackTrace();
            logAccountCreationEmailToConsole(toEmail, name, password, specialty, doctorName, appointmentTime);
        }
    }
    
    private void logAccountCreationEmailToConsole(String toEmail, String name, String password,
                                                   String specialty, String doctorName, String appointmentTime) {
        System.out.println("=".repeat(70));
        System.out.println("📧 SENDING ACCOUNT CREATION EMAIL (Console Mode)");
        System.out.println("=".repeat(70));
        System.out.println("To: " + toEmail);
        System.out.println("Subject: Tài khoản KHAMNOW của bạn đã được tạo");
        System.out.println("");
        System.out.println("Xin chào " + (name != null ? name : "bạn") + ",");
        System.out.println("");
        System.out.println("🎉 Tài khoản của bạn đã được tạo thành công!");
        System.out.println("");
        System.out.println("📧 Email: " + toEmail);
        System.out.println("🔑 Mật khẩu: " + password);
        System.out.println("");
        System.out.println("📅 THÔNG TIN LỊCH HẸN:");
        System.out.println("   - Chuyên khoa: " + (specialty != null ? specialty : "N/A"));
        System.out.println("   - Bác sĩ: " + (doctorName != null ? doctorName : "N/A"));
        System.out.println("   - Thời gian: " + (appointmentTime != null ? appointmentTime : "N/A"));
        System.out.println("");
        System.out.println("⚠️  VUI LÒNG ĐỔI MẬT KHẨU SAU KHI ĐĂNG NHẬP LẦN ĐẦU!");
        System.out.println("=".repeat(70));
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
    
    public void sendPasswordResetEmail(String toEmail, String name, String resetToken) {
        if (sendGridApiKey == null || sendGridApiKey.trim().isEmpty()) {
            logPasswordResetEmailToConsole(toEmail, name, resetToken);
            return;
        }
        
        try {
            Email from = new Email(fromEmail, fromName);
            Email to = new Email(toEmail);
            String subject = "Yêu cầu đặt lại mật khẩu - KHAMNOW";
            Content content = new Content("text/html", buildPasswordResetEmailContent(name, resetToken));
            
            Mail mail = new Mail(from, subject, to, content);
            
            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                System.out.println("✅ SendGrid password reset email sent successfully to: " + toEmail);
            } else {
                System.err.println("❌ SendGrid failed with status " + response.getStatusCode() + ": " + response.getBody());
                
                if (response.getStatusCode() == 401 || response.getStatusCode() == 402) {
                    System.err.println("⚠️  SendGrid credits exceeded or unauthorized. Falling back to console logging.");
                    sendGridApiKey = "";
                }
                
                logPasswordResetEmailToConsole(toEmail, name, resetToken);
            }
        } catch (IOException e) {
            System.err.println("❌ Failed to send password reset email via SendGrid to: " + toEmail);
            e.printStackTrace();
            logPasswordResetEmailToConsole(toEmail, name, resetToken);
        }
    }
    
    private void logPasswordResetEmailToConsole(String toEmail, String name, String resetToken) {
        System.out.println("=".repeat(70));
        System.out.println("📧 SENDING PASSWORD RESET EMAIL (Console Mode)");
        System.out.println("=".repeat(70));
        System.out.println("To: " + toEmail);
        System.out.println("Subject: Yêu cầu đặt lại mật khẩu - KHAMNOW");
        System.out.println("");
        System.out.println("Xin chào " + (name != null ? name : "bạn") + ",");
        System.out.println("");
        System.out.println("🔑 Mã đặt lại mật khẩu của bạn là: " + resetToken);
        System.out.println("");
        System.out.println("Vui lòng nhập mã này vào trang web để đặt lại mật khẩu.");
        System.out.println("Mã có hiệu lực trong 15 phút.");
        System.out.println("=".repeat(70));
    }
    
    private String buildPasswordResetEmailContent(String name, String resetToken) {
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
                    .code-box { background: linear-gradient(135deg, #fff3cd 0%%, #ffe69c 100%%); border: 3px dashed #ffc107; padding: 30px; text-align: center; margin: 30px 0; border-radius: 12px; }
                    .code { font-size: 42px; font-weight: 800; color: #d46b08; letter-spacing: 8px; font-family: 'Courier New', monospace; }
                    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 8px; color: #856404; }
                    .footer { background: #f5f5f5; color: #666; padding: 30px; text-align: center; font-size: 13px; }
                    .btn { display: inline-block; background: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔒 KHAMNOW</h1>
                        <p>Đặt lại mật khẩu</p>
                    </div>
                    <div class="content">
                        <p>Xin chào <strong>%s</strong>,</p>
                        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                        <p>Để đặt lại mật khẩu, vui lòng sử dụng mã xác nhận sau:</p>
                        <div class="code-box">
                            <div class="code">%s</div>
                        </div>
                        <div class="warning">
                            <strong>⏰ LƯU Ý QUAN TRỌNG:</strong><br>
                            • Mã xác nhận có hiệu lực trong <strong>15 phút</strong>.<br>
                            • Mã chỉ có thể sử dụng <strong>1 lần</strong>.<br>
                            • Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                        </div>
                        <p>Nếu bạn gặp vấn đề, vui lòng liên hệ với chúng tôi qua:</p>
                        <ul>
                            <li>Email: support@khamnow.com</li>
                            <li>Hotline: 1900 56 56 56</li>
                        </ul>
                    </div>
                    <div class="footer">
                        <p><strong>© 2026 KHAMNOW</strong> - Nền tảng đặt khám trực tuyến</p>
                        <p style="margin-top: 15px; font-size: 11px; color: #999;">
                            Email này được gửi tự động, vui lòng không trả lời.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """, name != null ? name : "bạn", resetToken);
    }
    
    private String buildAccountCreationEmailContent(String name, String password, 
                                                     String specialty, String doctorName, String appointmentTime) {
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
                    .info-box { background: #f8f9fa; border-left: 4px solid #0066cc; padding: 20px; margin: 20px 0; border-radius: 8px; }
                    .password-box { background: linear-gradient(135deg, #fff3cd 0%%, #ffe69c 100%%); border: 3px solid #ffc107; padding: 25px; text-align: center; margin: 25px 0; border-radius: 12px; }
                    .password { font-size: 28px; font-weight: 800; color: #d46b08; letter-spacing: 3px; font-family: 'Courier New', monospace; }
                    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 8px; color: #856404; }
                    .appointment-box { background: linear-gradient(135deg, #e6f2ff 0%%, #cce5ff 100%%); border: 2px solid #0066cc; padding: 20px; margin: 20px 0; border-radius: 12px; }
                    .footer { background: #f5f5f5; color: #666; padding: 30px; text-align: center; font-size: 13px; }
                    .btn { display: inline-block; background: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>KHAMNOW</h1>
                        <p>🎉 Tài khoản của bạn đã được tạo!</p>
                    </div>
                    <div class="content">
                        <p>Xin chào <strong>%s</strong>,</p>
                        <p>Chúng tôi đã tạo tài khoản cho bạn để quản lý lịch hẹn khám bệnh.</p>
                        
                        <div class="info-box">
                            <h3 style="margin-top: 0; color: #0066cc;">📧 Thông tin đăng nhập:</h3>
                            <p style="margin: 5px 0;"><strong>Email:</strong> Địa chỉ email này</p>
                        </div>
                        
                        <div class="password-box">
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #856404;">🔑 Mật khẩu của bạn:</p>
                            <div class="password">%s</div>
                        </div>
                        
                        <div class="warning">
                            <strong>⚠️ LƯU Ý QUAN TRỌNG:</strong><br>
                            Vui lòng đổi mật khẩu ngay sau khi đăng nhập lần đầu tại trang <strong>Hồ sơ cá nhân</strong>.
                        </div>
                        
                        <div class="appointment-box">
                            <h3 style="margin-top: 0; color: #0066cc;">📅 Thông tin lịch hẹn:</h3>
                            <p style="margin: 8px 0;"><strong>Chuyên khoa:</strong> %s</p>
                            <p style="margin: 8px 0;"><strong>Bác sĩ:</strong> %s</p>
                            <p style="margin: 8px 0;"><strong>Thời gian:</strong> %s</p>
                        </div>
                        
                        <p>Bạn có thể đăng nhập vào hệ thống để:</p>
                        <ul>
                            <li>Xem chi tiết lịch hẹn</li>
                            <li>Quản lý hồ sơ bệnh án</li>
                            <li>Đặt lịch khám mới</li>
                            <li>Đổi mật khẩu</li>
                        </ul>
                        
                        <div style="text-align: center;">
                            <a href="https://khamnow.com/login" class="btn">Đăng nhập ngay</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p><strong>© 2026 KHAMNOW</strong> - Nền tảng đặt khám trực tuyến</p>
                        <p>Hotline: <strong>1900 56 56 56</strong></p>
                        <p style="margin-top: 15px; font-size: 11px; color: #999;">
                            Email này được gửi tự động, vui lòng không trả lời.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """, 
            name != null ? name : "bạn",
            password,
            specialty != null ? specialty : "Chưa xác định",
            doctorName != null ? doctorName : "Chưa xác định",
            appointmentTime != null ? appointmentTime : "Chưa xác định"
        );
    }
}
