import React, { useEffect, useState, useRef } from 'react';
import { Typography, Row, Col, Card, Timeline, Statistic, Avatar, Spin } from 'antd';
import { 
  HeartOutlined, 
  SafetyOutlined, 
  TeamOutlined, 
  TrophyOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  GlobalOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import cmsAPI from '../services/cmsApi';
import '../styles/about.css';

const { Title, Paragraph, Text } = Typography;

function AboutPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Animation refs
  const sectionsRef = useRef([]);
  
  // Data from database
  const [heroData, setHeroData] = useState(null);
  const [missionData, setMissionData] = useState(null);
  const [coreValues, setCoreValues] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    fetchAboutData();
    
    // Reset all sections animation state
    sectionsRef.current.forEach(section => {
      if (section) {
        section.classList.remove('animate-in');
      }
    });
    
    // Parallax scroll effect - slower movement
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const heroSection = document.querySelector('.about-hero');
      if (heroSection && scrolled < 800) {
        // Move background up slowly (15% of scroll speed)
        heroSection.style.backgroundPositionY = `${-scrolled * 0.15}px`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
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
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const response = await cmsAPI.getAllAboutSections();
      
      console.log('=== FETCH ABOUT DATA ===');
      console.log('Response:', response.data);
      
      response.data.forEach(section => {
        const content = JSON.parse(section.contentJson);
        console.log('Section:', section.sectionKey, 'Content:', content);
        switch(section.sectionKey) {
          case 'hero':
            setHeroData(content);
            console.log('✓ Hero data set');
            break;
          case 'mission':
            setMissionData(content);
            console.log('✓ Mission data set');
            break;
          case 'values':
            setCoreValues(content);
            console.log('✓ Values data set, length:', content.length);
            break;
          case 'achievements':
            console.log('✓ Achievements data:', content);
            setAchievements(content);
            console.log('✓ Achievements set, length:', content.length);
            break;
          case 'timeline':
            setMilestones(content);
            console.log('✓ Timeline data set, length:', content.length);
            break;
          case 'team':
            setTeam(content);
            console.log('✓ Team data set, length:', content.length);
            break;
          default:
            break;
        }
      });
      
      console.log('=== DATA SET COMPLETE ===');
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="about-page">
      {/* Hero Section with Parallax */}
      <div 
        className={`about-hero ${isVisible ? 'visible' : ''}`}
        style={{
          backgroundImage: heroData?.backgroundImage 
            ? `url(${heroData.backgroundImage})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      >
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <Title level={1} className="about-hero-title">
            {heroData?.title || 'Về chúng tôi'}
          </Title>
          <Paragraph className="about-hero-subtitle">
            {heroData?.subtitle || 'Hệ thống Y tế chất lượng cao'}
          </Paragraph>
        </div>
        <div className="about-hero-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="#ffffff"></path>
          </svg>
        </div>
      </div>

      {/* Mission & Vision */}
      <div 
        ref={el => sectionsRef.current[0] = el}
        className="about-section about-mission animate-section"
      >
        <div className="container">
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <div className="about-mission-image">
                <img 
                  src={missionData?.imageUrl && missionData.imageUrl !== 'null' ? missionData.imageUrl : 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800'} 
                  alt="Mission" 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800'; }}
                />
                <div className="about-mission-badge">
                  <HeartOutlined />
                  <span>15+ Năm</span>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="about-mission-content">
                <Text className="about-label">{missionData?.label || 'SỨ MỆNH CỦA CHÚNG TÔI'}</Text>
                <Title level={2}>
                  {missionData?.title || 'Mang đến dịch vụ y tế chất lượng cao'}
                </Title>
                <Paragraph className="about-text">
                  {missionData?.description || ''}
                </Paragraph>
                {missionData?.features && missionData.features.length > 0 && (
                  <div className="about-mission-features">
                    {missionData.features.map((feature, index) => (
                      <div className="feature-item" key={index}>
                        <CheckCircleOutlined />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Core Values */}
      <div 
        ref={el => sectionsRef.current[1] = el}
        className="about-section about-values animate-section"
      >
        <div className="container">
          <div className="about-section-header">
            <Text className="about-label">GIÁ TRỊ CỐT LÕI</Text>
            <Title level={2}>
              Những giá trị chúng tôi <span className="text-primary">theo đuổi</span>
            </Title>
          </div>
          <Row gutter={[32, 32]}>
            {coreValues.map((value, index) => {
              const iconMap = {
                'HeartOutlined': <HeartOutlined />,
                'SafetyOutlined': <SafetyOutlined />,
                'TeamOutlined': <TeamOutlined />,
                'TrophyOutlined': <TrophyOutlined />
              };
              return (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card 
                    className="value-card"
                    hoverable
                    bodyStyle={{
                      padding: '32px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      height: '100%'
                    }}
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      borderTop: `4px solid ${value.color}`,
                      height: '100%'
                    }}
                  >
                    <div 
                      style={{ 
                        color: value.color,
                        fontSize: '48px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {iconMap[value.icon] || <HeartOutlined />}
                    </div>
                    <Title level={4} style={{ textAlign: 'center', width: '100%' }}>
                      {value.title}
                    </Title>
                    <Paragraph style={{ textAlign: 'center', width: '100%', margin: 0 }}>
                      {value.description}
                    </Paragraph>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>

      {/* Achievements */}
      {(() => {
        if (achievements.length === 0) return null;
        const sectionSettings = achievements[0]?._section ? achievements[0] : null;
        console.log('=== ACHIEVEMENTS DEBUG ===');
        console.log('achievements array:', achievements);
        console.log('achievements[0]:', achievements[0]);
        console.log('sectionSettings:', sectionSettings);
        console.log('titleColor:', sectionSettings?.titleColor);
        console.log('labelColor:', sectionSettings?.labelColor);
        console.log('textColor:', sectionSettings?.textColor);
        console.log('========================');
        
        // Extract colors with fallbacks
        const labelColor = sectionSettings?.labelColor || '#FFFFFF';
        const titleColor = sectionSettings?.titleColor || '#FFFFFF';
        const textColor = sectionSettings?.textColor || '#FFFFFF';
        const overlayColor = sectionSettings?.overlayColor || 'rgba(0, 0, 0, 0.5)';
        
        // Fix backgroundImage - add Cloudinary domain if missing
        let backgroundImage = sectionSettings?.backgroundImage || '';
        if (backgroundImage && !backgroundImage.startsWith('http')) {
          // If path doesn't start with http, add Cloudinary domain
          backgroundImage = `https://res.cloudinary.com/dms0oco5w/image/upload/v1/uploads/${backgroundImage}`;
        }
        
        const sectionTitle = sectionSettings?.sectionTitle || 'Con số ấn tượng';
        
        console.log('Extracted colors:', { labelColor, titleColor, textColor, overlayColor });
        
        return (
        <div 
          ref={el => sectionsRef.current[2] = el}
          className="about-section about-achievements animate-section"
          style={{
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          {/* Overlay */}
          {overlayColor && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: overlayColor,
              zIndex: 1
            }}></div>
          )}
          
          <div className="about-achievements-bg" style={{ zIndex: 1 }}></div>
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="about-section-header">
              <span 
                className="about-label" 
                style={{ 
                  color: labelColor,
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '12px'
                }}
              >
                THÀNH TỰU
              </span>
              <h2 
                className="achievements-title"
                ref={(el) => {
                  if (el) {
                    el.style.setProperty('color', titleColor, 'important');
                    el.style.setProperty('font-size', '42px', 'important');
                    el.style.setProperty('font-weight', '700', 'important');
                    el.style.setProperty('margin', '0', 'important');
                  }
                }}
              >
                {sectionTitle}
              </h2>
            </div>
            <Row gutter={[32, 32]}>
              {achievements.filter(item => !item._section).map((item, index) => (
                <Col xs={12} sm={12} lg={6} key={index}>
                  <div className="achievement-card">
                    <div className="achievement-icon">
                      {item.iconUrl ? (
                        <img 
                          src={item.iconUrl} 
                          alt={item.title} 
                          style={{ width: 60, height: 60, objectFit: 'contain' }} 
                        />
                      ) : (
                        <TrophyOutlined />
                      )}
                    </div>
                    <Statistic
                      value={item.value}
                      suffix={item.suffix}
                      valueStyle={{ 
                        color: textColor, 
                        fontSize: 48, 
                        fontWeight: 700,
                        lineHeight: 1
                      }}
                    />
                    <Text 
                      className="achievement-title" 
                      style={{ color: textColor }}
                    >
                      {item.title}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
        );
      })()}

      {/* Timeline */}
      <div 
        ref={el => sectionsRef.current[3] = el}
        className="about-section about-timeline animate-section"
      >
        <div className="container">
          <div className="about-section-header">
            <Text className="about-label">HÀNH TRÌNH PHÁT TRIỂN</Text>
            <Title level={2}>
              Cột mốc <span className="text-primary">quan trọng</span>
            </Title>
          </div>
          <div className="timeline-wrapper">
            <Timeline mode="alternate">
              {milestones.map((milestone, index) => (
                <Timeline.Item
                  key={index}
                  dot={<RiseOutlined style={{ fontSize: 20 }} />}
                  color="#1890ff"
                >
                  <Card className="timeline-card" hoverable>
                    <div className="timeline-year">{milestone.year}</div>
                    <Title level={4}>{milestone.title}</Title>
                    <Paragraph>{milestone.description}</Paragraph>
                  </Card>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div 
        ref={el => sectionsRef.current[4] = el}
        className="about-section about-team animate-section"
      >
        <div className="container">
          <div className="about-section-header">
            <Text className="about-label">ĐỘI NGŨ LÃNH ĐẠO</Text>
            <Title level={2}>
              Ban lãnh đạo <span className="text-primary">chuyên nghiệp</span>
            </Title>
          </div>
          <Row gutter={[32, 32]}>
            {team.map((member, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card 
                  className="team-card"
                  hoverable
                  cover={
                    <div className="team-avatar-wrapper">
                      <Avatar 
                        size={150} 
                        src={member.avatarUrl}
                        className="team-avatar"
                      />
                    </div>
                  }
                >
                  <Title level={4} className="team-name">{member.name}</Title>
                  <Text className="team-position">{member.position}</Text>
                  <div className="team-specialty">
                    <MedicineBoxOutlined />
                    <span>{member.specialty}</span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div 
        ref={el => sectionsRef.current[5] = el}
        className="about-section about-cta animate-section"
      >
        <div className="container">
          <div className="about-cta-content">
            <Title level={2} style={{ color: '#fff', marginBottom: 16 }}>
              Sẵn sàng chăm sóc sức khỏe của bạn?
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 32 }}>
              Đặt lịch khám ngay hôm nay để được tư vấn từ đội ngũ bác sĩ chuyên nghiệp
            </Paragraph>
            <div className="about-cta-buttons">
              <button 
                className="btn-primary-large"
                onClick={() => navigate('/doctors')}
              >
                Đặt lịch khám
              </button>
              <button 
                className="btn-secondary-large"
                onClick={() => navigate('/contact')}
              >
                Liên hệ tư vấn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
