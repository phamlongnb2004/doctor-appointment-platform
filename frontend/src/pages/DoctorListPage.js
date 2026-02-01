import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Input, Select, Avatar, Rate, Spin, Empty, Tag } from 'antd';
import { UserOutlined, SearchOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import useFallingFlowers from '../hooks/useFallingFlowers';
import '../styles/animations.css';

const { Title, Text } = Typography;
const { Option } = Select;

function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const navigate = useNavigate();
  const flowerContainerRef = useFallingFlowers({ numberOfFlowers: 5 });

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialization]);

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let response;
      if (selectedSpecialization) {
        response = await doctorAPI.getDoctorsBySpecialization(selectedSpecialization);
      } else {
        response = await doctorAPI.getActiveDoctors();
      }
      setDoctors(response.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await doctorAPI.getAllDoctors();
      const docs = response.data || [];
      const specs = [...new Set(docs.map(d => d.specialization).filter(Boolean))];
      setSpecializations(specs);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredDoctors = doctors.filter(doctor => {
    const fullName = `${doctor.user?.firstName || ''} ${doctor.user?.lastName || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) ||
           (doctor.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
  });

  return (
    <div ref={flowerContainerRef} style={{ minHeight: '100vh', padding: '40px 50px', background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 8 }}>
          👨‍⚕️ Danh Sách Bác Sĩ
        </Title>
        <Text style={{ textAlign: 'center', display: 'block', color: '#666', marginBottom: 32 }}>
          Tìm kiếm và đặt lịch khám với bác sĩ chuyên khoa
        </Text>

        {/* Search & Filter */}
        <Card style={{ borderRadius: 16, marginBottom: 24 }}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Input
                size="large"
                placeholder="Tìm kiếm bác sĩ..."
                prefix={<SearchOutlined style={{ color: '#999' }} />}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ borderRadius: 8 }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                size="large"
                placeholder="Chọn chuyên khoa"
                style={{ width: '100%' }}
                onChange={setSelectedSpecialization}
                allowClear
              >
                {specializations.map((spec) => (
                  <Option key={spec} value={spec}>{spec}</Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 100 }}>
            <Spin size="large" />
            <p style={{ marginTop: 16, color: '#666' }}>Đang tải danh sách bác sĩ...</p>
          </div>
        ) : (
          <>
            {/* Doctor Grid */}
            {filteredDoctors.length > 0 ? (
              <Row gutter={[24, 24]}>
                {filteredDoctors.map((doctor) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={doctor.id}>
                    <Card
                      className="glass-card card-hover"
                      style={{ 
                        borderRadius: 16,
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                      cover={
                        <div style={{ 
                          padding: 20, 
                          textAlign: 'center',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}>
                          <Avatar
                            size={100}
                            src={doctor.user?.profileImage}
                            icon={<UserOutlined />}
                            style={{ border: '4px solid #fff' }}
                          />
                        </div>
                      }
                      onClick={() => navigate(`/doctors/${doctor.id}`)}
                    >
                      <Card.Meta
                        title={
                          <div>
                            <Text strong style={{ fontSize: 16 }}>
                              {doctor.user?.firstName} {doctor.user?.lastName}
                            </Text>
                            <Tag color="blue" style={{ marginLeft: 8 }}>{doctor.specialization}</Tag>
                          </div>
                        }
                        description={
                          <div>
                            <div style={{ marginTop: 8 }}>
                              <Rate disabled defaultValue={doctor.ratingScore || 0} style={{ fontSize: 14 }} />
                              <Text type="secondary" style={{ marginLeft: 8 }}>
                                ({doctor.reviewCount || 0} đánh giá)
                              </Text>
                            </div>
                            <div style={{ marginTop: 8 }}>
                              <Text type="secondary" style={{ fontSize: 13 }}>
                                <CalendarOutlined /> {doctor.experienceYears || 0} năm kinh nghiệm
                              </Text>
                            </div>
                            <div style={{ marginTop: 8 }}>
                              <Text strong style={{ color: '#667eea', fontSize: 16 }}>
                                {doctor.consultationFee?.toLocaleString() || 0} VNĐ
                              </Text>
                            </div>
                          </div>
                        }
                      />
                      <Button 
                        type="primary" 
                        block 
                        style={{ marginTop: 16, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/doctors/${doctor.id}`);
                        }}
                      >
                        Xem chi tiết & Đặt lịch
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty description="Không tìm thấy bác sĩ" />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DoctorListPage;
