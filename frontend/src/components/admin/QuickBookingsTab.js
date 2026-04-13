import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Modal, Select, Input, message, Tabs, DatePicker } from 'antd';
import { EyeOutlined, UserAddOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

function QuickBookingsTab({ isDoctorView = false }) {
  const [bookings, setBookings] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [confirmedDateTime, setConfirmedDateTime] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);

  useEffect(() => {
    fetchBookings();
    if (!isDoctorView) {
      fetchDoctors();
    }
  }, [isDoctorView]);

  useEffect(() => {
    // Khi mở modal phân công, load bác sĩ theo chuyên khoa
    if (assignModalVisible && selectedBooking && !isDoctorView) {
      fetchDoctorsBySpecialty(selectedBooking.specialty);
    }
  }, [assignModalVisible, selectedBooking, isDoctorView]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = `${process.env.REACT_APP_API_URL}/quick-bookings`;
      
      // Nếu là doctor view, chỉ lấy bookings của bác sĩ đó
      if (isDoctorView) {
        const userId = localStorage.getItem('userId');
        // Lấy doctorId từ userId
        const doctorResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/doctors/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const doctorId = doctorResponse.data.id;
        url = `${process.env.REACT_APP_API_URL}/quick-bookings/doctor/${doctorId}`;
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách đặt lịch nhanh');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/doctors/active/all`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchDoctorsBySpecialty = async (specialty) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/doctors/active/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Lọc bác sĩ theo chuyên khoa
      const filteredDoctors = specialty 
        ? response.data.filter(doctor => 
            doctor.specialization && 
            doctor.specialization.toLowerCase().includes(specialty.toLowerCase())
          )
        : response.data;
      
      setDoctors(filteredDoctors);
      setAvailableDoctors(filteredDoctors);
    } catch (error) {
      console.error('Error fetching doctors by specialty:', error);
    }
  };

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setDetailModalVisible(true);
  };

  const handleAssignDoctor = (booking) => {
    setSelectedBooking(booking);
    setSelectedDoctorId(null);
    setAdminNotes('');
    setConfirmedDateTime(booking.preferredDate ? dayjs(booking.preferredDate) : null);
    setAvailableDoctors([]); // Reset available doctors
    setAssignModalVisible(true);
  };

  const fetchAvailableDoctors = async (dateTime, specialty) => {
    if (!dateTime) {
      setAvailableDoctors(doctors); // Show all if no time selected
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/doctors/available`,
        {
          params: {
            dateTime: dateTime.toISOString(),
            specialty: specialty || undefined
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAvailableDoctors(response.data);
      
      // If selected doctor is not available, clear selection
      if (selectedDoctorId && !response.data.find(d => d.id === selectedDoctorId)) {
        setSelectedDoctorId(null);
        message.warning('Bác sĩ đã chọn không có sẵn vào thời gian này');
      }
    } catch (error) {
      console.error('Error fetching available doctors:', error);
      setAvailableDoctors(doctors); // Fallback to all doctors
    }
  };

  const handleDateTimeChange = (dateTime) => {
    setConfirmedDateTime(dateTime);
    if (dateTime && selectedBooking) {
      fetchAvailableDoctors(dateTime, selectedBooking.specialty);
    }
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setCancelReason('');
    setCancelModalVisible(true);
  };

  const submitAssignDoctor = async () => {
    if (!selectedDoctorId) {
      message.warning('Vui lòng chọn bác sĩ');
      return;
    }

    if (!confirmedDateTime) {
      message.warning('Vui lòng chọn ngày giờ khám cụ thể');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/quick-bookings/${selectedBooking.id}/assign`,
        { 
          doctorId: selectedDoctorId, 
          adminNotes,
          confirmedDateTime: confirmedDateTime.toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Phân công bác sĩ và set giờ khám thành công');
      setAssignModalVisible(false);
      fetchBookings();
    } catch (error) {
      message.error('Không thể phân công bác sĩ');
    }
  };

  const submitCancelBooking = async () => {
    if (!cancelReason.trim()) {
      message.warning('Vui lòng nhập lý do hủy');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/quick-bookings/${selectedBooking.id}/cancel`,
        { reason: cancelReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Đã hủy đặt lịch');
      setCancelModalVisible(false);
      fetchBookings();
    } catch (error) {
      message.error('Không thể hủy đặt lịch');
    }
  };

  const handleConfirmAndConvert = (booking) => {
    if (!booking.confirmedDate) {
      message.error('Admin chưa set giờ cụ thể cho lịch hẹn này');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận chuyển vào lịch khám?',
      content: (
        <div>
          <p>Bạn xác nhận nhận khám bệnh nhân <strong>{booking.patientName}</strong>?</p>
          <p>Thời gian: <strong>{dayjs(booking.confirmedDate).format('DD/MM/YYYY HH:mm')}</strong></p>
          <p style={{ color: '#ff4d4f', marginTop: 12 }}>
            Sau khi xác nhận, lịch hẹn sẽ được chuyển vào lịch khám chính thức của bạn.
          </p>
        </div>
      ),
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          const userId = localStorage.getItem('userId');
          
          await axios.post(
            `${process.env.REACT_APP_API_URL}/quick-bookings/${booking.id}/confirm`,
            { userId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          message.success('Đã chuyển vào lịch khám của bạn');
          fetchBookings();
        } catch (error) {
          message.error(error.response?.data?.message || 'Không thể xác nhận lịch hẹn');
        }
      }
    });
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      PENDING: { color: 'gold', text: 'Chờ xử lý' },
      ASSIGNED: { color: 'blue', text: 'Đã phân công' },
      CONVERTED: { color: 'green', text: 'Đã chuyển đổi' },
      CANCELLED: { color: 'red', text: 'Đã hủy' }
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getTimeSlotText = (timeSlot) => {
    const slots = {
      MORNING: 'Buổi sáng (8:00 - 12:00)',
      AFTERNOON: 'Buổi chiều (13:00 - 17:00)',
      EVENING: 'Buổi tối (17:00 - 20:00)'
    };
    return slots[timeSlot] || timeSlot;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
      width: 150,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 120,
    },
    {
      title: 'Chuyên khoa',
      dataIndex: 'specialty',
      key: 'specialty',
      width: 150,
    },
    {
      title: 'Ngày mong muốn',
      dataIndex: 'preferredDate',
      key: 'preferredDate',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Khung giờ',
      dataIndex: 'preferredTime',
      key: 'preferredTime',
      width: 180,
      render: (time) => getTimeSlotText(time),
    },
    {
      title: 'Giờ đã xác nhận',
      dataIndex: 'confirmedDate',
      key: 'confirmedDate',
      width: 150,
      render: (date) => date ? (
        <Tag color="blue">{dayjs(date).format('DD/MM/YYYY HH:mm')}</Tag>
      ) : (
        <Tag color="default">Chưa set</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: isDoctorView ? 200 : 250,
      render: (_, record) => (
        <Space size="small" direction={isDoctorView ? "vertical" : "horizontal"}>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            size="small"
          >
            Xem
          </Button>
          
          {/* Admin actions */}
          {!isDoctorView && record.status === 'PENDING' && (
            <>
              <Button
                type="link"
                icon={<UserAddOutlined />}
                onClick={() => handleAssignDoctor(record)}
                size="small"
              >
                Phân công
              </Button>
              <Button
                type="link"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleCancelBooking(record)}
                size="small"
              >
                Hủy
              </Button>
            </>
          )}
          
          {/* Doctor actions */}
          {isDoctorView && record.status === 'ASSIGNED' && (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleConfirmAndConvert(record)}
              size="small"
              style={{ width: '100%' }}
            >
              Xác nhận
            </Button>
          )}
          
          {record.status === 'CONVERTED' && record.convertedAppointmentId && (
            <Tag color="success">Đã chuyển #{record.convertedAppointmentId}</Tag>
          )}
        </Space>
      ),
    },
  ];

  const filteredBookings = activeTab === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === activeTab);

  return (
    <div className="admin-table">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Tất cả" key="ALL" />
        <TabPane tab="Chờ xử lý" key="PENDING" />
        <TabPane tab="Đã phân công" key="ASSIGNED" />
        <TabPane tab="Đã chuyển đổi" key="CONVERTED" />
        <TabPane tab="Đã hủy" key="CANCELLED" />
      </Tabs>

      <Table
        columns={columns}
        dataSource={filteredBookings}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1500 }}
        components={{
          header: {
            cell: (props) => (
              <th
                {...props}
                style={{
                  ...props.style,
                  backgroundColor: 'rgb(0, 58, 112)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            )
          }
        }}
      />

      {/* Detail Modal */}
      <Modal
        title="Chi tiết đặt lịch nhanh"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {selectedBooking && (
          <div style={{ lineHeight: '2' }}>
            <p><strong>ID:</strong> {selectedBooking.id}</p>
            <p><strong>Bệnh nhân:</strong> {selectedBooking.patientName}</p>
            <p><strong>Số điện thoại:</strong> {selectedBooking.phoneNumber}</p>
            <p><strong>Email:</strong> {selectedBooking.email}</p>
            <p><strong>Chuyên khoa:</strong> {selectedBooking.specialty}</p>
            <p><strong>Triệu chứng:</strong> {selectedBooking.symptoms || 'Không có'}</p>
            <p><strong>Ngày mong muốn:</strong> {dayjs(selectedBooking.preferredDate).format('DD/MM/YYYY')}</p>
            <p><strong>Khung giờ mong muốn:</strong> {getTimeSlotText(selectedBooking.preferredTime)}</p>
            {selectedBooking.confirmedDate && (
              <p>
                <strong>Giờ đã xác nhận:</strong>{' '}
                <Tag color="blue" style={{ fontSize: 14 }}>
                  {dayjs(selectedBooking.confirmedDate).format('DD/MM/YYYY HH:mm')}
                </Tag>
              </p>
            )}
            <p><strong>Trạng thái:</strong> {getStatusTag(selectedBooking.status)}</p>
            <p><strong>Ngày tạo:</strong> {dayjs(selectedBooking.createdAt).format('DD/MM/YYYY HH:mm')}</p>
            {selectedBooking.assignedDoctorName && (
              <p><strong>Bác sĩ phụ trách:</strong> {selectedBooking.assignedDoctorName}</p>
            )}
            {selectedBooking.adminNotes && (
              <p><strong>Ghi chú admin:</strong> {selectedBooking.adminNotes}</p>
            )}
            {selectedBooking.convertedAppointmentId && (
              <p>
                <strong>Đã chuyển thành lịch hẹn:</strong>{' '}
                <Tag color="success">#{selectedBooking.convertedAppointmentId}</Tag>
              </p>
            )}
            {selectedBooking.convertedAt && (
              <p><strong>Thời gian chuyển đổi:</strong> {dayjs(selectedBooking.convertedAt).format('DD/MM/YYYY HH:mm')}</p>
            )}
          </div>
        )}
      </Modal>

      {/* Assign Doctor Modal */}
      <Modal
        title="Phân công bác sĩ"
        open={assignModalVisible}
        onOk={submitAssignDoctor}
        onCancel={() => setAssignModalVisible(false)}
        okText="Phân công"
        cancelText="Hủy"
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            Ngày giờ khám cụ thể: <span style={{ color: 'red' }}>*</span>
          </label>
          <DatePicker
            showTime
            format="DD/MM/YYYY HH:mm"
            placeholder="Chọn ngày giờ khám"
            value={confirmedDateTime}
            onChange={handleDateTimeChange}
            style={{ width: '100%' }}
            disabledDate={(current) => current && current < dayjs().startOf('day')}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            Khung giờ mong muốn: {selectedBooking && getTimeSlotText(selectedBooking.preferredTime)}
          </div>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            Chọn bác sĩ: <span style={{ color: 'red' }}>*</span>
          </label>
          <Select
            style={{ width: '100%' }}
            placeholder="Chọn ngày giờ trước để xem bác sĩ có sẵn"
            value={selectedDoctorId}
            onChange={setSelectedDoctorId}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            disabled={!confirmedDateTime}
          >
            {(confirmedDateTime ? availableDoctors : doctors).map(doctor => (
              <Option key={doctor.id} value={doctor.id}>
                {doctor.firstName && doctor.lastName 
                  ? `${doctor.firstName} ${doctor.lastName}` 
                  : doctor.fullName || `Bác sĩ #${doctor.id}`} - {doctor.specialization}
              </Option>
            ))}
          </Select>
          {confirmedDateTime && availableDoctors.length === 0 && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#ff4d4f' }}>
              Không có bác sĩ nào rảnh vào thời gian này
            </div>
          )}
          {confirmedDateTime && availableDoctors.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
              {availableDoctors.length} bác sĩ có sẵn
            </div>
          )}
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            Ghi chú:
          </label>
          <TextArea
            rows={3}
            placeholder="Ghi chú cho bác sĩ..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        title="Hủy đặt lịch"
        open={cancelModalVisible}
        onOk={submitCancelBooking}
        onCancel={() => setCancelModalVisible(false)}
        okText="Xác nhận hủy"
        cancelText="Đóng"
        okButtonProps={{ danger: true }}
      >
        <div>
          <label>Lý do hủy:</label>
          <TextArea
            rows={3}
            placeholder="Nhập lý do hủy đặt lịch..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            style={{ marginTop: 8 }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default QuickBookingsTab;
