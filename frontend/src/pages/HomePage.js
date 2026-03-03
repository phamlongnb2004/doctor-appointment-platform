import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Row, Col, Typography, Avatar, Input, Form, Select, Modal, message } from 'antd';
import { CheckOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import cmsAPI from '../services/cmsApi';
import axios from 'axios';
import BannerSlider from '../components/BannerSlider';
import CertificationSlider from '../components/CertificationSlider';
import NewsSection from '../components/NewsSection';
import '../styles/animations.css';
import '../styles/homepage.css';

const { Title, Paragraph, Text } = Typography;

// Get API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function HomePage() {
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Animation refs
  const sectionsRef = useRef([]);
  
  // CMS Data States
  const [services, setServices] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [newsSections, setNewsSections] = useState([]);
  const [newsSectionsData, setNewsSectionsData] = useState({});
  const [testimonials, setTestimonials] = useState([]);
  const [features, setFeatures] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [banners, setBanners] = useState([]);
  const [membershipBenefits, setMembershipBenefits] = useState([]);
  
  // Newsletter states
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterName, setNewsletterName] = useState('');
  const [newsletterPhone, setNewsletterPhone] = useState('');
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  // Separate effect for animations - runs after data is loaded
  useEffect(() => {
    if (loading) return; // Don't run animations while loading
    
    // Reset all sections animation state
    sectionsRef.current.forEach(section => {
      if (section) {
        section.classList.remove('animate-in');
      }
    });
    
    // Scroll animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      sectionsRef.current.forEach(section => {
        if (section) {
          // Check if section is already in viewport
          const rect = section.getBoundingClientRect();
          const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
          
          if (isInViewport) {
            // Already visible, show immediately
            section.classList.add('animate-in');
          } else {
            // Not visible yet, observe for animation
            observer.observe(section);
          }
        }
      });
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [loading]); // Run when loading changes

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [
        doctorsResponse,
        servicesResponse,
        newsResponse,
        newsSectionsResponse,
        testimonialsResponse,
        featuresResponse,
        specialtiesResponse,
        statisticsDataResponse,
        certificationsResponse,
        bannersResponse,
        membershipBenefitsResponse,
        siteSettingsResponse
      ] = await Promise.all([
        doctorAPI.getActiveDoctors(),
        cmsAPI.getServices().catch(() => ({ data: [] })),
        cmsAPI.getLatestNews(4).catch(() => ({ data: [] })),
        cmsAPI.getActiveNewsSectionsByPage('home').catch(() => ({ data: [] })),
        cmsAPI.getFeaturedTestimonials(3).catch(() => ({ data: [] })),
        cmsAPI.getFeatures().catch(() => ({ data: [] })),
        cmsAPI.getSpecialties().catch(() => ({ data: [] })),
        cmsAPI.getStatistics().catch(() => ({ data: [] })),
        cmsAPI.getCertifications().catch(() => ({ data: [] })),
        cmsAPI.getBannersByPage('home').catch(() => ({ data: [] })),
        cmsAPI.getMembershipBenefits().catch(() => ({ data: [] })),
        cmsAPI.getSiteSettings().catch(() => ({ data: null }))
      ]);

      // Set doctors data
      const doctors = doctorsResponse.data || [];
      const sorted = doctors.sort((a, b) => (b.ratingScore || 0) - (a.ratingScore || 0)).slice(0, 3);
      setTopDoctors(sorted);

      // Set CMS data
      setServices(servicesResponse.data || []);
      setNewsArticles(newsResponse.data || []);
      setTestimonials(testimonialsResponse.data || []);
      setFeatures(featuresResponse.data || []);
      setSpecialties(specialtiesResponse.data || []);
      setStatistics(statisticsDataResponse.data || []);
      setCertifications(certificationsResponse.data || []);
      setBanners(bannersResponse.data || []);
      setMembershipBenefits(membershipBenefitsResponse.data || []);
      setSiteSettings(siteSettingsResponse.data || null);
      
      // Set news sections
      const sections = newsSectionsResponse.data || [];
      setNewsSections(sections);
      
      // Fetch articles for each section
      if (sections.length > 0) {
        const sectionsDataPromises = sections.map(async (section) => {
          try {
            const articlesResponse = await cmsAPI.getNewsBySectionName(
              section.name, 
              section.articlesLimit || 4
            );
            return {
              sectionName: section.name,
              articles: articlesResponse.data || []
            };
          } catch (error) {
            console.error(`Error fetching articles for section ${section.name}:`, error);
            return {
              sectionName: section.name,
              articles: []
            };
          }
        });
        
        const sectionsDataArray = await Promise.all(sectionsDataPromises);
        const sectionsDataMap = {};
        sectionsDataArray.forEach(item => {
          sectionsDataMap[item.sectionName] = item.articles;
        });
        setNewsSectionsData(sectionsDataMap);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Newsletter handlers
  const handleNewsletterSubscribe = async () => {
    if (!newsletterEmail || !newsletterEmail.trim()) {
      message.error('Vui lòng nhập email!');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      message.error('Email không hợp lệ!');
      return;
    }
    
    setSubscribing(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/newsletter/subscribe`, {
        email: newsletterEmail,
        name: newsletterName,
        phone: newsletterPhone
      });
      
      message.success(response.data.message || 'Mã xác nhận đã được gửi đến email của bạn!');
      setVerificationModalVisible(true);
    } catch (error) {
      message.error(error.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setSubscribing(false);
    }
  };
  
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.trim().length !== 6) {
      message.error('Vui lòng nhập mã xác nhận 6 số!');
      return;
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/newsletter/verify`, {
        email: newsletterEmail,
        code: verificationCode
      });
      
      message.success(response.data.message || 'Đăng ký thành công!');
      setVerificationModalVisible(false);
      setNewsletterEmail('');
      setNewsletterName('');
      setNewsletterPhone('');
      setVerificationCode('');
    } catch (error) {
      message.error(error.response?.data?.error || 'Mã xác nhận không đúng!');
    }
  };

  return (
    <div className="homepage-container">
      {/* Show minimal loading only on first load */}
      {loading && (
        <div className="homepage__loading">
          <div className="homepage__loading-content">
            <div className="homepage__loading-spinner" />
          </div>
        </div>
      )}

      {/* Show content immediately after loading */}
      {!loading && (
        <>
          {/* Banner Slider - Full Width */}
          {banners.length > 0 && (
            <BannerSlider banners={banners} />
          )}

      {/* Quick Utilities Section - TIỆN ÍCH CHO KHÁCH HÀNG */}
      {services.length > 0 && (
      <div 
        ref={el => sectionsRef.current[0] = el}
        className="animate-section"
        style={{ 
          background: '#f8f9fa',
          padding: '80px 24px'
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Title level={2} style={{ color: '#262626', marginBottom: 16, fontSize: 32 }}>
              TIỆN ÍCH CHO KHÁCH HÀNG
            </Title>
          </div>
          
          <Row gutter={[24, 24]}>
            {/* Đặt lịch nhanh - Left side (separate card) */}
            <Col xs={24} lg={8}>
              <Card
                style={{
                  height: '100%',
                  borderRadius: 16,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  background: '#e6f7ff'
                }}
                bodyStyle={{ padding: '32px 24px' }}
              >
                <Title level={4} style={{ color: '#13c2c2', marginBottom: 16, fontSize: 20 }}>
                  Đặt lịch nhanh
                </Title>
                <Paragraph style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
                  Quý khách hàng vui lòng điền đầy đủ thông tin vào bảng dưới đây để đặt lịch nhanh.
                </Paragraph>
                
                <Form layout="vertical">
                  {/* Row 1: Họ và tên + Số điện thoại */}
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item 
                        label={<span style={{ fontWeight: 600 }}>Họ và tên *</span>}
                        style={{ marginBottom: 16 }}
                      >
                        <Input placeholder="Nhập họ và tên" size="large" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item 
                        label={<span style={{ fontWeight: 600 }}>Số điện thoại *</span>}
                        style={{ marginBottom: 16 }}
                      >
                        <Input placeholder="Nhập số điện thoại" size="large" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  {/* Row 2: Dịch vụ */}
                  <Form.Item 
                    label={<span style={{ fontWeight: 600 }}>Dịch vụ *</span>}
                    style={{ marginBottom: 16 }}
                  >
                    <Select placeholder="Chọn dịch vụ" size="large">
                      <Select.Option value="kham-tong-quat">Khám tổng quát</Select.Option>
                      <Select.Option value="xet-nghiem">Xét nghiệm</Select.Option>
                      <Select.Option value="chan-doan-hinh-anh">Chẩn đoán hình ảnh</Select.Option>
                    </Select>
                  </Form.Item>
                  
                  {/* Row 3: Nội dung yêu cầu */}
                  <Form.Item 
                    label={<span style={{ fontWeight: 600 }}>Nội dung yêu cầu</span>}
                    style={{ marginBottom: 20 }}
                  >
                    <Input.TextArea 
                      rows={3} 
                      placeholder="Tôi cảm thấy..." 
                      style={{ resize: 'none' }}
                    />
                  </Form.Item>
                  
                  {/* Submit Button */}
                  <Button 
                    size="large" 
                    block
                    style={{ 
                      background: '#13c2c2',
                      borderColor: '#13c2c2',
                      color: '#fff',
                      borderRadius: 8,
                      height: 48,
                      fontSize: 16,
                      fontWeight: 600,
                      marginBottom: 16
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#36cfc9';
                      e.currentTarget.style.borderColor = '#36cfc9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#13c2c2';
                      e.currentTarget.style.borderColor = '#13c2c2';
                    }}
                  >
                    Đăng ký ngay
                  </Button>
                  
                  {/* Footer Link */}
                  <div style={{ textAlign: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#666' }}>
                      Cần tư vấn trực tiếp?{' '}
                      <a href="/doctors" style={{ color: '#13c2c2', fontWeight: 600 }}>
                        Quy chế hoạt động
                      </a>
                    </Text>
                  </div>
                </Form>
              </Card>
            </Col>
            
            {/* Service cards - Right side (4 cards in 2x2 grid) */}
            <Col xs={24} lg={16}>
              <Row gutter={[24, 24]}>
                {services.map((service, index) => (
                  <Col xs={24} sm={12} key={service.id || index}>
                    <Card 
                      hoverable
                      style={{ 
                        height: '100%',
                        minHeight: 280,
                        borderRadius: 16,
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease',
                        background: '#fff'
                      }}
                      bodyStyle={{ 
                        padding: '32px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                      }}
                    >
                      {/* Icon */}
                      {service.imageUrl && (
                        <div style={{ 
                          width: 48, 
                          height: 48,
                          marginBottom: 16,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start'
                        }}>
                          <img 
                            src={service.imageUrl} 
                            alt={service.title}
                            style={{ 
                              maxWidth: 48, 
                              maxHeight: 48, 
                              objectFit: 'contain'
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Title */}
                      <Title level={4} style={{ 
                        marginTop: 0,
                        marginBottom: 12, 
                        color: service.color || '#13c2c2', 
                        fontSize: 18,
                        fontWeight: 600,
                        lineHeight: 1.4
                      }}>
                        {service.title}
                      </Title>
                      
                      {/* Description */}
                      <Paragraph style={{ 
                        color: '#8c8c8c', 
                        fontSize: 14, 
                        lineHeight: 1.7, 
                        marginBottom: 0,
                        flex: 1
                      }}>
                        {service.description}
                      </Paragraph>
                      
                      {/* Button at bottom right */}
                      {service.buttonText && (
                        <div style={{ 
                          marginTop: 20,
                          display: 'flex',
                          justifyContent: 'flex-end'
                        }}>
                          <Button 
                            type="link"
                            style={{ 
                              color: service.color || '#13c2c2',
                              padding: 0,
                              fontWeight: 600,
                              fontSize: 15,
                              height: 'auto'
                            }}
                            onClick={() => navigate(service.buttonUrl || '/doctors')}
                          >
                            {service.buttonText} →
                          </Button>
                        </div>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      )}

      {/* Why Choose Us Section */}
      {features.length > 0 && (
      <div 
        ref={el => sectionsRef.current[1] = el}
        className="animate-section"
        style={{ 
        background: '#fff',
        padding: '80px 24px 60px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Title level={2} style={{ color: '#262626', marginBottom: 16, fontSize: 32 }}>
              TẠI SAO CHỌN <span style={{ color: '#13c2c2' }}>KHAMNOW</span>?
            </Title>
            <Paragraph style={{ color: '#666', fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
              Chúng tôi cam kết mang đến dịch vụ y tế chất lượng cao với sự chăm sóc tận tâm
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            {features.map((feature) => (
              <Col xs={24} sm={12} lg={6} key={feature.id}>
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    border: '2px solid #e8e8e8'
                  }}>
                    <img src={feature.icon} alt={feature.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <Title level={4} style={{ marginBottom: 12, color: '#262626' }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6 }}>
                    {feature.description}
                  </Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      )}

      {/* News Section - TIN TỨC Y KHOA */}
      {/* Dynamic News Sections */}
      {newsSections.map((section) => {
        const articles = newsSectionsData[section.name] || [];
        if (articles.length === 0) return null;
        
        return (
          <NewsSection 
            key={section.id}
            title={section.title}
            articles={articles}
            showMoreButton={section.showMoreButton}
            moreButtonText={section.moreButtonText}
            moreButtonUrl={`/news?section=${section.name}`}
            backgroundColor={section.backgroundColor}
            titleAlign={section.titleAlign}
            layoutType={section.layoutType || 'default'}
            isHomePage={true}
            columns={{ xs: 24, sm: 12, lg: 6 }}
          />
        );
      })}

      {/* Doctors Section - ĐỘI NGŨ CHUYÊN GIA Y TẾ */}
      {topDoctors.length > 0 && (
      <div 
        ref={el => sectionsRef.current[2] = el}
        className="animate-section"
        style={{ 
        background: '#f8f9fa',
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Title level={2} style={{ color: '#262626', marginBottom: 16, fontSize: 32 }}>
              ĐỘI NGŨ CHUYÊN GIA Y TẾ
            </Title>
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            gap: 0
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, width: '100%' }}>
                <div style={{ color: '#666' }}>Đang tải thông tin bác sĩ...</div>
              </div>
            ) : (
              topDoctors.map((doctor, index) => (
                <div 
                  key={doctor.id || index}
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                    lineHeight: '24px',
                    color: '#132432',
                    width: '25%',
                    minWidth: 280,
                    padding: '20px 30px 0',
                    marginBottom: 60,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onClick={() => navigate(`/doctors/${doctor.id}`)}
                >
                  <div style={{ marginBottom: 20 }}>
                    <div style={{
                      position: 'relative',
                      width: 180,
                      height: 180,
                      margin: '0 auto',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '4px solid #13c2c2',
                      background: '#f0f9ff'
                    }}>
                      {doctor.user?.profileImage ? (
                        <img
                          src={doctor.user.profileImage}
                          alt={`${doctor.user?.firstName} ${doctor.user?.lastName}`}
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'top center',
                            zIndex: 1
                          }}
                        />
                      ) : (
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)',
                          color: '#fff',
                          fontSize: 48,
                          fontWeight: 600,
                          zIndex: 1
                        }}>
                          {doctor.user?.firstName?.charAt(0)}{doctor.user?.lastName?.charAt(0)}
                        </div>
                      )}
                      <span style={{
                        position: 'absolute',
                        bottom: -2,
                        right: -2,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: '#52c41a',
                        border: '2px solid #fff',
                        zIndex: 2
                      }} />
                    </div>
                  </div>
                  
                  <div>
                    <Title level={4} style={{ 
                      marginBottom: 8, 
                      color: '#132432',
                      fontSize: 16,
                      fontWeight: 600,
                      lineHeight: '24px'
                    }}>
                      <a 
                        href={`/doctors/${doctor.id}`}
                        style={{ 
                          color: '#132432', 
                          textDecoration: 'none',
                          transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#13c2c2';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#132432';
                        }}
                      >
                        {doctor.user?.firstName} {doctor.user?.lastName}
                      </a>
                    </Title>
                    
                    <div style={{ 
                      color: '#666', 
                      fontSize: 14,
                      marginBottom: 12,
                      fontWeight: 400
                    }}>
                      Chuyên khoa - {doctor.specialization}
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <img 
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCA4MCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMTJMMTIgOEw4IDRWNkgwVjEwSDhWMTJaIiBmaWxsPSIjRkZENzAwIi8+CjxwYXRoIGQ9Ik0yNCA4TDI4IDRWNkgyMFYxMEgyOFYxMkwyNCA4WiIgZmlsbD0iI0ZGRDcwMCIvPgo8cGF0aCBkPSJNNDAgOEw0NCA0VjZIMzZWMTBINDRWMTJMNDAgOFoiIGZpbGw9IiNGRkQ3MDAiLz4KPHA+CjwvcGF0aD4KPC9zdmc+"
                        alt="Rating"
                        style={{ height: 16 }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ 
                        color: '#666', 
                        fontSize: 13,
                        lineHeight: '20px'
                      }}>
                        {doctor.experienceYears || 0} năm kinh nghiệm
                      </div>
                    </div>
                    
                    <div>
                      <a 
                        href={`/doctors/${doctor.id}?datlich=1`}
                        style={{
                          display: 'inline-block',
                          background: '#13c2c2',
                          color: '#fff',
                          padding: '8px 20px',
                          borderRadius: 6,
                          textDecoration: 'none',
                          fontSize: 14,
                          fontWeight: 600,
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#36cfc9';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#13c2c2';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        Đặt lịch
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Show more doctors button */}
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button 
              size="large"
              style={{ 
                borderRadius: 8,
                border: '2px solid #13c2c2',
                color: '#13c2c2',
                fontWeight: 600,
                padding: '0 32px',
                height: 48
              }}
              onClick={() => navigate('/doctors')}
            >
              Xem tất cả bác sĩ
            </Button>
          </div>
        </div>
      </div>
      )}

      {/* Specialties Section - CÁC CHUYÊN KHOA Y TẾ TẠI KHAMNOW */}
      {specialties.length > 0 && (
      <div 
        ref={el => sectionsRef.current[3] = el}
        className="animate-section"
        style={{ 
        background: '#fff',
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Title level={2} style={{ color: '#262626', marginBottom: 16, fontSize: 32 }}>
              Các chuyên khoa y tế tại <span style={{ color: '#13c2c2' }}>KHAMNOW</span>
            </Title>
          </div>
          
          <div 
            className="specialties-grid"
            style={{ 
              border: '1px solid #e8e8e8'
            }}
          >
            {/* Grid layout: 6 columns x 3 rows (responsive) */}
            {specialties.length > 0 ? specialties.map((specialty) => (
              <div
                key={specialty.id}
                className="specialty-card"
                onClick={() => {
                  if (specialty.url) {
                    // Check if URL is external (starts with http:// or https://)
                    if (specialty.url.startsWith('http://') || specialty.url.startsWith('https://')) {
                      window.open(specialty.url, '_blank');
                    } else {
                      navigate(specialty.url);
                    }
                  } else {
                    navigate('/doctors');
                  }
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 12 }}>
                  <img src={specialty.icon} alt={specialty.name} style={{ width: 48, height: 48, objectFit: 'contain' }} />
                </div>
                <div className="specialty-name">
                  {specialty.name}
                </div>
                {specialty.isFeatured && (
                  <div className="specialty-hot-badge">
                    HOT
                  </div>
                )}
              </div>
            )) : (
              <div style={{ padding: 40, textAlign: 'center', gridColumn: '1 / -1' }}>
                <Paragraph>Chưa có dữ liệu chuyên khoa</Paragraph>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Statistics Section - New Design with Background Image */}
      {statistics.length > 0 && siteSettings?.statisticsBackgroundImage && (
      <div 
        ref={el => sectionsRef.current[4] = el}
        className="animate-section"
        style={{ 
        backgroundImage: `url(${siteSettings.statisticsBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '80px 24px',
        position: 'relative'
      }}>
        {/* Overlay for better text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1
        }} />
        
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Title level={2} style={{ color: '#fff', marginBottom: 16, fontSize: 32, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              KHAMNOW TRONG SỐ LIỆU
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.95)', fontSize: 16, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
              Những con số ấn tượng khẳng định uy tín và chất lượng dịch vụ
            </Paragraph>
          </div>
          
          <Row gutter={[24, 24]} justify="center">
            {statistics.map((stat) => (
              <Col xs={24} sm={12} md={6} key={stat.id}>
                <div style={{ 
                  background: stat.color || '#13c2c2',
                  borderRadius: 12,
                  padding: '32px 24px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                >
                  {/* Decorative elements */}
                  <div style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 80,
                    height: 80,
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '50%'
                  }} />
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                      fontSize: 48, 
                      fontWeight: 700, 
                      color: stat.textColor || '#FFD700',
                      marginBottom: 12,
                      lineHeight: 1,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ 
                      fontSize: 16, 
                      fontWeight: 500,
                      color: stat.textColor || '#fff',
                      lineHeight: 1.4
                    }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      )}
      
      {/* Fallback: Statistics Section without background image */}
      {statistics.length > 0 && !siteSettings?.statisticsBackgroundImage && (
      <div style={{ 
        background: 'linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)',
        padding: '80px 24px',
        color: '#fff'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Title level={2} style={{ color: '#fff', marginBottom: 16, fontSize: 32 }}>
              KHAMNOW TRONG SỐ LIỆU
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
              Những con số ấn tượng khẳng định uy tín và chất lượng dịch vụ
            </Paragraph>
          </div>
          
          <Row gutter={[48, 48]}>
            {statistics.map((stat) => (
              <Col xs={12} sm={6} key={stat.id}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: 48, 
                    fontWeight: 700, 
                    color: stat.color || '#FFD700',
                    marginBottom: 8,
                    lineHeight: 1
                  }}>
                    {stat.icon && (
                      <span style={{ marginRight: 8 }}>
                        <img src={stat.icon} alt={stat.label} style={{ width: 48, height: 48, objectFit: 'contain', verticalAlign: 'middle' }} />
                      </span>
                    )}
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>
                    {stat.label}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      )}

      {/* Certifications Section - Chứng chỉ và cơ sở vật chất */}
      {certifications.length > 0 && (
      <div style={{ 
        background: '#fff',
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Title level={2} style={{ color: '#262626', marginBottom: 16, fontSize: 32 }}>
              CHỨNG CHỈ VÀ CƠ SỞ VẬT CHẤT
            </Title>
            <Paragraph style={{ color: '#666', fontSize: 16 }}>
              Được công nhận bởi các tổ chức uy tín trong và ngoài nước
            </Paragraph>
          </div>
          
          {/* Certification Slider */}
          <CertificationSlider certifications={certifications} />
          
        </div>
      </div>
      )}

      {/* Membership Benefits Section - Ưu đãi thành viên */}
      {membershipBenefits.length > 0 && membershipBenefits[0] && (
      <div 
        ref={el => sectionsRef.current[5] = el}
        className="animate-section"
        style={{ 
        background: '#f0f9ff',
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <Title level={2} style={{ color: '#262626', marginBottom: 16, fontSize: 32 }}>
              {membershipBenefits[0].title || 'ƯU ĐÃI THÀNH VIÊN CỦA KHAMNOW'}
            </Title>
            {membershipBenefits[0].subtitle && (
              <Text style={{ fontSize: 16, color: '#666' }}>
                {membershipBenefits[0].subtitle}
              </Text>
            )}
          </div>
          
          <Row gutter={[48, 48]} align="middle">
            {/* Left side - Image */}
            <Col xs={24} md={12}>
              <div style={{ width: '100%' }}>
                <img 
                  src={membershipBenefits[0].image1 || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop'} 
                  alt="Membership benefits"
                  style={{ 
                    width: '100%',
                    height: 500,
                    objectFit: 'cover',
                    borderRadius: 16,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                  }}
                />
              </div>
            </Col>

            {/* Right side - Benefits and Form */}
            <Col xs={24} md={12}>
              <div style={{ 
                background: '#fff',
                padding: 40,
                borderRadius: 16,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
              }}>
                {/* Benefits List */}
                <div style={{ marginBottom: 32 }}>
                  {[
                    membershipBenefits[0].benefit1,
                    membershipBenefits[0].benefit2,
                    membershipBenefits[0].benefit3,
                    membershipBenefits[0].benefit4,
                    membershipBenefits[0].benefit5
                  ].filter(Boolean).map((benefit, index) => (
                    <div 
                      key={index}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 16,
                        padding: '12px 0'
                      }}
                    >
                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                        background: '#13c2c2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <CheckOutlined style={{ color: '#fff', fontSize: 14 }} />
                      </div>
                      <Text style={{ fontSize: 15, color: '#262626' }}>
                        {benefit}
                      </Text>
                    </div>
                  ))}
                </div>

                {/* Email Input */}
                <div style={{ marginBottom: 24 }}>
                  <Text style={{ 
                    display: 'block', 
                    marginBottom: 12,
                    color: '#666',
                    fontSize: 14
                  }}>
                    Đăng ký email để nhận tin tức sức khỏe
                  </Text>
                  <Input 
                    size="large"
                    placeholder={membershipBenefits[0].emailPlaceholder || 'Nhập email của bạn'}
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    onPressEnter={handleNewsletterSubscribe}
                    style={{ 
                      borderRadius: 8,
                      border: '1px solid #d9d9d9'
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Button 
                      size="large"
                      block
                      loading={subscribing}
                      style={{
                        height: 48,
                        borderRadius: 8,
                        background: '#13c2c2',
                        borderColor: '#13c2c2',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: 15
                      }}
                      onMouseEnter={(e) => {
                        if (!subscribing) {
                          e.currentTarget.style.background = '#36cfc9';
                          e.currentTarget.style.borderColor = '#36cfc9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!subscribing) {
                          e.currentTarget.style.background = '#13c2c2';
                          e.currentTarget.style.borderColor = '#13c2c2';
                        }
                      }}
                      onClick={handleNewsletterSubscribe}
                    >
                      {membershipBenefits[0].button1Text || 'Đăng ký nhận tin'}
                    </Button>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Button 
                      size="large"
                      block
                      style={{
                        height: 48,
                        borderRadius: 8,
                        border: '2px solid #13c2c2',
                        color: '#13c2c2',
                        fontWeight: 600,
                        fontSize: 15
                      }}
                      onClick={() => navigate(membershipBenefits[0].button2Url || '/doctors')}
                    >
                      {membershipBenefits[0].button2Text || 'Liên hệ chúng tôi'}
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
      <div 
        ref={el => sectionsRef.current[6] = el}
        className="animate-section"
        style={{ 
        background: '#f8f9fa',
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Title level={2} style={{ color: '#262626', marginBottom: 16, fontSize: 32 }}>
              KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI
            </Title>
          </div>
          
          <Row gutter={[24, 24]}>
            {testimonials.slice(0, 3).map((testimonial) => (
              <Col xs={24} md={8} key={testimonial.id}>
                <Card style={{ 
                  borderRadius: 16,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  height: '100%'
                }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      {testimonial.customerImage ? (
                        <Avatar size={48} src={testimonial.customerImage} />
                      ) : (
                        <Avatar size={48} style={{ background: '#13c2c2', color: '#fff' }}>
                          {testimonial.customerName?.charAt(0)}
                        </Avatar>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: '#262626' }}>{testimonial.customerName}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{testimonial.customerTitle}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                      {[...Array(testimonial.rating || 5)].map((_, index) => (
                        <StarFilled 
                          key={index}
                          style={{ 
                            fontSize: 18,
                            color: '#fadb14',
                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                          }} 
                        />
                      ))}
                    </div>
                  </div>
                  <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, fontStyle: 'italic' }}>
                    "{testimonial.testimonialText}"
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      )}
      
      {/* Verification Modal */}
      <Modal
        title="Xác nhận đăng ký"
        open={verificationModalVisible}
        onOk={handleVerifyCode}
        onCancel={() => {
          setVerificationModalVisible(false);
          setVerificationCode('');
        }}
        okText="Xác nhận"
        cancelText="Hủy"
        centered
      >
        <div style={{ padding: '20px 0' }}>
          <Text style={{ display: 'block', marginBottom: 16, fontSize: 15 }}>
            Mã xác nhận đã được gửi đến email: <strong>{newsletterEmail}</strong>
          </Text>
          <Text style={{ display: 'block', marginBottom: 16, color: '#666' }}>
            Vui lòng kiểm tra email và nhập mã xác nhận 6 số:
          </Text>
          <Input
            size="large"
            placeholder="Nhập mã 6 số"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            style={{ 
              fontSize: 24, 
              textAlign: 'center', 
              letterSpacing: 8,
              fontWeight: 'bold'
            }}
            onPressEnter={handleVerifyCode}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 12, fontSize: 12 }}>
            Mã có hiệu lực trong 15 phút
          </Text>
        </div>
      </Modal>
      </>
      )}
    </div>
  );
}

export default HomePage;
