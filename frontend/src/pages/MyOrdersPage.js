import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Table, Tag, Button, Empty, Spin, Breadcrumb, message } from 'antd';
import { HomeOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../styles/order.css';

function MyOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUserInfo();
    if (!user) {
      message.warning('Vui lòng đăng nhập để xem đơn hàng');
      navigate('/login');
      return;
    }
    fetchOrders();
  }, []);

  const getUserInfo = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const fetchOrders = async () => {
    try {
      const user = getUserInfo();
      const response = await axios.get(`http://localhost:8080/api/orders/user`, {
        params: { userId: user.id }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'PENDING': 'orange',
      'CONFIRMED': 'blue',
      'PROCESSING': 'cyan',
      'COMPLETED': 'green',
      'CANCELLED': 'red'
    };
    return colorMap[status] || 'default';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'PROCESSING': 'Đang xử lý',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString('vi-VN')
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <div>
          {items.slice(0, 2).map((item, index) => (
            <div key={index} style={{ marginBottom: 4 }}>
              {item.serviceTitle} x{item.quantity}
            </div>
          ))}
          {items.length > 2 && (
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>
              +{items.length - 2} dịch vụ khác
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'finalAmount',
      key: 'finalAmount',
      render: (amount) => (
        <strong style={{ color: '#f5222d' }}>
          {amount?.toLocaleString('vi-VN')} ₫
        </strong>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/order-success/${record.orderNumber}`)}
        >
          Xem chi tiết
        </Button>
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      {/* Breadcrumb */}
      <div style={{ background: '#f5f5f5', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/"><HomeOutlined /> Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Đơn hàng của tôi</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
          Đơn hàng của tôi
        </h1>

        <Card>
          {orders.length === 0 ? (
            <Empty
              description="Bạn chưa có đơn hàng nào"
              style={{ padding: '60px 0' }}
            >
              <Button type="primary" onClick={() => navigate('/services')}>
                Đặt dịch vụ ngay
              </Button>
            </Empty>
          ) : (
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Tổng ${total} đơn hàng`
              }}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export default MyOrdersPage;
