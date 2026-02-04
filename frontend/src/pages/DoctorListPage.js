import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Input, Select, Avatar, Rate, Spin, Empty, Tag, Space } from 'antd';
import { UserOutlined, SearchOutlined, CalendarOutlined, MessageOutlined, PhoneOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import ChatButton from '../components/ChatButton';
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
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const flowerContainerRef = useFallingFlowers({ numberOfFlowers: 5 });

  useEffect(() => {
    fetchDoctors();
    // Lấy thông tin user hiện tại từ localStorage
    const userData = {
      id: parseInt(localStorage.getItem('userId')),
      email: localStorage.getItem('userEmail'),
      firstName: localStorage.getItem('userFirstName'),
      lastName: localStorage.getItem('userLastName'),
      role: localStorage.getItem('userRole')
    };
    setCurrentUser(userData);
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
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 className="medical-hero-title" style={{ color: '#262626' }}>
            Đặt lịch khám bác sĩ
          </h1>
          <p className="medical-subtitle">
            Tìm kiếm và đặt lịch khám với hơn 200 bác sĩ chuyên khoa hàng đầu
          </p>
        </div>

        {/* Search & Filter */}
        <div className="medical-card" style={{ marginBottom: 32 }}>
          <div style={{ padding: 24 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Input
                  size="large"
                  placeholder="Tìm kiếm bác sĩ..."
                  prefix={<SearchOutlined style={{ color: '#52c41a' }} />}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="medical-input"
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
              <Col xs={24} sm={24} md={10}>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <Button 
                    size="large"
                    icon={<CalendarOutlined />}
                    className="btn-medical-secondary"
                  >
                    Lịch khám hôm nay
                  </Button>
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<PhoneOutlined />}
                    className="btn-medical-primary"
                  >
                    Hotline: 1900-1234
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 100 }}>
            <Spin size="large" />
            <p style={{ marginTop: 16, color: '#666' }}>Đang tải danh sách bác sĩ...</p>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: '#262626' }}>
                  Tìm thấy {filteredDoctors.length} bác sĩ
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
                  Sắp xếp theo đánh giá cao nhất
                </p>
              </div>
            </div>

            {/* Doctor Grid */}
            {filteredDoctors.length > 0 ? (
              <Row gutter={[24, 24]}>
                {filteredDoctors.map((doctor) => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={doctor.id}>
                    <div className="doctor-card" onClick={() => navigate(`/doctors/${doctor.id}`)}>
                      <Avatar
                        size={80}
                        src={doctor.user?.profileImage}
                        icon={<UserOutlined />}
                        className="doctor-avatar"
                      />
                      
                      <div className="doctor-name">
                        {doctor.user?.firstName} {doctor.user?.lastName}
                      </div>
                      
                      <div className="doctor-specialty">
                        {doctor.specialization}
                      </div>
                      
                      <div className="doctor-rating">
                        <StarOutlined style={{ color: '#faad14' }} />
                        <span>{(doctor.ratingScore || 0).toFixed(1)}</span>
                        <span>({doctor.reviewCount || 0} đánh giá)</span>
                      </div>
                      
                      <div style={{ marginTop: 12, color: '#666', fontSize: 13 }}>
                        <CalendarOutlined /> {doctor.experienceYears || 0} năm kinh nghiệm
                      </div>
                      
                      <div style={{ marginTop: 8, fontWeight: 600, color: '#52c41a', fontSize: 16 }}>
                        {doctor.consultationFee?.toLocaleString() || 0} VNĐ
                      </div>

                      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                        <Button 
                          type="primary" 
                          size="small"
                          className="btn-medical-primary"
                          style={{ flex: 1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/doctors/${doctor.id}`);
                          }}
                        >
                          Đặt lịch
                        </Button>
                        {currentUser && (
                          <ChatButton
                            currentUser={currentUser}
                            targetUser={{
                              id: doctor.user?.id,
                              email: doctor.user?.email,
                              firstName: doctor.user?.firstName,
                              lastName: doctor.user?.lastName,
                              role: 'DOCTOR'
                            }}
                            type="default"
                            size="small"
                          />
                        )}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h3 style={{ color: '#666' }}>Không tìm thấy bác sĩ</h3>
                <p style={{ color: '#999' }}>Thử thay đổi từ khóa tìm kiếm hoặc chuyên khoa</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DoctorListPage;
