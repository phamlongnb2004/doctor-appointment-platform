import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Input, Select, Avatar, Spin } from 'antd';
import { UserOutlined, SearchOutlined, StarOutlined, CalendarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import ChatButton from '../components/ChatButton';
import '../styles/doctors.css';

const { Option } = Select;

function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [heroContent, setHeroContent] = useState({
    title: 'Đặt lịch khám bác sĩ',
    subtitle: 'Tìm kiếm và đặt lịch khám với hơn 200 bác sĩ chuyên khoa hàng đầu',
    background: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
    fetchSiteSettings();
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

  const fetchSiteSettings = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/cms/site-settings`;
      console.log('Fetching site settings from:', apiUrl);
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log('Site settings response:', data);
      console.log('doctorsHeroBackground:', data.doctorsHeroBackground);
      if (data) {
        setHeroContent({
          title: data.doctorsHeroTitle || 'Đặt lịch khám bác sĩ',
          subtitle: data.doctorsHeroSubtitle || 'Tìm kiếm và đặt lịch khám với hơn 200 bác sĩ chuyên khoa hàng đầu',
          background: data.doctorsHeroBackground
        });
        console.log('Hero content set:', {
          title: data.doctorsHeroTitle,
          subtitle: data.doctorsHeroSubtitle,
          background: data.doctorsHeroBackground
        });
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
    }
  };

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
    <div className="doctors-page">
      {/* Hero Section */}
      <div 
        className="doctors-hero"
        style={{
          background: heroContent.background 
            ? `linear-gradient(135deg, rgba(0, 102, 255, 0.9) 0%, rgba(0, 82, 204, 0.9) 100%), url(${heroContent.background})`
            : 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="doctors-hero-content">
          <h1>{heroContent.title}</h1>
          <p>{heroContent.subtitle}</p>
        </div>
      </div>

      <div className="doctors-container">
        {/* Search Card */}
        <div className="doctors-search-card">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={8}>
              <Input
                size="large"
                placeholder="Tìm kiếm bác sĩ theo tên hoặc chuyên khoa..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
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
            <Col xs={24} sm={12} md={8}>
              <Button 
                size="large"
                block
                icon={<CalendarOutlined />}
                className="doctors-action-btn doctors-action-btn-primary"
                onClick={() => navigate('/appointment')}
              >
                Đặt lịch khám nhanh
              </Button>
            </Col>
          </Row>
        </div>

        {loading ? (
          <div className="doctors-loading">
            <Spin size="large" />
            <p className="doctors-loading-text">Đang tải danh sách bác sĩ...</p>
          </div>
        ) : (
          <>
            <div className="doctors-results-header">
              <div>
                <h3 className="doctors-results-title">
                  Tìm thấy {filteredDoctors.length} bác sĩ
                </h3>
                <p className="doctors-results-subtitle">
                  Sắp xếp theo đánh giá cao nhất
                </p>
              </div>
            </div>

            {filteredDoctors.length > 0 ? (
              <Row gutter={[24, 24]}>
                {filteredDoctors.map((doctor) => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={doctor.id}>
                    <div className="doctor-card" onClick={() => navigate(`/doctors/${doctor.id}`)}>
                      <div className="doctor-card-avatar">
                        <Avatar
                          size={70}
                          src={doctor.user?.profileImage}
                          icon={<UserOutlined />}
                        />
                        <div className="doctor-card-badge">
                          <CheckCircleOutlined />
                        </div>
                      </div>
                      
                      <div className="doctor-card-name">
                        {doctor.user?.firstName} {doctor.user?.lastName}
                      </div>
                      
                      <div className="doctor-card-specialty">
                        {doctor.specialization}
                      </div>
                      
                      <div className="doctor-card-rating">
                        <StarOutlined />
                        <span>{(doctor.ratingScore || 0).toFixed(1)}</span>
                        <span>({doctor.reviewCount || 0})</span>
                      </div>
                      
                      <div className="doctor-card-divider"></div>
                      
                      <div className="doctor-card-info">
                        <CalendarOutlined />
                        <span>{doctor.experienceYears || 0} năm kinh nghiệm</span>
                      </div>
                      
                      <div className="doctor-card-fee">
                        {doctor.consultationFee?.toLocaleString() || 0} VNĐ
                      </div>

                      <div className="doctor-card-actions">
                        <Button 
                          type="primary" 
                          size="small"
                          className="doctor-card-btn doctor-card-btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/doctors/${doctor.id}`);
                          }}
                        >
                          Đặt lịch
                        </Button>
                        {currentUser && currentUser.id && (
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
                            className="doctor-card-btn doctor-card-btn-secondary"
                          />
                        )}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="doctors-empty">
                <div className="doctors-empty-icon">🔍</div>
                <h3 className="doctors-empty-title">Không tìm thấy bác sĩ</h3>
                <p className="doctors-empty-text">Thử thay đổi từ khóa tìm kiếm hoặc chuyên khoa</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DoctorListPage;
