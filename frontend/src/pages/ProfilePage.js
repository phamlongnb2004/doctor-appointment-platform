import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Input, Button, message, Avatar, Upload, Divider, Tag, Row, Col, Typography, Spin, Modal } from 'antd';
import { UploadOutlined, UserOutlined, PictureOutlined, CameraOutlined, MedicineBoxOutlined, CalendarOutlined, LockOutlined } from '@ant-design/icons';
import { userAPI, appointmentAPI } from '../services/api';
import useFallingFlowers from '../hooks/useFallingFlowers';
import '../styles/animations.css';

const { Title, Text, Paragraph } = Typography;

function ProfilePage({ user, onUserUpdate }) {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profileImageLoading, setProfileImageLoading] = useState(false);
  const [coverImageLoading, setCoverImageLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(user?.profileImage || null);
  const [previewCover, setPreviewCover] = useState(user?.coverImage || null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const flowerContainerRef = useFallingFlowers(15);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    setAppointmentsLoading(true);
    try {
      let response;
      if (user?.role === 'DOCTOR') {
        response = await appointmentAPI.getAppointmentsByDoctor(user.id);
      } else {
        response = await appointmentAPI.getAppointmentsByPatient(user.id);
      }
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await userAPI.updateUser(user.id, values);
      message.success('Cập nhật thông tin thành công!');
      if (onUserUpdate) {
        onUserUpdate({ ...user, ...values });
      }
    } catch (error) {
      message.error('Cập nhật thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageUpload = async (file) => {
    console.log('Starting profile image upload...');
    console.log('User ID:', user?.id);
    console.log('File:', file.name, file.size, file.type);
    setProfileImageLoading(true);
    try {
      const response = await userAPI.uploadProfileImage(user.id, file);
      console.log('Upload response:', response.data);
      if (response.data && response.data.profileImage) {
        setPreviewImage(response.data.profileImage);
        message.success('Cập nhật ảnh đại diện thành công!');
        if (onUserUpdate) {
          onUserUpdate({ ...user, profileImage: response.data.profileImage });
        }
      }
      return response;
    } catch (error) {
      console.error('Upload error:', error.response || error);
      message.error('Tải ảnh thất bại: ' + (error.response?.data?.error || error.message));
      throw error;
    } finally {
      setProfileImageLoading(false);
    }
  };

  const handleCoverImageUpload = async (file) => {
    console.log('Starting cover image upload...');
    console.log('User ID:', user?.id);
    console.log('File:', file.name, file.size, file.type);
    setCoverImageLoading(true);
    try {
      const response = await userAPI.uploadCoverImage(user.id, file);
      console.log('Upload response:', response.data);
      if (response.data && response.data.coverImage) {
        setPreviewCover(response.data.coverImage);
        message.success('Cập nhật ảnh bìa thành công!');
        if (onUserUpdate) {
          onUserUpdate({ ...user, coverImage: response.data.coverImage });
        }
      }
      return response;
    } catch (error) {
      console.error('Upload error:', error.response || error);
      message.error('Tải ảnh thất bại: ' + (error.response?.data?.error || error.message));
      throw error;
    } finally {
      setCoverImageLoading(false);
    }
  };

  const getRoleTagColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'red';
      case 'DOCTOR': return 'blue';
      case 'CONSULTANT': return 'green';
      case 'PATIENT': return 'cyan';
      default: return 'default';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị viên';
      case 'DOCTOR': return 'Bác sĩ';
      case 'CONSULTANT': return 'Tư vấn viên';
      case 'PATIENT': return 'Bệnh nhân';
      default: return role;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': case 'Đã khám': return 'green';
      case 'PENDING': case 'Sắp khám': return 'blue';
      case 'CANCELLED': case 'Đã hủy': return 'red';
      case 'CONFIRMED': return 'cyan';
      default: return 'default';
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'COMPLETED': return 'Đã khám';
      case 'PENDING': return 'Chờ xác nhận';
      case 'CANCELLED': return 'Đã hủy';
      case 'CONFIRMED': return 'Đã xác nhận';
      default: return status;
    }
  };

  const handleChangePassword = async (values) => {
    setPasswordLoading(true);
    try {
      await userAPI.changePassword(user.id, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      message.success('Đổi mật khẩu thành công!');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error(error.response?.data?.error || 'Đổi mật khẩu thất bại!');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Stats from real appointments
  const completedCount = appointments.filter(a => a.status === 'COMPLETED').length;
  const upcomingCount = appointments.filter(a => ['PENDING', 'CONFIRMED'].includes(a.status)).length;

  return (
    <div ref={flowerContainerRef} className="profile-page" style={{ padding: '0 24px 50px 24px' }}>
      {/* Cover Image Section */}
      <div className="cover-section" style={{ position: 'relative', height: 280 }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: previewCover ? `url(${previewCover}) center/cover no-repeat` : 'linear-gradient(135deg, #003a70 0%, #0066cc 100%)',
          transition: 'all 0.3s ease'
        }}></div>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 100%)' 
        }}></div>
        <Upload 
          showUploadList={false} 
          accept="image/*"
          customRequest={({ file, onSuccess, onError }) => {
            handleCoverImageUpload(file)
              .then(() => onSuccess('OK'))
              .catch((err) => onError(err));
          }}
        >
          <Button 
            type="primary" 
            icon={<CameraOutlined />}
            loading={coverImageLoading}
            style={{ position: 'absolute', bottom: 20, right: 20, background: '#003a70', borderColor: '#003a70' }}
          >
            Đổi ảnh bìa
          </Button>
        </Upload>
      </div>

      {/* Profile Header */}
      <div style={{ maxWidth: 1000, margin: '-60px auto 0', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <Row gutter={24}>
          <Col span={24}>
            <div style={{ padding: 32, borderRadius: 16, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                {/* Avatar */}
                <div style={{ position: 'relative' }}>
                  <div style={{ 
                    width: 140, 
                    height: 140, 
                    borderRadius: '50%', 
                    overflow: 'hidden',
                    border: '5px solid #fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f0f0f0'
                  }}>
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Profile" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        key={previewImage} // Force re-render when image changes
                        onError={(e) => {
                          console.log('Error loading profile image:', previewImage);
                          e.target.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('Profile image loaded successfully:', previewImage);
                        }}
                      />
                    ) : (
                      <UserOutlined style={{ fontSize: 60, color: '#999' }} />
                    )}
                  </div>
      <Upload 
        showUploadList={false} 
        accept="image/*"
        customRequest={({ file, onSuccess, onError }) => {
          handleProfileImageUpload(file)
            .then(() => onSuccess('OK'))
            .catch((err) => onError(err));
        }}
      >
        <div style={{
                      position: 'absolute', 
                      bottom: 0, 
                      right: 0, 
                      width: 44, 
                      height: 44, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      cursor: 'pointer',
                      background: '#fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                      <CameraOutlined style={{ fontSize: 18, color: '#003a70' }} />
                    </div>
                  </Upload>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 300 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <h2 style={{ margin: 0, fontSize: 28 }}>{user?.firstName} {user?.lastName}</h2>
                    <Tag color={getRoleTagColor(user?.role)} className="tag-beautiful">
                      {getRoleDisplayName(user?.role)}
                    </Tag>
                  </div>
                  <p style={{ color: '#666', margin: '8px 0 16px' }}>{user?.email}</p>
                  <div style={{ display: 'flex', gap: 24 }}>
                    <div>
                      <span style={{ color: '#999', fontSize: 13 }}>Số điện thoại</span>
                      <p style={{ margin: 4, fontWeight: 500 }}>{user?.phone || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <span style={{ color: '#999', fontSize: 13 }}>Trạng thái</span>
                      <p style={{ margin: 4, fontWeight: 500, color: '#52c41a' }}>Hoạt động</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Form Section */}
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col xs={24} lg={16}>
            <Card title="Thông tin cá nhân" bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              <Form form={form} onFinish={onFinish} layout="vertical" initialValues={user}>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Họ" name="firstName" rules={[{ required: true }]}>
                      <Input className="input-beautiful" placeholder="Nhập họ" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Tên" name="lastName" rules={[{ required: true }]}>
                      <Input className="input-beautiful" placeholder="Nhập tên" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Email" name="email">
                  <Input className="input-beautiful" disabled />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="phone">
                  <Input className="input-beautiful" placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item label="Vai trò">
                  <Tag color={getRoleTagColor(user?.role)} style={{ fontSize: 14, padding: '4px 12px' }}>
                    {getRoleDisplayName(user?.role)}
                  </Tag>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} size="large" style={{ background: '#003a70', borderColor: '#003a70' }}>
                    Lưu thay đổi
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            {/* Stats Card */}
            <Card bordered={false} style={{ borderRadius: 16, marginBottom: 24, background: 'linear-gradient(135deg, #003a70 0%, #0066cc 100%)', color: '#fff', boxShadow: '0 4px 16px rgba(0,58,112,0.2)' }}>
              <Row gutter={16}>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Title level={3} style={{ color: '#fff', margin: 0 }}>{completedCount}</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Đã khám</Text>
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Title level={3} style={{ color: '#fff', margin: 0 }}>{upcomingCount}</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Sắp khám</Text>
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Title level={3} style={{ color: '#fff', margin: 0 }}>{appointments.length}</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Tổng</Text>
                </Col>
              </Row>
            </Card>

            {/* Appointment History */}
            <Card title="Lịch sử khám" bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              {appointmentsLoading ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <Spin />
                </div>
              ) : appointments.length > 0 ? (
                appointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} style={{ 
                    padding: '12px 0', 
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <Text strong style={{ color: '#1a1a2e' }}>
                        {user?.role === 'DOCTOR' 
                          ? `Bệnh nhân: ${appointment.patient?.firstName || 'N/A'}`
                          : `BS: ${appointment.doctor?.user?.firstName || 'N/A'} ${appointment.doctor?.user?.lastName || ''}`
                        }
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {appointment.appointmentDate} • {appointment.timeSlot}
                      </Text>
                    </div>
                    <Tag color={getStatusColor(appointment.status)}>{getStatusDisplay(appointment.status)}</Tag>
                  </div>
                ))
              ) : (
                <Text type="secondary" style={{ textAlign: 'center', display: 'block', padding: 20 }}>
                  Chưa có lịch hẹn nào
                </Text>
              )}
            </Card>

            {/* Security */}
            <Card title="Bảo mật" bordered={false} style={{ borderRadius: 16, marginTop: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              <p style={{ color: '#666', marginBottom: 16 }}>Thay đổi mật khẩu để bảo vệ tài khoản</p>
              <Button 
                block 
                icon={<LockOutlined />}
                onClick={() => setPasswordModalVisible(true)}
                style={{ background: '#003a70', color: '#fff', borderColor: '#003a70' }}
              >
                Đổi mật khẩu
              </Button>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Change Password Modal */}
      <Modal
        title="Đổi mật khẩu"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={passwordForm}
          onFinish={handleChangePassword}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu hiện tại"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu mới"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={passwordLoading}
              block
              size="large"
              style={{ background: '#003a70', borderColor: '#003a70' }}
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ProfilePage;
