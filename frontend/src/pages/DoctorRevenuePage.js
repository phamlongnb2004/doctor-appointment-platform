import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Statistic, message, Spin, DatePicker, Space, Button } from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import api from '../services/api';
import '../styles/doctor-revenue.css';

const { RangePicker } = DatePicker;

const DoctorRevenuePage = () => {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState(null);
  const [dateRange, setDateRange] = useState([dayjs().subtract(6, 'month'), dayjs()]);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async (startDate, endDate) => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !user.id) {
        message.error('Vui lòng đăng nhập');
        return;
      }

      let url = `/doctors/my-profile/${user.id}/revenue`;
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await api.get(url);
      setRevenueData(response.data);
    } catch (error) {
      console.error('Error fetching revenue:', error);
      message.error('Không thể tải dữ liệu doanh thu');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');
      fetchRevenueData(startDate, endDate);
    }
  };

  const handleResetFilter = () => {
    const defaultRange = [dayjs().subtract(6, 'month'), dayjs()];
    setDateRange(defaultRange);
    fetchRevenueData();
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const columns = [
    {
      title: 'Mã cuộc hẹn',
      dataIndex: 'appointmentId',
      key: 'appointmentId',
      render: (id) => `#${id}`
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Ngày khám',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      render: (date) => formatDate(date)
    },
    {
      title: 'Giờ khám',
      dataIndex: 'timeSlot',
      key: 'timeSlot',
    },
    {
      title: 'Phí khám',
      dataIndex: 'fee',
      key: 'fee',
      render: (fee) => formatCurrency(fee),
      align: 'right'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'COMPLETED': { text: 'Hoàn thành', color: '#52c41a' },
          'PENDING': { text: 'Chờ xác nhận', color: '#faad14' },
          'CONFIRMED': { text: 'Đã xác nhận', color: '#1890ff' },
          'CANCELLED': { text: 'Đã hủy', color: '#ff4d4f' }
        };
        const statusInfo = statusMap[status] || { text: status, color: '#666' };
        return <span style={{ color: statusInfo.color, fontWeight: 500 }}>{statusInfo.text}</span>;
      }
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <p style={{ marginTop: 20, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!revenueData) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <p>Không có dữ liệu doanh thu</p>
      </div>
    );
  }

  return (
    <div className="doctor-revenue-page">
      <div className="page-header">
        <h1><DollarOutlined /> Doanh Thu Của Tôi</h1>
        <p>Theo dõi doanh thu và thống kê cuộc hẹn</p>
      </div>

      {/* Date Filter */}
      <Card style={{ marginBottom: 24 }}>
        <Space size="middle" wrap>
          <FilterOutlined style={{ fontSize: 18, color: 'rgb(0, 58, 112)' }} />
          <span style={{ fontWeight: 600, color: 'rgb(0, 58, 112)' }}>Lọc theo thời gian:</span>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="DD/MM/YYYY"
            placeholder={['Từ ngày', 'Đến ngày']}
            style={{ width: 280 }}
          />
          <Button onClick={handleResetFilter}>Đặt lại</Button>
        </Space>
      </Card>

      {/* Revenue Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng Doanh Thu"
              value={revenueData.totalRevenue}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="₫"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh Thu Tháng Này"
              value={revenueData.monthlyRevenue}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<CalendarOutlined />}
              suffix="₫"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh Thu Tuần Này"
              value={revenueData.weeklyRevenue}
              precision={0}
              valueStyle={{ color: '#722ed1' }}
              prefix={<CalendarOutlined />}
              suffix="₫"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh Thu Hôm Nay"
              value={revenueData.todayRevenue}
              precision={0}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<DollarOutlined />}
              suffix="₫"
            />
          </Card>
        </Col>
      </Row>

      {/* Appointment Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng Cuộc Hẹn"
              value={revenueData.totalAppointments}
              valueStyle={{ color: '#000' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã Hoàn Thành"
              value={revenueData.completedAppointments}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang Chờ"
              value={revenueData.pendingAppointments}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã Hủy"
              value={revenueData.cancelledAppointments}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue Chart */}
      <Card title="Biểu Đồ Doanh Thu 6 Tháng Gần Đây" style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Doanh thu" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Appointments */}
      <Card title="Cuộc Hẹn Gần Đây">
        <Table
          columns={columns}
          dataSource={revenueData.recentAppointments}
          rowKey="appointmentId"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
          className="revenue-table"
        />
      </Card>
    </div>
  );
};

export default DoctorRevenuePage;
