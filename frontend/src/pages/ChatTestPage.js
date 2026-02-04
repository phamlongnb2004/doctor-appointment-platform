import React, { useState, useEffect } from 'react';
import { Card, Button, List, Avatar, Typography, Space, message, Divider } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';
import { userAPI } from '../services/api';
import ChatButton from '../components/ChatButton';

const { Title, Text } = Typography;

function ChatTestPage({ user }) {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      // Lọc bỏ user hiện tại
      const otherUsers = response.data.filter(u => u.id !== user.id);
      setAllUsers(otherUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return '#f50';
      case 'DOCTOR': return '#2f54eb';
      case 'CONSULTANT': return '#52c41a';
      case 'PATIENT': return '#1890ff';
      default: return '#d9d9d9';
    }
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị';
      case 'DOCTOR': return 'Bác sĩ';
      case 'CONSULTANT': return 'Tư vấn';
      case 'PATIENT': return 'Bệnh nhân';
      default: return role;
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={2}>
          <MessageOutlined /> Test Hệ Thống Chat
        </Title>
        
        <div style={{ marginBottom: '24px' }}>
          <Text strong>Người dùng hiện tại: </Text>
          <Text>{user.firstName} {user.lastName} ({getRoleDisplay(user.role)})</Text>
        </div>

        <Divider>Danh sách người dùng khác</Divider>

        <List
          loading={loading}
          dataSource={allUsers}
          renderItem={(targetUser) => (
            <List.Item
              actions={[
                <ChatButton
                  currentUser={user}
                  targetUser={targetUser}
                  type="primary"
                  size="small"
                />
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={targetUser.profileImage}
                    icon={<UserOutlined />}
                    size={48}
                  />
                }
                title={
                  <Space>
                    <Text strong>{targetUser.firstName} {targetUser.lastName}</Text>
                    <span
                      style={{
                        background: getRoleColor(targetUser.role),
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500
                      }}
                    >
                      {getRoleDisplay(targetUser.role)}
                    </span>
                  </Space>
                }
                description={
                  <div>
                    <Text type="secondary">{targetUser.email}</Text>
                    <br />
                    <Text type="secondary">{targetUser.phone}</Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />

        <Divider>Quy tắc phân quyền chat</Divider>
        
        <div style={{ background: '#f6f8fa', padding: '16px', borderRadius: '8px' }}>
          <Title level={4}>Ai có thể chat với ai?</Title>
          <ul>
            <li><strong>Admin:</strong> Có thể chat với tất cả mọi người</li>
            <li><strong>Tư vấn (Consultant):</strong> Có thể chat với Bệnh nhân và Bác sĩ</li>
            <li><strong>Bác sĩ:</strong> Có thể chat với Bệnh nhân và Tư vấn</li>
            <li><strong>Bệnh nhân:</strong> Có thể chat với Bác sĩ và Tư vấn</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

export default ChatTestPage;