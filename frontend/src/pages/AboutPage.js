import React, { useEffect, useState } from 'react';
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
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const response = await cmsAPI.getAllAboutSections();
      
      response.data.forEach(section => {
        const content = JSON.parse(section.contentJson);
        switch(section.sectionKey) {
          case 'hero':
            setHeroData(content);
            break;
          case 'mission':
            setMissionData(content);
            break;
          case 'values':
            setCoreValues(content);
            break;
          case 'achievements':
            setAchievements(content);
            break;
          case 'timeline':
            setMilestones(content);
            break;
          case 'team':
            setTeam(content);
            break;
          default:
            break;
        }
      });
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
      {/* Hero Section */}
      <div 
        className={`about-hero ${isVisible ? 'visible' : ''}`}
        style={{
          backgroundImage: heroData?.backgroundImage 
            ? `url(${heroData.backgroundImage})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
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
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      {/* Mission & Vision */}
      {missionData && (
        <div className="about-section about-mission">
          <div className="container">
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={12}>
                <div className="about-mission-image">
                  <img 
                    src={missionData.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800'} 
                    alt="Mission" 
                  />
                  <div className="about-mission-badge">
                    <HeartOutlined />
                    <span>15+ Năm</span>
                  </div>
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div className="about-mission-content">
                  <Text className="about-label">{missionData.label || 'SỨ MỆNH CỦA CHÚNG TÔI'}</Text>
                  <Title level={2}>
                    {missionData.title || 'Mang đến dịch vụ y tế chất lượng cao'}
                  </Title>
                  <Paragraph className="about-text">
                    {missionData.description}
                  </Paragraph>
                  {missionData.features && missionData.features.length > 0 && (
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
      )}

      {/* Core Values */}
      {coreValues.length > 0 && (
        <div className="about-section about-values">
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
                      style={{ 
                        animationDelay: `${index * 0.1}s`,
                        borderTop: `4px solid ${value.color}`
                      }}
                    >
                      <div className="value-icon" style={{ color: value.color }}>
                        {iconMap[value.icon] || <HeartOutlined />}
                      </div>
                      <Title level={4}>{value.title}</Title>
                      <Paragraph>{value.description}</Paragraph>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="about-section about-achievements">
          <div className="about-achievements-bg"></div>
          <div className="container">
            <div className="about-section-header">
              <Text className="about-label" style={{ color: '#fff' }}>THÀNH TỰU</Text>
              <Title level={2} style={{ color: '#fff' }}>
                Con số ấn tượng
              </Title>
            </div>
            <Row gutter={[32, 32]}>
              {achievements.map((item, index) => {
                const iconMap = {
                  'TeamOutlined': <TeamOutlined />,
                  'MedicineBoxOutlined': <MedicineBoxOutlined />,
                  'GlobalOutlined': <GlobalOutlined />,
                  'TrophyOutlined': <TrophyOutlined />
                };
                return (
                  <Col xs={12} sm={12} lg={6} key={index}>
                    <div className="achievement-card">
                      <div className="achievement-icon">
                        {iconMap[item.icon] || <TrophyOutlined />}
                      </div>
                      <Statistic
                        value={item.value}
                        suffix={item.suffix}
                        valueStyle={{ 
                          color: '#fff', 
                          fontSize: 48, 
                          fontWeight: 700,
                          lineHeight: 1
                        }}
                      />
                      <Text className="achievement-title">{item.title}</Text>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
      )}

      {/* Timeline */}
      {milestones.length > 0 && (
        <div className="about-section about-timeline">
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
      )}

      {/* Leadership Team */}
      {team.length > 0 && (
        <div className="about-section about-team">
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
      )}

      {/* CTA Section */}
      <div className="about-section about-cta">
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
