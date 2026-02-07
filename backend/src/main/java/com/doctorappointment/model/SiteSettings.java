package com.doctorappointment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "site_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiteSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "site_name", nullable = false)
    private String siteName;

    @Column(name = "site_tagline")
    private String siteTagline;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "hotline", nullable = false)
    private String hotline;

    @Column(name = "email")
    private String email;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "statistics_background_image", length = 500)
    private String statisticsBackgroundImage;

    @Column(name = "facebook_url")
    private String facebookUrl;

    @Column(name = "youtube_url")
    private String youtubeUrl;

    @Column(name = "zalo_url")
    private String zaloUrl;
    
    // Footer Information
    @Column(name = "footer_about_text", columnDefinition = "TEXT")
    private String footerAboutText;
    
    @Column(name = "footer_working_hours", columnDefinition = "TEXT")
    private String footerWorkingHours;
    
    @Column(name = "footer_facebook_url", length = 255)
    private String footerFacebookUrl;
    
    @Column(name = "footer_youtube_url", length = 255)
    private String footerYoutubeUrl;
    
    @Column(name = "footer_zalo_url", length = 255)
    private String footerZaloUrl;
    
    @Column(name = "footer_copyright_text", length = 255)
    private String footerCopyrightText;
    
    // Bank Account Information for QR Payment
    @Column(name = "bank_id", length = 50)
    private String bankId; // Mã ngân hàng (VD: MB, VCB, TCB)
    
    @Column(name = "bank_name", length = 255)
    private String bankName; // Tên ngân hàng đầy đủ
    
    @Column(name = "bank_account_no", length = 50)
    private String bankAccountNo; // Số tài khoản
    
    @Column(name = "bank_account_name", length = 255)
    private String bankAccountName; // Tên chủ tài khoản
}
