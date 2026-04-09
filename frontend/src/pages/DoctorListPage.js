import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Input, Select, Avatar, Spin, Rate } from 'antd';
import { UserOutlined, SearchOutlined, CalendarOutlined, CheckCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import ChatButton from '../components/ChatButton';
import axios from 'axios';
import '../styles/doctors.css';

const { Option } = Select;

function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroContent, setHeroContent] = useState({
    title: 'Đặt lịch khám bác sĩ',
    subtitle: 'Tìm kiếm và đặt lịch khám với hơn 200 bác sĩ chuyên khoa hàng đầu',
    background: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Load cached hero content from localStorage first
    const cachedHeroContent = localStorage.getItem('doctorsHeroContent');
    if (cachedHeroContent) {
      try {
        const parsed = JSON.parse(cachedHeroContent);
        setHeroContent(parsed);
        setHeroLoading(false);
      } catch (e) {
        console.error('Error parsing cached hero content:', e);
      }
    }
    
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
    fetchProvinces();
  }, []);
  
  const fetchProvinces = async () => {
    try {
      const response = await axios.get('https://provinces.open-api.vn/api/v2/p/');
      setProvinces(response.data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/cms/site-settings`;
      console.log('Fetching site settings from:', apiUrl);
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log('Site settings response:', data);
      console.log('doctorsHeroBackground:', data.doctorsHeroBackground);
      if (data) {
        const newHeroContent = {
          title: data.doctorsHeroTitle || 'Đặt lịch khám bác sĩ',
          subtitle: data.doctorsHeroSubtitle || 'Tìm kiếm và đặt lịch khám với hơn 200 bác sĩ chuyên khoa hàng đầu',
          background: data.doctorsHeroBackground
        };
        setHeroContent(newHeroContent);
        // Cache to localStorage for instant load next time
        localStorage.setItem('doctorsHeroContent', JSON.stringify(newHeroContent));
        console.log('Hero content set:', newHeroContent);
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
    } finally {
      setHeroLoading(false);
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
      console.log('Doctors data:', response.data); // Debug log
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
    const fullName = `${doctor.firstName || ''} ${doctor.lastName || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
           (doctor.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    // Filter by province
    const matchesProvince = !selectedProvince || 
      (doctor.clinicAddress && doctor.clinicAddress.includes(selectedProvince));
    
    return matchesSearch && matchesProvince;
  });

  return (
    <div className="doctors-page">
      {/* Hero Section */}
      <div 
        className="doctors-hero"
        style={{
          backgroundImage: !heroLoading && heroContent.background 
            ? `linear-gradient(135deg, rgba(0, 58, 112, 0.7) 0%, rgba(0, 58, 112, 0.7) 100%), url(${heroContent.background})`
            : 'linear-gradient(135deg, rgba(0, 58, 112, 0.85) 0%, rgba(0, 58, 112, 0.85) 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'background-image 0.3s ease-in-out'
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
            <Col xs={24} sm={24} md={6}>
              <Input
                size="large"
                placeholder="Tìm kiếm bác sĩ..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
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
            <Col xs={24} sm={12} md={6}>
              <Select
                size="large"
                placeholder="Chọn tỉnh/thành phố"
                style={{ width: '100%' }}
                onChange={setSelectedProvince}
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {provinces.map((province) => (
                  <Option key={province.code} value={province.name}>{province.name}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={24} md={6}>
              <Button 
                size="large"
                block
                icon={<CalendarOutlined />}
                className="doctors-action-btn doctors-action-btn-primary"
                onClick={() => navigate('/appointment')}
              >
                Đặt lịch nhanh
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
                          size={60}
                          src={doctor.profileImage}
                          icon={<UserOutlined />}
                        />
                        <div className="doctor-card-badge">
                          <CheckCircleOutlined />
                        </div>
                      </div>
                      
                      <div className="doctor-card-name">
                        {doctor.firstName} {doctor.lastName}
                      </div>
                      
                      <div className="doctor-card-specialty">
                        {doctor.specialization}
                      </div>
                      
                      <div className="doctor-card-rating">
                        <div className="doctor-card-stars">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const rating = doctor.ratingScore || 0;
                            const fillPercentage = Math.min(Math.max((rating - star + 1) * 100, 0), 100);
                            
                            return (
                              <span key={star} className="star-wrapper">
                                <span className="star-empty">☆</span>
                                <span 
                                  className="star-filled" 
                                  style={{ width: `${fillPercentage}%` }}
                                >
                                  ★
                                </span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="doctor-card-rating-text">
                        {(doctor.ratingScore || 0).toFixed(1)} sao ({doctor.reviewCount || 0} đánh giá)
                      </div>
                      
                      <div className="doctor-card-info">
                        <CalendarOutlined />
                        <span>{doctor.experienceYears || 0} năm</span>
                      </div>
                      
                      {doctor.clinicAddress && (
                        <div className="doctor-card-address">
                          <EnvironmentOutlined />
                          <span>{doctor.clinicAddress}</span>
                        </div>
                      )}
                      
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
                              id: doctor.userId,
                              email: doctor.email,
                              firstName: doctor.firstName,
                              lastName: doctor.lastName,
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
                <div className="doctors-empty-icon">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="60" fill="#F1F5F9"/>
                    <path d="M60 30C43.43 30 30 43.43 30 60C30 76.57 43.43 90 60 90C76.57 90 90 76.57 90 60C90 43.43 76.57 30 60 30ZM60 80C49.51 80 41 71.49 41 61C41 50.51 49.51 42 60 42C70.49 42 79 50.51 79 61C79 71.49 70.49 80 60 80Z" fill="#CBD5E1"/>
                    <path d="M75 75L85 85" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round"/>
                    <circle cx="60" cy="60" r="8" fill="#94A3B8"/>
                  </svg>
                </div>
                <h3 className="doctors-empty-title">Không tìm thấy bác sĩ</h3>
                <p className="doctors-empty-text">Thử thay đổi từ khóa tìm kiếm hoặc chuyên khoa</p>
                <Button 
                  type="primary" 
                  size="large"
                  className="doctors-empty-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSpecialization(null);
                    setSelectedProvince(null);
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DoctorListPage;
