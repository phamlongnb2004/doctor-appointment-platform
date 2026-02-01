import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, DatePicker, Select, Row, Col, Typography, Divider, message, Avatar, Rate, Space } from 'antd';
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { doctorAPI, appointmentAPI, userAPI } from '../services/api';
import useFallingFlowers from '../hooks/useFallingFlowers';
import '../styles/animations.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

function AppointmentPage({ user }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();
  const flowerContainerRef = useFallingFlowers(5);

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
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

  const fetchSpecializations = async () => {
    // Get unique specializations from doctors
    const response = await doctorAPI.getAllDoctors();
    const docs = response.data || [];
    const specs = [...new Set(docs.map(d => d.specialization).filter(Boolean))];
    setSpecializations(specs);
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
      message.success({
        content: (
          <div>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
            Đặt lịch thành công! Vui lòng chờ bác sĩ xác nhận.
          </div>
        ),
        duration: 5
      });
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
    <div ref={flowerContainerRef} style={{ minHeight: '100vh', padding: '40px 50px', background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 8 }}>
          📅 Đặt Lịch Khám
        </Title>
        <Text style={{ textAlign: 'center', display: 'block', color: '#666', marginBottom: 32 }}>
          Điền thông tin bên dưới để đặt lịch khám với bác sĩ
        </Text>

        <Row gutter={32}>
          <Col xs={24} lg={16}>
            <Card title="Thông Tin Đặt Lịch" style={{ borderRadius: 16, marginBottom: 24 }}>
              <Form form={form} onFinish={onFinish} layout="vertical">
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="patientName"
                      label="Họ tên bệnh nhân"
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
                      <Input size="large" placeholder="Nhập số điện thoại" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, type: 'email' }]}
                  initialValue={user?.email || ''}
                >
                  <Input size="large" placeholder="Nhập email" />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="doctor"
                      label="Bác sĩ"
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
                  label="Khung giờ"
                  rules={[{ required: true, message: 'Vui lòng chọn khung giờ!' }]}
                >
                  <Select placeholder="Chọn khung giờ" size="large">
                    {timeSlots.map((time) => (
                      <Option key={time} value={time}>
                        <Space>
                          <ClockCircleOutlined />
                          {time}
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="notes" label="Ghi chú">
                  <TextArea rows={3} placeholder="Mô tả triệu chứng hoặc yêu cầu đặc biệt..." />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={submitLoading} 
                    block 
                    size="large"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', height: 48, fontSize: 16 }}
                    icon={<CalendarOutlined />}
                  >
                    Xác Nhận Đặt Lịch
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Thông Tin Bác Sĩ" style={{ borderRadius: 16, position: 'sticky', top: 20 }}>
              {selectedDoctor ? (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <Avatar 
                      size={80} 
                      src={selectedDoctor.user?.profileImage}
                      icon={<UserOutlined />}
                      style={{ border: '3px solid #667eea' }}
                    />
                    <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>
                      {selectedDoctor.user?.firstName} {selectedDoctor.user?.lastName}
                    </Title>
                    <Text type="secondary">{selectedDoctor.specialization}</Text>
                  </div>
                  <Divider />
                  <div style={{ marginBottom: 12 }}>
                    <Text type="secondary">Kinh nghiệm:</Text>
                    <br />
                    <Text strong>{selectedDoctor.experienceYears || 0} năm</Text>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <Text type="secondary">Phí tư vấn:</Text>
                    <br />
                    <Text strong style={{ color: '#667eea', fontSize: 18 }}>
                      {selectedDoctor.consultationFee?.toLocaleString() || 0} VNĐ
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary">Đánh giá:</Text>
                    <br />
                    <Rate disabled value={selectedDoctor.ratingScore || 0} />
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <Text type="secondary">Vui lòng chọn bác sĩ để xem thông tin</Text>
                </div>
              )}
            </Card>

            <Card title="Hướng dẫn" style={{ borderRadius: 16, marginTop: 16 }}>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li style={{ marginBottom: 8 }}>Chọn bác sĩ phù hợp</li>
                <li style={{ marginBottom: 8 }}>Chọn ngày và giờ khám</li>
                <li style={{ marginBottom: 8 }}>Điền thông tin liên hệ</li>
                <li>Chờ bác sĩ xác nhận</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default AppointmentPage;
