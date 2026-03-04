import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import cmsAPI from '../services/cmsApi';

function Footer() {
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'KHAMNOW',
    hotline: '19005656',
    email: '',
    address: '',
    footerAboutText: '',
    footerWorkingHours: 'Thứ 2 - Thứ 6: 7:00 - 20:00\nThứ 7 - Chủ nhật: 7:00 - 17:00',
    footerFacebookUrl: '',
    footerYoutubeUrl: '',
    footerZaloUrl: '',
    footerCopyrightText: 'Copyright © 2024 KHAMNOW. All rights reserved.'
  });

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const response = await cmsAPI.getSiteSettings();
      setSiteSettings(response.data);
    } catch (error) {
      console.error('Error fetching site settings:', error);
    }
  };

  return (
    <footer style={{
      background: '#001529',
      color: '#fff',
      padding: '40px 24px 20px',
      marginTop: 60
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 40,
          marginBottom: 30
        }}>
          {/* Thông tin liên hệ */}
          <div>
            <h3 style={{ color: '#fff', fontSize: 18, marginBottom: 20 }}>
              {siteSettings.siteName}
            </h3>
            {siteSettings.footerAboutText && (
              <p style={{ color: '#fff', marginBottom: 16, lineHeight: 1.6 }}>
                {siteSettings.footerAboutText}
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {siteSettings.hotline && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PhoneOutlined style={{ color: '#1890ff' }} />
                  <a href={`tel:${siteSettings.hotline}`} style={{ color: '#60a5fa', textDecoration: 'none' }}>
                    {siteSettings.hotline}
                  </a>
                </div>
              )}
              {siteSettings.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MailOutlined style={{ color: '#1890ff' }} />
                  <a href={`mailto:${siteSettings.email}`} style={{ color: '#60a5fa', textDecoration: 'none' }}>
                    {siteSettings.email}
                  </a>
                </div>
              )}
              {siteSettings.address && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <EnvironmentOutlined style={{ color: '#1890ff', marginTop: 4 }} />
                  <span style={{ color: '#fff' }}>{siteSettings.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 style={{ color: '#fff', fontSize: 18, marginBottom: 20 }}>
              Liên kết nhanh
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none' }}>Trang chủ</Link>
              <Link to="/doctors" style={{ color: '#60a5fa', textDecoration: 'none' }}>Đặt lịch khám</Link>
              <Link to="/about" style={{ color: '#60a5fa', textDecoration: 'none' }}>Giới thiệu</Link>
              <Link to="/news" style={{ color: '#60a5fa', textDecoration: 'none' }}>Tin tức</Link>
            </div>
          </div>

          {/* Dịch vụ */}
          <div>
            <h3 style={{ color: '#fff', fontSize: 18, marginBottom: 20 }}>
              Dịch vụ y tế
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ color: '#fff' }}>Khám tổng quát</span>
              <span style={{ color: '#fff' }}>Xét nghiệm</span>
              <span style={{ color: '#fff' }}>Chẩn đoán hình ảnh</span>
              <span style={{ color: '#fff' }}>Tư vấn trực tuyến</span>
            </div>
          </div>

          {/* Giờ làm việc */}
          <div>
            <h3 style={{ color: '#fff', fontSize: 18, marginBottom: 20 }}>
              Giờ làm việc
            </h3>
            {siteSettings.footerWorkingHours ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {siteSettings.footerWorkingHours.split('\n').map((line, index) => (
                  <div key={index} style={{ color: '#fff' }}>
                    {line}
                  </div>
                ))}
                <div style={{ color: '#60a5fa', marginTop: 10 }}>
                  <strong>Hotline 24/7: {siteSettings.hotline}</strong>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ color: '#fff' }}>
                  <strong>Thứ 2 - Thứ 6:</strong> 7:00 - 20:00
                </div>
                <div style={{ color: '#fff' }}>
                  <strong>Thứ 7 - Chủ nhật:</strong> 7:00 - 17:00
                </div>
                <div style={{ color: '#60a5fa', marginTop: 10 }}>
                  <strong>Hotline 24/7: {siteSettings.hotline}</strong>
                </div>
              </div>
            )}
            
            {/* Social Media Links */}
            {(siteSettings.footerFacebookUrl || siteSettings.footerYoutubeUrl || siteSettings.footerZaloUrl) && (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>Theo dõi chúng tôi</h4>
                <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                  {siteSettings.footerFacebookUrl && (
                    <a 
                      href={siteSettings.footerFacebookUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                        color: '#60a5fa',
                        fontSize: 24,
                        transition: 'color 0.3s'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
                      onMouseLeave={(e) => e.target.style.color = '#60a5fa'}
                    >
                      <i className="fab fa-facebook"></i>
                    </a>
                  )}
                  {siteSettings.footerYoutubeUrl && (
                    <a 
                      href={siteSettings.footerYoutubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                        color: '#60a5fa',
                        fontSize: 24,
                        transition: 'color 0.3s'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                      onMouseLeave={(e) => e.target.style.color = '#60a5fa'}
                    >
                      <i className="fab fa-youtube"></i>
                    </a>
                  )}
                  {siteSettings.footerZaloUrl && (
                    <a 
                      href={siteSettings.footerZaloUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                        color: '#60a5fa',
                        fontSize: 24,
                        transition: 'color 0.3s'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#0068ff'}
                      onMouseLeave={(e) => e.target.style.color = '#60a5fa'}
                    >
                      <i className="fab fa-facebook-messenger"></i>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div style={{ 
          borderTop: '1px solid #ffffff20',
          paddingTop: 20,
          textAlign: 'center',
          color: '#ffffff80',
          fontSize: 14
        }}>
          {siteSettings.footerCopyrightText || `© ${new Date().getFullYear()} ${siteSettings.siteName}. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
