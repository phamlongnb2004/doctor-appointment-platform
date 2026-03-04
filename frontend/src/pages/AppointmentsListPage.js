import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, message, Space, Modal, Typography, Row, Col } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, CalendarOutlined, UserOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { appointmentAPI, doctorAPI } from '../services/api';
import '../styles/appointment.css';

const { Title, Text } = Typography;

function AppointmentsListPage({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let response;
      if (user.role === 'ADMIN') {
        response = await appointmentAPI.getAllAppointments();
      } else if (user.role === 'DOCTOR') {
        // Get doctor ID from user ID first
        try {
          const doctorResponse = await doctorAPI.getDoctorByUserId(user.id);
          const doctorId = doctorResponse.data.id;
          response = await appointmentAPI.getAppointmentsByDoctor(doctorId);
        } catch (error) {
          console.error('Error fetching doctor info:', error);
          message.error('Không thể tải thông tin bác sĩ');
          setLoading(false);
          return;
        }
      } else {
        response = await appointmentAPI.getAppointmentsByPatient(user.id);
      }
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      message.error('Không thể tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (appointmentId) => {
    try {
      await appointmentAPI.confirmAppointment(appointmentId);
      message.success('Đã xác nhận lịch hẹn');
      fetchAppointments();
    } catch (error) {
      console.error('Error confirming appointment:', error);
      message.error('Không thể xác nhận lịch hẹn');
    }
  };

  const handleCancel = async (appointmentId) => {
    Modal.confirm({
      title: 'Xác nhận hủy lịch hẹn',
      content: 'Bạn có chắc chắn muốn hủy lịch hẹn này?',
      okText: 'Hủy lịch',
      cancelText: 'Đóng',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await appointmentAPI.cancelAppointment(appointmentId);
          message.success('Đã hủy lịch hẹn');
          fetchAppointments();
        } catch (error) {
          console.error('Error cancelling appointment:', error);
          message.error('Không thể hủy lịch hẹn');
        }
      },
    });
  };

  const showDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailModalVisible(true);
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      PENDING: { color: '#fa8c16', text: 'Chờ xác nhận' },
      CONFIRMED: { color: '#52c41a', text: 'Đã xác nhận' },
      CANCELLED: { color: '#ff4d4f', text: 'Đã hủy' },
      COMPLETED: { color: '#1890ff', text: 'Hoàn thành' },
    };
    const config = statusConfig[status] || { color: '#d9d9d9', text: status };
    return <Tag color={config.color} style={{ fontWeight: 500 }}>{config.text}</Tag>;
  };

  const getStatistics = () => {
    const stats = {
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'PENDING').length,
      confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
      cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
    };
    return stats;
  };

  const stats = getStatistics();

  const columns = [
    {
      title: 'Mã',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => <Text strong>#{id}</Text>,
    },
    {
      title: user.role === 'DOCTOR' || user.role === 'ADMIN' ? 'Bệnh nhân' : 'Bác sĩ',
      key: 'person',
      render: (_, record) => {
        if (user.role === 'DOCTOR' || user.role === 'ADMIN') {
          return (
            <div>
              <div style={{ fontWeight: 500 }}>
                {record.patient?.firstName || ''} {record.patient?.lastName || ''}
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.patient?.phone || ''}
              </Text>
            </div>
          );
        }
        return (
          <div>
            <div style={{ fontWeight: 500 }}>
              {record.doctor?.user?.firstName || ''} {record.doctor?.user?.lastName || ''}
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.doctor?.specialization || ''}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Ngày khám',
      dataIndex: 'appointmentDateTime',
      key: 'appointmentDateTime',
      render: (date) => {
        // Parse the date string properly
        // Backend returns LocalDateTime which may not include timezone info
        const dateObj = new Date(date);
        
        return (
          <div>
            <div>{dateObj.toLocaleDateString('vi-VN')}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
            style={{ borderColor: '#003a70', color: '#003a70' }}
          >
            Chi tiết
          </Button>
          {(user.role === 'DOCTOR' || user.role === 'ADMIN') && record.status === 'PENDING' && (
            <Button
              size="small"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleConfirm(record.id)}
              style={{ background: '#00a651', borderColor: '#00a651' }}
            >
              Xác nhận
            </Button>
          )}
          {record.status === 'PENDING' && (
            <Button
              size="small"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => handleCancel(record.id)}
            >
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: 'calc(100vh - 64px)',
      padding: '40px 24px'
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: '#fff',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: '2px solid #f0f0f0'
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '12px',
              background: '#003a70',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CalendarOutlined style={{ fontSize: 28, color: '#fff' }} />
            </div>
            <div>
              <Title level={2} style={{ color: '#003a70', margin: 0, fontSize: 28 }}>
                {user.role === 'DOCTOR' ? 'Danh sách bệnh nhân' : 
                 user.role === 'ADMIN' ? 'Quản lý lịch hẹn' : 
                 'Lịch hẹn của tôi'}
              </Title>
              <Text style={{ color: '#666', fontSize: 15 }}>
                Quản lý và theo dõi lịch khám bệnh
              </Text>
            </div>
          </div>

          {/* Statistics */}
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <div className="stat-card" style={{ 
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                border: '2px solid #e9ecef',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ 
                  fontSize: 36, 
                  fontWeight: 700, 
                  color: '#003a70',
                  marginBottom: 8
                }}>{stats.total}</div>
                <div style={{ 
                  color: '#666', 
                  fontSize: 14,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Tổng số</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="stat-card" style={{ 
                background: '#fff9e6',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                border: '2px solid #ffd666',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ 
                  fontSize: 36, 
                  fontWeight: 700, 
                  color: '#fa8c16',
                  marginBottom: 8
                }}>{stats.pending}</div>
                <div style={{ 
                  color: '#d48806', 
                  fontSize: 14,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Chờ xác nhận</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="stat-card" style={{ 
                background: '#f6ffed',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                border: '2px solid #95de64',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ 
                  fontSize: 36, 
                  fontWeight: 700, 
                  color: '#52c41a',
                  marginBottom: 8
                }}>{stats.confirmed}</div>
                <div style={{ 
                  color: '#389e0d', 
                  fontSize: 14,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Đã xác nhận</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="stat-card" style={{ 
                background: '#fff1f0',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                border: '2px solid #ffa39e',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ 
                  fontSize: 36, 
                  fontWeight: 700, 
                  color: '#ff4d4f',
                  marginBottom: 8
                }}>{stats.cancelled}</div>
                <div style={{ 
                  color: '#cf1322', 
                  fontSize: 14,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Đã hủy</div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Table */}
        <Card 
          style={{ 
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <style>
            {`
              .stat-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 16px rgba(0, 58, 112, 0.15);
              }
              .ant-table-thead > tr > th {
                background: #003a70 !important;
                color: #fff !important;
                font-weight: 600 !important;
                border-bottom: none !important;
              }
              .ant-table-thead > tr > th::before {
                display: none !important;
              }
              .ant-pagination .ant-pagination-item-active {
                background: #003a70 !important;
                border-color: #003a70 !important;
              }
              .ant-pagination .ant-pagination-item-active a {
                color: #fff !important;
              }
              .ant-pagination .ant-pagination-item:hover {
                border-color: #003a70 !important;
              }
              .ant-pagination .ant-pagination-item:hover a {
                color: #003a70 !important;
              }
              .ant-pagination .ant-pagination-next:hover .ant-pagination-item-link,
              .ant-pagination .ant-pagination-prev:hover .ant-pagination-item-link {
                color: #003a70 !important;
                border-color: #003a70 !important;
              }
            `}
          </style>
          <Table
            columns={columns}
            dataSource={appointments}
            loading={loading}
            rowKey="id"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} lịch hẹn`
            }}
          />
        </Card>

        {/* Detail Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MedicineBoxOutlined style={{ fontSize: 24, color: '#003a70' }} />
              <span>Chi tiết lịch hẹn</span>
            </div>
          }
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              Đóng
            </Button>,
          ]}
          width={600}
        >
          {selectedAppointment && (
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div style={{ 
                    background: '#f0f5ff',
                    padding: '16px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #003a70'
                  }}>
                    <Text strong style={{ fontSize: 16 }}>Mã lịch hẹn: #{selectedAppointment.id}</Text>
                    <div style={{ marginTop: 8 }}>
                      {getStatusTag(selectedAppointment.status)}
                    </div>
                  </div>
                </Col>
                
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>
                    <UserOutlined style={{ marginRight: 8, color: '#003a70' }} />
                    <Text strong>Bệnh nhân</Text>
                  </div>
                  <Text>
                    {selectedAppointment.patient?.firstName} {selectedAppointment.patient?.lastName}
                  </Text>
                </Col>
                
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>
                    <MedicineBoxOutlined style={{ marginRight: 8, color: '#003a70' }} />
                    <Text strong>Bác sĩ</Text>
                  </div>
                  <Text>
                    {selectedAppointment.doctor?.user?.firstName} {selectedAppointment.doctor?.user?.lastName}
                  </Text>
                </Col>
                
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Chuyên khoa</Text>
                  </div>
                  <Text>{selectedAppointment.doctor?.specialization}</Text>
                </Col>
                
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>
                    <CalendarOutlined style={{ marginRight: 8, color: '#003a70' }} />
                    <Text strong>Ngày giờ khám</Text>
                  </div>
                  <Text>{new Date(selectedAppointment.appointmentDateTime).toLocaleString('vi-VN')}</Text>
                </Col>
                
                {selectedAppointment.reason && (
                  <Col span={24}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>Lý do khám</Text>
                    </div>
                    <div style={{ 
                      background: '#fafafa',
                      padding: '12px',
                      borderRadius: '8px'
                    }}>
                      <Text>{selectedAppointment.reason}</Text>
                    </div>
                  </Col>
                )}
                
                {selectedAppointment.notes && (
                  <Col span={24}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>Ghi chú</Text>
                    </div>
                    <div style={{ 
                      background: '#fafafa',
                      padding: '12px',
                      borderRadius: '8px'
                    }}>
                      <Text>{selectedAppointment.notes}</Text>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default AppointmentsListPage;
