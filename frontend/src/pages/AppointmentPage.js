import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, DatePicker, Select, Row, Col, Typography, message, Avatar, Rate, Space } from 'antd';
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { doctorAPI, appointmentAPI } from '../services/api';
import '../styles/appointment.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

function AppointmentPage({ user }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await doctorAPI.getActiveDoctors();
      setDoctors(response.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorChange = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    setSelectedDoctor(doctor);
  };

  const onFinish = async (values) => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để đặt lịch!');
      navigate('/login');
      return;
    }
    setSubmitLoading(true);
    try {
      const appointmentData = {
        patientId: user.id,
        doctorId: values.doctor,
        appointmentDate: values.date.format('YYYY-MM-DD'),
        timeSlot: values.time,
        notes: values.notes || '',
        status: 'PENDING'
      };
      await appointmentAPI.createAppointment(appointmentData);
      message.success('Đặt lịch thành công! Vui lòng chờ bác sĩ xác nhận.');
      form.resetFields();
      setSelectedDoctor(null);
    } catch (error) {
      message.error(error.response?.data?.message || 'Đặt lịch thất bại!');
    } finally {
      setSubmitLoading(false);
    }
  };

  const timeSlots = [
    '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00',
    '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'
  ];

  return (
    <div className="appointment-page">
      <div className="appointment-container">
        <div className="appointment-header">
          <Title level={2}>Đặt lịch khám</Title>
          <Text>Điền thông tin để đặt lịch khám với bác sĩ chuyên khoa</Text>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card className="appointment-form-card" bordered={false}>
              <div className="ant-card-head">
                <div className="ant-card-head-title">Thông tin đặt lịch</div>
              </div>
              <Form 
                form={form} 
                onFinish={onFinish} 
                layout="vertical"
                className="appointment-form"
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="patientName"
                      label="Họ và tên"
                      rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                      initialValue={user ? `${user.firstName} ${user.lastName}` : ''}
                    >
                      <Input size="large" prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phone"
                      label="Số điện thoại"
                      rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                      initialValue={user?.phone || ''}
                    >
                      <Input size="large" prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                  initialValue={user?.email || ''}
                >
                  <Input size="large" prefix={<MailOutlined />} placeholder="Nhập email" />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="doctor"
                      label="Chọn bác sĩ"
                      rules={[{ required: true, message: 'Vui lòng chọn bác sĩ!' }]}
                    >
                      <Select 
                        placeholder="Chọn bác sĩ" 
                        size="large"
                        onChange={handleDoctorChange}
                        loading={loading}
                      >
                        {doctors.map((doctor) => (
                          <Option key={doctor.id} value={doctor.id}>
                            {doctor.user?.firstName} {doctor.user?.lastName} - {doctor.specialization}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="date"
                      label="Ngày khám"
                      rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                    >
                      <DatePicker 
                        size="large" 
                        style={{ width: '100%' }} 
                        placeholder="Chọn ngày khám"
                        disabledDate={(current) => current && current < new Date().setHours(0,0,0,0)}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="time"
                  label="Khung giờ khám"
                  rules={[{ required: true, message: 'Vui lòng chọn khung giờ!' }]}
                >
                  <Select placeholder="Chọn khung giờ" size="large">
                    {timeSlots.map((time) => (
                      <Option key={time} value={time}>
                        <div className="time-slot-option">
                          <ClockCircleOutlined />
                          <span>{time}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="notes" label="Ghi chú (không bắt buộc)">
                  <TextArea 
                    rows={4} 
                    placeholder="Mô tả triệu chứng hoặc yêu cầu đặc biệt..."
                    maxLength={500}
                    showCount
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={submitLoading} 
                    block 
                    size="large"
                    className="appointment-submit-btn"
                    icon={<CalendarOutlined />}
                  >
                    Xác nhận đặt lịch
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="doctor-info-card" bordered={false}>
              <div className="ant-card-head">
                <div className="ant-card-head-title">Thông tin bác sĩ</div>
              </div>
              {selectedDoctor ? (
                <div>
                  <div className="doctor-avatar-section">
                    <Avatar 
                      size={80} 
                      src={selectedDoctor.user?.profileImage}
                      icon={<UserOutlined />}
                    />
                    <div className="doctor-name">
                      {selectedDoctor.user?.firstName} {selectedDoctor.user?.lastName}
                    </div>
                    <div className="doctor-specialty">{selectedDoctor.specialization}</div>
                  </div>
                  
                  <div className="doctor-info-item">
                    <span className="doctor-info-label">Kinh nghiệm</span>
                    <div className="doctor-info-value">{selectedDoctor.experienceYears || 0} năm</div>
                  </div>
                  
                  <div className="doctor-info-item">
                    <span className="doctor-info-label">Phí tư vấn</span>
                    <div className="doctor-info-value doctor-fee">
                      {selectedDoctor.consultationFee?.toLocaleString() || 0} VNĐ
                    </div>
                  </div>
                  
                  <div className="doctor-info-item">
                    <span className="doctor-info-label">Đánh giá</span>
                    <div>
                      <Rate disabled value={selectedDoctor.ratingScore || 0} style={{ fontSize: 16 }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="doctor-placeholder">
                  <Text type="secondary">Chọn bác sĩ để xem thông tin chi tiết</Text>
                </div>
              )}
            </Card>

            <Card className="guide-card" bordered={false}>
              <div className="ant-card-head">
                <div className="ant-card-head-title">Hướng dẫn</div>
              </div>
              <ul className="guide-list">
                <li>Chọn bác sĩ phù hợp với chuyên khoa</li>
                <li>Chọn ngày và giờ khám thuận tiện</li>
                <li>Điền đầy đủ thông tin liên hệ</li>
                <li>Chờ bác sĩ xác nhận lịch hẹn</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default AppointmentPage;
