import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import {
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  EditOutlined
} from '@ant-design/icons';
import '../styles/doctor-dashboard.css';

const DoctorDashboard = () => {
  return (
    <div className="doctor-dashboard">
      <div className="page-header">
        <h1>Bảng Điều Khiển Bác Sĩ</h1>
        <p>Quản lý thông tin và hoạt động của bạn</p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Link to="/doctor/revenue">
            <Card hoverable className="dashboard-card">
              <div className="card-icon" style={{ background: '#52c41a' }}>
                <DollarOutlined />
              </div>
              <h3>Doanh Thu Của Tôi</h3>
              <p>Xem thống kê doanh thu và cuộc hẹn</p>
            </Card>
          </Link>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Link to="/appointments">
            <Card hoverable className="dashboard-card">
              <div className="card-icon" style={{ background: '#1890ff' }}>
                <CalendarOutlined />
              </div>
              <h3>Cuộc Hẹn</h3>
              <p>Quản lý lịch hẹn khám bệnh</p>
            </Card>
          </Link>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Link to="/doctor/profile-edit">
            <Card hoverable className="dashboard-card">
              <div className="card-icon" style={{ background: '#722ed1' }}>
                <EditOutlined />
              </div>
              <h3>Chỉnh Sửa Hồ Sơ</h3>
              <p>Cập nhật thông tin cá nhân</p>
            </Card>
          </Link>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Link to="/doctor/articles">
            <Card hoverable className="dashboard-card">
              <div className="card-icon" style={{ background: '#fa8c16' }}>
                <FileTextOutlined />
              </div>
              <h3>Bài Viết Của Tôi</h3>
              <p>Quản lý bài viết y khoa</p>
            </Card>
          </Link>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Link to="/profile">
            <Card hoverable className="dashboard-card">
              <div className="card-icon" style={{ background: '#13c2c2' }}>
                <UserOutlined />
              </div>
              <h3>Thông Tin Cá Nhân</h3>
              <p>Xem hồ sơ cá nhân</p>
            </Card>
          </Link>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Link to="/chat">
            <Card hoverable className="dashboard-card">
              <div className="card-icon" style={{ background: '#eb2f96' }}>
                <FileTextOutlined />
              </div>
              <h3>Tin Nhắn</h3>
              <p>Trò chuyện với bệnh nhân</p>
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorDashboard;
