import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Tabs, Avatar, Rate, Tag, DatePicker, Select, message, Spin, Space } from 'antd';
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, StarOutlined, ArrowLeftOutlined, MessageOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import cmsAPI from '../services/cmsApi';
import ChatButton from '../components/ChatButton';
import useFallingFlowers from '../hooks/useFallingFlowers';
import '../styles/animations.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const flowerContainerRef = useFallingFlowers(5);

  useEffect(() => {
    fetchDoctor();
    fetchDoctorArticles();
    // Lấy thông tin user hiện tại từ localStorage
    const userData = {
      id: parseInt(localStorage.getItem('userId')),
      email: localStorage.getItem('userEmail'),
      firstName: localStorage.getItem('userFirstName'),
      lastName: localStorage.getItem('userLastName'),
      role: localStorage.getItem('userRole')
    };
    setCurrentUser(userData);
  }, [id]);

  const fetchDoctor = async () => {
    setLoading(true);
    try {
      const response = await doctorAPI.getDoctorById(id);
      setDoctor(response.data);
    } catch (error) {
      console.error('Error fetching doctor:', error);
      message.error('Không tìm thấy bác sĩ!');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDoctorArticles = async () => {
    try {
      const response = await cmsAPI.getArticlesByDoctor(id);
      setArticles(response.data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const timeSlots = [
    '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00',
    '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      message.warning('Vui lòng chọn ngày và giờ khám!');
      return;
    }
    navigate('/appointments', { state: { doctorId: doctor.id } });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Title level={3}>Không tìm thấy bác sĩ</Title>
      </div>
    );
  }

  return (
    <div ref={flowerContainerRef} style={{ minHeight: '100vh', padding: '40px 50px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Back Button */}
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/doctors')}
          style={{ marginBottom: 24 }}
        >
          Quay lại
        </Button>

        <Row gutter={32}>
          {/* Doctor Info */}
          <Col xs={24} lg={8}>
            <Card style={{ borderRadius: 16, textAlign: 'center' }}>
              <Avatar
                size={200}
                src={doctor.user?.profileImage}
                icon={<UserOutlined />}
                style={{ border: '5px solid #667eea' }}
              />
              <Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>
                {doctor.user?.firstName} {doctor.user?.lastName}
              </Title>
              <Tag color="blue" style={{ marginBottom: 16 }}>{doctor.specialization}</Tag>
              
              <div style={{ marginTop: 16 }}>
                <Rate disabled value={doctor.ratingScore || 0} />
                <div>
                  <Text type="secondary">
                    ({doctor.reviewCount || 0} đánh giá)
                  </Text>
                </div>
              </div>

              {/* Chat Button */}
              {currentUser && (
                <div style={{ marginTop: 20 }}>
                  <ChatButton
                    currentUser={currentUser}
                    targetUser={{
                      id: doctor.user?.id,
                      email: doctor.user?.email,
                      firstName: doctor.user?.firstName,
                      lastName: doctor.user?.lastName,
                      role: 'DOCTOR'
                    }}
                    type="primary"
                    size="large"
                    block={true}
                  />
                </div>
              )}
            </Card>

            {/* Quick Info */}
            <Card style={{ borderRadius: 16, marginTop: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ textAlign: 'center' }}>
                    <CalendarOutlined style={{ fontSize: 24, color: '#667eea' }} />
                    <div>
                      <Text strong>{doctor.experienceYears || 0}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>Năm kinh nghiệm</Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ textAlign: 'center' }}>
                    <StarOutlined style={{ fontSize: 24, color: '#ffd700' }} />
                    <div>
                      <Text strong>{(doctor.ratingScore || 0).toFixed(1)}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>Đánh giá</Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Booking & Details */}
          <Col xs={24} lg={16}>
            <Card style={{ borderRadius: 16 }}>
              <Tabs
                defaultActiveKey="info"
                items={[
                  {
                    key: 'info',
                    label: 'Thông tin',
                    children: (
                      <Row gutter={24}>
                        <Col xs={24} md={12}>
                          <Title level={5}>Thông tin liên hệ</Title>
                          <Paragraph>
                            <EnvironmentOutlined /> Địa chỉ: {doctor.user?.address || 'Chưa cập nhật'}
                          </Paragraph>
                          <Paragraph>
                            <CalendarOutlined /> Email: {doctor.user?.email || 'Chưa cập nhật'}
                          </Paragraph>
                        </Col>
                        <Col xs={24} md={12}>
                          <Title level={5}>Phí tư vấn</Title>
                          <Title level={3} style={{ color: '#667eea', margin: 0 }}>
                            {doctor.consultationFee?.toLocaleString() || 0} VNĐ
                          </Title>
                        </Col>
                      </Row>
                    ),
                  },
                  {
                    key: 'booking',
                    label: 'Đặt lịch',
                    children: (
                      <>
                        <Title level={4}>Chọn ngày và giờ khám</Title>
                        <Row gutter={16} style={{ marginTop: 16 }}>
                          <Col xs={24} md={12}>
                            <DatePicker
                              size="large"
                              style={{ width: '100%' }}
                              placeholder="Chọn ngày khám"
                              onChange={(date) => setSelectedDate(date)}
                              disabledDate={(current) => current && current < new Date().setHours(0,0,0,0)}
                            />
                          </Col>
                          <Col xs={24} md={12}>
                            <Select
                              size="large"
                              style={{ width: '100%' }}
                              placeholder="Chọn giờ khám"
                              onChange={(value) => setSelectedTime(value)}
                            >
                              {timeSlots.map((time) => (
                                <Option key={time} value={time}>
                                  <ClockCircleOutlined /> {time}
                                </Option>
                              ))}
                            </Select>
                          </Col>
                        </Row>
                        <Card style={{ marginTop: 24, background: 'linear-gradient(135deg, #667eea08 0%, #764ba208 100%)' }}>
                          <Row justify="space-between" align="middle">
                            <Col>
                              <Text style={{ fontSize: 16 }}>Tổng chi phí:</Text>
                            </Col>
                            <Col>
                              <Title level={3} style={{ margin: 0, color: '#667eea' }}>
                                {doctor.consultationFee?.toLocaleString() || 0} VNĐ
                              </Title>
                            </Col>
                          </Row>
                        </Card>
                        <Button
                          type="primary"
                          size="large"
                          block
                          style={{
                            marginTop: 24,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            height: 48,
                            fontSize: 16
                          }}
                          onClick={handleBooking}
                          icon={<CalendarOutlined />}
                        >
                          Xác Nhận Đặt Lịch
                        </Button>
                      </>
                    ),
                  },
                  {
                    key: 'articles',
                    label: 'Bài viết',
                    children: (
                      <div>
                        {articles.length > 0 ? (
                          <Row gutter={[16, 16]}>
                            {articles.map((article) => (
                              <Col xs={24} key={article.id}>
                                <Card 
                                  hoverable
                                  style={{ borderRadius: 12, cursor: 'pointer' }}
                                  onClick={() => navigate(`/news/${article.slug}`)}
                                >
                                  <Row gutter={16}>
                                    {article.imageUrl && (
                                      <Col xs={24} sm={8}>
                                        <img 
                                          src={article.imageUrl} 
                                          alt={article.title}
                                          style={{ 
                                            width: '100%', 
                                            height: 150, 
                                            objectFit: 'cover',
                                            borderRadius: 8
                                          }}
                                        />
                                      </Col>
                                    )}
                                    <Col xs={24} sm={article.imageUrl ? 16 : 24}>
                                      <Title level={4} style={{ marginTop: 0 }}>
                                        {article.title}
                                      </Title>
                                      <Paragraph ellipsis={{ rows: 3 }}>
                                        {article.excerpt}
                                      </Paragraph>
                                      <Space>
                                        <Text type="secondary">
                                          <CalendarOutlined /> {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                                        </Text>
                                        <Button 
                                          type="link" 
                                          size="small"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/news/${article.slug}`);
                                          }}
                                        >
                                          Xem chi tiết →
                                        </Button>
                                      </Space>
                                    </Col>
                                  </Row>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Text type="secondary">Bác sĩ chưa có bài viết nào</Text>
                          </div>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default DoctorDetailPage;
