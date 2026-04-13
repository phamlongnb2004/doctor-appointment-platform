import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Button, message, Modal } from 'antd';
import { CalendarOutlined, PhoneOutlined, MailOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

function QuickBookingForm({ visible, onClose }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const specialties = [
    'Nội khoa',
    'Ngoại khoa',
    'Nhi khoa',
    'Sản phụ khoa',
    'Tim mạch',
    'Tiêu hóa',
    'Thần kinh',
    'Da liễu',
    'Tai mũi họng',
    'Mắt',
    'Răng hàm mặt',
    'Chỉnh hình',
    'Ung bướu',
    'Khác'
  ];

  const timeSlots = [
    { value: 'MORNING', label: 'Buổi sáng (8:00 - 12:00)' },
    { value: 'AFTERNOON', label: 'Buổi chiều (13:00 - 17:00)' },
    { value: 'EVENING', label: 'Buổi tối (17:00 - 20:00)' }
  ];

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      const requestData = {
        patientName: values.patientName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        specialty: values.specialty,
        symptoms: values.symptoms || '',
        preferredDate: values.preferredDate.toISOString(),
        preferredTime: values.preferredTime
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/quick-bookings`, requestData);
      
      message.success('Đặt lịch nhanh thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
      form.resetFields();
      onClose();
      
    } catch (error) {
      console.error('Error creating quick booking:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const disabledDate = (current) => {
    // Không cho chọn ngày trong quá khứ
    return current && current < dayjs().startOf('day');
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <span style={{ fontSize: 20, fontWeight: 600 }}>Đặt lịch khám nhanh</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnHidden
    >
      <div style={{ padding: '16px 0' }}>
        <p style={{ marginBottom: 24, color: '#595959' }}>
          Vui lòng điền thông tin bên dưới, chúng tôi sẽ liên hệ với bạn để xác nhận lịch khám.
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
        >
          <Form.Item
            name="patientName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input 
              size="large" 
              placeholder="Nguyễn Văn A"
              prefix={<MedicineBoxOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <Input 
              size="large" 
              placeholder="0912345678"
              prefix={<PhoneOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input 
              size="large" 
              placeholder="example@email.com"
              prefix={<MailOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="specialty"
            label="Chuyên khoa"
            rules={[{ required: true, message: 'Vui lòng chọn chuyên khoa' }]}
          >
            <Select 
              size="large" 
              placeholder="Chọn chuyên khoa"
              showSearch
              optionFilterProp="children"
            >
              {specialties.map(specialty => (
                <Option key={specialty} value={specialty}>{specialty}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="symptoms"
            label="Triệu chứng / Lý do khám"
          >
            <TextArea 
              rows={3}
              placeholder="Mô tả triệu chứng hoặc lý do khám bệnh..."
            />
          </Form.Item>

          <Form.Item
            name="preferredDate"
            label="Ngày khám mong muốn"
            rules={[{ required: true, message: 'Vui lòng chọn ngày khám' }]}
          >
            <DatePicker 
              size="large"
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
              disabledDate={disabledDate}
            />
          </Form.Item>

          <Form.Item
            name="preferredTime"
            label="Thời gian khám mong muốn"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
          >
            <Select size="large" placeholder="Chọn thời gian">
              {timeSlots.map(slot => (
                <Option key={slot.value} value={slot.value}>{slot.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              block
              loading={loading}
              style={{ 
                height: 48,
                fontSize: 16,
                fontWeight: 600
              }}
            >
              Gửi yêu cầu đặt lịch
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default QuickBookingForm;
