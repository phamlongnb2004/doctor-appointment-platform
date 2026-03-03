import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import loginBackground from '../assets/login-background.jpg';
import '../styles/login.css';

const { Title, Text, Link } = Typography;

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinishRegister = async (values) => {
    setLoading(true);
    try {
      await userAPI.register({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        role: 'PATIENT'
      });
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.error || 'Đăng ký thất bại!');
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
            <Title level={3}>Tạo tài khoản</Title>
            <Text type="secondary">Điền thông tin để tạo tài khoản mới</Text>
          </div>

          <Form name="register" onFinish={onFinishRegister} layout="vertical">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item 
                label="Họ" 
                name="firstName" 
                rules={[{ required: true, message: 'Nhập họ!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Họ" size="large" />
              </Form.Item>

              <Form.Item 
                label="Tên" 
                name="lastName" 
                rules={[{ required: true, message: 'Nhập tên!' }]}
              >
                <Input placeholder="Tên" size="large" />
              </Form.Item>
            </div>

            <Form.Item 
              label="Email" 
              name="email" 
              rules={[{ required: true, message: 'Nhập email!', type: 'email' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="your@email.com" size="large" />
            </Form.Item>

            <Form.Item 
              label="Số điện thoại" 
              name="phone" 
              rules={[{ required: true, message: 'Nhập số điện thoại!' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="0123456789" size="large" />
            </Form.Item>

            <Form.Item 
              label="Mật khẩu" 
              name="password" 
              rules={[{ required: true, message: 'Nhập mật khẩu!', min: 6 }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Tối thiểu 6 ký tự" size="large" />
            </Form.Item>

            <Form.Item 
              label="Xác nhận mật khẩu" 
              name="confirmPassword" 
              dependencies={['password']} 
              rules={[
                { required: true, message: 'Xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  }
                })
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" size="large" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block size="large">
                Đăng ký
              </Button>
            </Form.Item>

            <div className="login-footer">
              <Text type="secondary">Đã có tài khoản? </Text>
              <Link onClick={() => navigate('/login')}>Đăng nhập</Link>
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

export default RegisterPage;
