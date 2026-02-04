import React from 'react';
import { Button, message } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/chatApi';

function ChatButton({ currentUser, targetUser, size = 'small', type = 'default', block = false }) {
  const navigate = useNavigate();

  const startChat = async () => {
    if (!currentUser || !targetUser) {
      message.error('Không thể bắt đầu chat');
      return;
    }

    try {
      // Kiểm tra quyền chat
      const permissionResponse = await chatAPI.canUsersChat(currentUser.id, targetUser.id);
      
      if (!permissionResponse.data.canChat) {
        message.error('Bạn không có quyền chat với người này');
        return;
      }

      // Tạo hoặc lấy phòng chat private
      const response = await chatAPI.getOrCreatePrivateRoom(currentUser.id, targetUser.id);
      
      // Chuyển đến trang chat
      navigate('/chat', { state: { selectedRoomId: response.data.roomId } });
      
    } catch (error) {
      console.error('Error starting chat:', error);
      message.error('Không thể bắt đầu chat');
    }
  };

  return (
    <Button
      type={type}
      size={size}
      icon={<MessageOutlined />}
      onClick={startChat}
      block={block}
      style={type === 'primary' ? {
        background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
        border: 'none'
      } : {}}
    >
      Chat với {targetUser.firstName}
    </Button>
  );
}

export default ChatButton;