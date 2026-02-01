import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Typography, Space, Avatar, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HeartOutlined, StarOutlined, CalendarOutlined, SafetyOutlined, UserOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { doctorAPI } from '../services/api';
import useFallingFlowers from '../hooks/useFallingFlowers';
import '../styles/animations.css';

const { Title, Paragraph, Text } = Typography;

function HomePage() {
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const flowerContainerRef = useFallingFlowers({ maxPetals: 50 });

  useEffect(() => {
    fetchTopDoctors();
  }, []);

  const fetchTopDoctors = async () => {
    setLoading(true);
    try {
      const response = await doctorAPI.getActiveDoctors();
      const doctors = response.data || [];
      // Sort by rating and take top 4
      const sorted = doctors.sort((a, b) => (b.ratingScore || 0) - (a.ratingScore || 0)).slice(0, 4);
      setTopDoctors(sorted);
    } catch (error) {
      console.error('Error fetching top doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <UserOutlined style={{ fontSize: 40 }} />, title: 'Bác sĩ chuyên môn', desc: 'Đội ngũ bác sĩ giàu kinh nghiệm', color: '#1890ff' },
    { icon: <CalendarOutlined style={{ fontSize: 40 }} />, title: 'Đặt lịch nhanh', desc: 'Đặt lịch khám chỉ trong 30 giây', color: '#52c41a' },
    { icon: <SafetyOutlined style={{ fontSize: 40 }} />, title: 'Dịch vụ an toàn', desc: 'Bảo mật thông tin bệnh nhân', color: '#722ed1' },
    { icon: <StarOutlined style={{ fontSize: 40 }} />, title: 'Đánh giá thật', desc: 'Review bác sĩ chất lượng', color: '#fa8c16' }
  ];

  const specialties = [
    { name: 'Tim mạch', icon: '❤️', color: '#f5222d' },
    { name: 'Da liễu', icon: '🧴', color: '#fa8c16' },
    { name: 'Nhi khoa', icon: '👶', color: '#52c41a' },
    { name: 'Nội tổng quát', icon: '🩺', color: '#1890ff' },
    { name: 'Mắt', icon: '👁️', color: '#722ed1' },
    { name: 'Răng hàm mặt', icon: '🦷', color: '#eb2f96' },
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Flower Animation Container */}
      <div ref={flowerContainerRef} id="hoamaitet" />
      
      {/* Hero Section */}
      <div className="gradient-hero" style={{ 
        minHeight: '80vh', 
        position: 'relative', 
        padding: '60px 50px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)' }}></div>
        
        <div style={{ maxWidth: 1400, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Row align="middle">
            <Col xs={24} lg={12} style={{ paddingRight: '40px' }}>
              <Tag color="blue" className="tag-beautiful mb-3" style={{ animation: 'pulse 2s infinite' }}>🏥 Sức khỏe của bạn</Tag>
              <Title level={1} style={{ color: '#fff', fontSize: 48, marginBottom: 20, lineHeight: 1.2 }}>
                Chăm sóc sức khỏe
                <br />
                <span className="gradient-text" style={{ background: 'linear-gradient(135deg, #fff, #ffd700)' }}>tận tâm & chu đáo</span>
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 32 }}>
                Đặt lịch khám bác sĩ nhanh chóng, tiện lợi tại các bệnh viện và phòng khám uy tín nhất Việt Nam
              </Paragraph>
              <Space size="large">
                <Button type="primary" size="large" className="btn-gradient pulse" style={{ background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)', color: '#667eea', border: 'none' }} onClick={() => navigate('/doctors')}>
                  Tìm bác sĩ ngay
                </Button>
                <Button size="large" className="glass-card" style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.5)' }} onClick={() => navigate('/register')}>
                  Đăng ký thành viên
                </Button>
              </Space>
            </Col>
            <Col xs={24} lg={12}>
              <div className="float" style={{ textAlign: 'center' }}>
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500" 
                  alt="Doctor"
                  style={{ 
                    width: '100%', 
                    maxWidth: 500, 
                    borderRadius: 20,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Specialties */}
      <div style={{ padding: '80px 50px', background: '#fff' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 12 }}>Chuyên khoa</Title>
          <Paragraph style={{ textAlign: 'center', color: '#666', marginBottom: 48 }}>Tìm kiếm bác sĩ theo chuyên khoa</Paragraph>
          <Row gutter={[24, 24]}>
            {specialties.map((specialty, i) => (
              <Col xs={12} sm={8} md={4} key={i}>
                <Card 
                  hoverable
                  style={{ 
                    textAlign: 'center', 
                    borderRadius: 16,
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate('/doctors')}
                >
                  <div style={{ fontSize: 40, marginBottom: 8 }}>{specialty.icon}</div>
                  <Text strong style={{ color: specialty.color }}>{specialty.name}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '80px 50px', background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 12 }}>Tại sao chọn Doctor Appointment?</Title>
          <Paragraph style={{ textAlign: 'center', color: '#666', marginBottom: 48 }}>Nền tảng đặt lịch khám bác sĩ số 1 Việt Nam</Paragraph>
          <Row gutter={[24, 24]}>
            {features.map((f, i) => (
              <Col xs={24} sm={12} lg={6} key={i}>
                <Card className="glass-card card-hover" style={{ height: '100%', textAlign: 'center', border: 'none' }} hoverable>
                  <div style={{ color: f.color, marginBottom: 16 }}>{f.icon}</div>
                  <Title level={4}>{f.title}</Title>
                  <Text type="secondary">{f.desc}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Top Doctors */}
      <div style={{ padding: '80px 50px', background: '#fff' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <Title level={2} style={{ marginBottom: 8 }}>👨‍⚕️ Bác sĩ nổi bật</Title>
              <Paragraph style={{ color: '#666' }}>Những bác sĩ được đánh giá cao nhất</Paragraph>
            </div>
            <Button type="primary" size="large" onClick={() => navigate('/doctors')} style={{ background: '#667eea', border: 'none' }}>
              Xem tất cả →
            </Button>
          </div>
          <Row gutter={[24, 24]}>
            {loading ? (
              <Col span={24} style={{ textAlign: 'center', padding: 40 }}>
                <Paragraph>Đang tải dữ liệu...</Paragraph>
              </Col>
            ) : (
              topDoctors.map((doctor, i) => (
                <Col xs={12} sm={6} lg={4} key={doctor.id || i}>
                  <Card
                    className="glass-card card-hover"
                    style={{ 
                      borderRadius: 16,
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/doctors/${doctor.id}`)}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <Avatar
                        size={80}
                        src={doctor.user?.profileImage}
                        icon={<UserOutlined />}
                        style={{ marginBottom: 12 }}
                      />
                      <Text strong style={{ display: 'block', fontSize: 14 }}>
                        {doctor.user?.firstName} {doctor.user?.lastName}
                      </Text>
                      <Tag color="blue" style={{ marginTop: 4 }}>{doctor.specialization}</Tag>
                      <div style={{ marginTop: 8 }}>
                        <StarOutlined style={{ color: '#faad14' }} /> {doctor.ratingScore || 0}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
