import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Checkbox } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import webSocketService from '../services/websocket';
import { useCart } from '../contexts/CartContext';
import loginBackground from '../assets/login-background.jpg';
import '../styles/login.css';

const { Title, Text, Link } = Typography;

function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { mergeCart } = useCart();

  const onFinishLogin = async (values) => {
    setLoading(true);
    try {
      const response = await userAPI.login(values.email, values.password);
      const userData = response.data;

      // Check if login was successful
      if (!userData || !userData.token) {
        message.error('Email hoặc mật khẩu không đúng!');
        return;
      }

      // Save token to localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('sessionId', userData.sessionId);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userFirstName', userData.firstName);
      localStorage.setItem('userLastName', userData.lastName);
      localStorage.setItem('userRole', userData.role);
      if (userData.profileImage) {
        localStorage.setItem('profileImageUrl', userData.profileImage);
      }
      console.log('Token saved to localStorage');

      // Connect to WebSocket for real-time status
      if (userData.sessionId) {
        webSocketService.connect(userData.id, userData.sessionId, (status) => {
          console.log('WebSocket status update:', status);
        });
        console.log('WebSocket connected for user:', userData.id);
      }

      // Merge cart from localStorage into database
      await mergeCart(userData.id);

      onLogin(userData);
      message.success('Đăng nhập thành công!');
      
      // Check if there's a redirect path
      const redirectPath = localStorage.getItem('redirect_after_login');
      if (redirectPath) {
        localStorage.removeItem('redirect_after_login');
        navigate(redirectPath);
      } else {
        navigate(userData.role === 'ADMIN' ? '/admin' : '/');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.error || 'Email hoặc mật khẩu không đúng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left" style={{ backgroundImage: `url(${loginBackground})` }}>
        <div className="login-brand">
          <div className="brand-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#0066FF"/>
              <path d="M24 14v20M14 24h20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <h1>KHAMNOW</h1>
          <p>Hệ thống quản lý khám bệnh trực tuyến</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <div className="login-header">
            <Title level={3}>Đăng nhập</Title>
            <Text type="secondary">Nhập thông tin để tiếp tục</Text>
          </div>

          <Form name="login" onFinish={onFinishLogin} layout="vertical">
            <Form.Item 
              label="Email" 
              name="email" 
              rules={[{ required: true, message: 'Vui lòng nhập email!', type: 'email' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="your@email.com" size="large" />
            </Form.Item>

            <Form.Item 
              label="Mật khẩu" 
              name="password" 
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" size="large" />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              <Link>Quên mật khẩu?</Link>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block size="large">
                Đăng nhập
              </Button>
            </Form.Item>

            <div className="login-footer">
              <Text type="secondary">Chưa có tài khoản? </Text>
              <Link onClick={() => navigate('/register')}>Đăng ký ngay</Link>
            </div>
          </Form>

          <div className="login-back">
            <Link onClick={() => navigate('/')}>← Quay về trang chủ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
