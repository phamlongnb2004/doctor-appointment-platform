import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, DatePicker, Select, Row, Col, Typography, message, Avatar, Rate } from 'antd';
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
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
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
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
    // Reset time slot when doctor changes
    form.setFieldsValue({ time: undefined });
    // Fetch available slots if date is already selected
    if (selectedDate && doctorId) {
      fetchAvailableSlots(doctorId, selectedDate);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Reset time slot when date changes
    form.setFieldsValue({ time: undefined });
    // Fetch available slots if doctor is already selected
    const doctorId = form.getFieldValue('doctor');
    if (doctorId && date) {
      fetchAvailableSlots(doctorId, date);
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    setSlotsLoading(true);
    try {
      const dateStr = date.format('YYYY-MM-DD');
      const response = await appointmentAPI.getAvailableSlots(doctorId, dateStr);
      setAvailableSlots(response.data.availableSlots || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      message.error('Không thể tải khung giờ khám!');
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const onFinish = async (values) => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để đặt lịch!');
      navigate('/login');
      return;
    }
    
    // Validate time slot
    if (!values.time) {
      message.error('Vui lòng chọn khung giờ khám!');
      return;
    }
    
    setSubmitLoading(true);
    try {
      // Parse time slot to get hour
      const timeSlot = values.time; // e.g., "08:00 - 09:00"
      const startTime = timeSlot.split(' - ')[0]; // "08:00"
      const [hour, minute] = startTime.split(':');
      
      if (!hour || !minute) {
        message.error('Khung giờ không hợp lệ!');
        setSubmitLoading(false);
        return;
      }
      
      // Combine date and time - create new date object
      const selectedDate = values.date.toDate(); // Convert to native Date
      const [hourNum, minuteNum] = [parseInt(hour), parseInt(minute)];
      
      // Create new Date with correct time
      const appointmentDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        hourNum,
        minuteNum,
        0,
        0
      );
      
      console.log('Time slot selected:', timeSlot);
      console.log('Parsed hour:', hourNum, 'minute:', minuteNum);
      console.log('Selected date:', selectedDate);
      console.log('Appointment DateTime:', appointmentDateTime);
      console.log('ISO String:', appointmentDateTime.toISOString());
      
      const appointmentData = {
        patientId: user.id,
        doctorId: values.doctor,
        appointmentDateTime: appointmentDateTime.toISOString(),
        reason: values.notes || '',
        notes: values.notes || ''
      };
      
      await appointmentAPI.createAppointment(appointmentData);
      message.success('Đặt lịch thành công! Vui lòng chờ bác sĩ xác nhận.');
      form.resetFields();
      setSelectedDoctor(null);
    } catch (error) {
      console.error('Error creating appointment:', error);
      message.error(error.response?.data?.error || 'Đặt lịch thất bại!');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="appointment-page">
      <div className="appointment-container">
        <div className="appointment-header">
          <Title level={2}>Đặt lịch khám</Title>
          <Text>Điền thông tin để đặt lịch khám với bác sĩ chuyên khoa</Text>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card className="appointment-form-card" variant="outlined">
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
                        placeholder="Tìm kiếm hoặc chọn bác sĩ..." 
                        size="large"
                        onChange={handleDoctorChange}
                        loading={loading}
                        showSearch
                        filterOption={(input, option) => {
                          const searchText = input.toLowerCase();
                          // Get the label from option props
                          const label = option.label || '';
                          return label.toLowerCase().includes(searchText);
                        }}
                      >
                        {doctors.map((doctor) => (
                          <Option 
                            key={doctor.id} 
                            value={doctor.id}
                            label={`${doctor.firstName} ${doctor.lastName} - ${doctor.specialization}`}
                          >
                            {doctor.firstName} {doctor.lastName} - {doctor.specialization}
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
                        onChange={handleDateChange}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="time"
                  label="Khung giờ khám"
                  rules={[{ required: true, message: 'Vui lòng chọn khung giờ!' }]}
                >
                  <Select 
                    placeholder={
                      !form.getFieldValue('doctor') || !selectedDate
                        ? "Vui lòng chọn bác sĩ và ngày khám trước"
                        : slotsLoading
                        ? "Đang tải khung giờ..."
                        : availableSlots.length === 0
                        ? "Không có khung giờ trống"
                        : "Chọn khung giờ"
                    }
                    size="large"
                    loading={slotsLoading}
                    disabled={!form.getFieldValue('doctor') || !selectedDate || slotsLoading}
                  >
                    {availableSlots.map((time) => (
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
            <Card className="doctor-info-card" variant="outlined">
              <div className="ant-card-head">
                <div className="ant-card-head-title">Thông tin bác sĩ</div>
              </div>
              {selectedDoctor ? (
                <div>
                  <div className="doctor-avatar-section">
                    <Avatar 
                      size={80} 
                      src={selectedDoctor.profileImage}
                      icon={<UserOutlined />}
                    />
                    <div className="doctor-name">
                      {selectedDoctor.firstName} {selectedDoctor.lastName}
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

            <Card className="guide-card" variant="outlined">
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
