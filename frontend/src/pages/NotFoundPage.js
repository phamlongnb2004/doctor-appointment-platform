import React from 'react';
import { Button } from 'antd';
import { HomeOutlined, SearchOutlined, PhoneOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../styles/notfound.css';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      {/* Background Grid */}
      <div className="grid-background"></div>
      
      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="float-icon float-1">
          <MedicineBoxOutlined />
        </div>
        <div className="float-icon float-2">
          <PhoneOutlined />
        </div>
        <div className="float-icon float-3">
          <MedicineBoxOutlined />
        </div>
      </div>

      <div className="notfound-container">
        {/* Glass Card */}
        <div className="glass-card">
          {/* 404 Number with Modern Design */}
          <div className="error-code">
            <div className="code-wrapper">
              <span className="digit">4</span>
              <span className="digit highlight">0</span>
              <span className="digit">4</span>
            </div>
            <div className="error-line"></div>
          </div>

          {/* Content */}
          <div className="error-content">
            <h1 className="error-title">Trang không tồn tại</h1>
            <p className="error-description">
              Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
              <br />
              Trang có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
            </p>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Button 
                type="primary" 
                size="large"
                icon={<HomeOutlined />}
                onClick={() => navigate('/')}
                className="btn-primary"
              >
                Về trang chủ
              </Button>
              <Button 
                size="large"
                icon={<SearchOutlined />}
                onClick={() => navigate('/services')}
                className="btn-secondary"
              >
                Dịch vụ y tế
              </Button>
            </div>

            {/* Quick Links */}
            <div className="quick-links">
              <span className="links-label">Liên kết hữu ích:</span>
              <div className="links-group">
                <a onClick={() => navigate('/about')} className="link-item">
                  Về chúng tôi
                </a>
                <a onClick={() => navigate('/doctors')} className="link-item">
                  Đội ngũ bác sĩ
                </a>
                <a onClick={() => navigate('/news')} className="link-item">
                  Tin tức y khoa
                </a>
                <a onClick={() => navigate('/appointments')} className="link-item">
                  Đặt lịch khám
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="support-info">
          <PhoneOutlined className="support-icon" />
          <span>Cần hỗ trợ? Gọi ngay: <strong>19005656</strong></span>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
