import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Button, Table, Spin, Typography, Space, Progress } from 'antd';
import { DollarOutlined, LineChartOutlined, UserOutlined, CalendarOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function ReportsTab() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, 'days'),
    dayjs()
  ]);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');

      const response = await axios.get(
        `${API_BASE_URL}/reports/dashboard?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
    }
  };

  const topDoctorsColumns = [
    {
      title: 'Bác sĩ',
      dataIndex: 'doctorName',
      key: 'doctorName',
      render: (text) => <Text strong style={{ color: '#2c3e50' }}>{text}</Text>
    },
    {
      title: 'Chuyên khoa',
      dataIndex: 'specialization',
      key: 'specialization',
      render: (text) => <Text style={{ color: '#2c3e50' }}>{text}</Text>
    },
    {
      title: 'Số lịch hẹn',
      dataIndex: 'appointmentCount',
      key: 'appointmentCount',
      sorter: (a, b) => a.appointmentCount - b.appointmentCount,
      render: (count) => <Text style={{ color: '#2c3e50' }}>{count}</Text>
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a, b) => a.revenue - b.revenue,
      render: (revenue) => <Text strong style={{ color: '#2c3e50' }}>{revenue?.toLocaleString('vi-VN')} ₫</Text>
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Đang tải dữ liệu báo cáo...</div>
      </div>
    );
  }

  if (!reportData) {
    return <div>Không có dữ liệu</div>;
  }

  const { revenue, doctors, appointments } = reportData;

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <div className="admin-section-title">
          <LineChartOutlined />
          <Title level={3}>Báo cáo & Thống kê</Title>
        </div>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="DD/MM/YYYY"
            style={{ width: 280 }}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchReportData}>
            Làm mới
          </Button>
        </Space>
      </div>

      {/* Revenue Statistics */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-stat-card" style={{ borderRadius: 16 }}>
            <Statistic
              title="Tổng doanh thu"
              value={revenue?.totalRevenue || 0}
              precision={0}
              valueStyle={{ color: '#3f8600', fontSize: 28, fontWeight: 700 }}
              prefix={<DollarOutlined />}
              suffix="₫"
            />
            <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
              {revenue?.completedOrders || 0} đơn hàng hoàn thành
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-stat-card" style={{ borderRadius: 16 }}>
            <Statistic
              title="Doanh thu chờ xử lý"
              value={revenue?.pendingRevenue || 0}
              precision={0}
              valueStyle={{ color: '#faad14', fontSize: 28, fontWeight: 700 }}
              prefix={<DollarOutlined />}
              suffix="₫"
            />
            <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
              {(revenue?.totalOrders || 0) - (revenue?.completedOrders || 0)} đơn hàng đang chờ
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-stat-card" style={{ borderRadius: 16 }}>
            <Statistic
              title="Tổng lịch hẹn"
              value={appointments?.totalAppointments || 0}
              valueStyle={{ color: '#1890ff', fontSize: 28, fontWeight: 700 }}
              prefix={<CalendarOutlined />}
            />
            <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
              Trong khoảng thời gian đã chọn
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-stat-card" style={{ borderRadius: 16 }}>
            <Statistic
              title="Bác sĩ hoạt động"
              value={doctors?.activeDoctors || 0}
              valueStyle={{ color: '#722ed1', fontSize: 28, fontWeight: 700 }}
              prefix={<UserOutlined />}
              suffix={`/ ${doctors?.totalDoctors || 0}`}
            />
            <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
              Tổng số bác sĩ trong hệ thống
            </div>
          </Card>
        </Col>
      </Row>

      {/* Appointment Status Breakdown */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Trạng thái lịch hẹn" className="admin-card" style={{ borderRadius: 16 }}>
            {appointments?.byStatus && Object.entries(appointments.byStatus).map(([status, count]) => {
              const total = appointments.totalAppointments || 1;
              const percentage = ((count / total) * 100).toFixed(1);
              const statusColors = {
                'PENDING': '#faad14',
                'CONFIRMED': '#1890ff',
                'COMPLETED': '#52c41a',
                'CANCELLED': '#ff4d4f'
              };
              const statusLabels = {
                'PENDING': 'Chờ xác nhận',
                'CONFIRMED': 'Đã xác nhận',
                'COMPLETED': 'Hoàn thành',
                'CANCELLED': 'Đã hủy'
              };

              return (
                <div key={status} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>{statusLabels[status] || status}</Text>
                    <Text strong>{count} ({percentage}%)</Text>
                  </div>
                  <Progress 
                    percent={parseFloat(percentage)} 
                    strokeColor={statusColors[status] || '#1890ff'}
                    showInfo={false}
                  />
                </div>
              );
            })}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Top 5 bác sĩ" className="admin-card" style={{ borderRadius: 16 }}>
            <div className="admin-table">
              <Table
                dataSource={doctors?.topDoctors?.slice(0, 5) || []}
                columns={topDoctorsColumns}
                pagination={false}
                rowKey="doctorId"
                size="small"
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Full Top Doctors Table */}
      <Card title="Thống kê chi tiết bác sĩ" className="admin-card" style={{ borderRadius: 16 }}>
        <div className="admin-table">
          <Table
            dataSource={doctors?.topDoctors || []}
            columns={topDoctorsColumns}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} bác sĩ`
            }}
            rowKey="doctorId"
          />
        </div>
      </Card>
    </div>
  );
}

export default ReportsTab;
