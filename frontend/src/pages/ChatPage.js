import React, { useState, useEffect, useRef } from 'react';
import { Layout, List, Input, Button, Avatar, Typography, Badge, Spin, Empty, message, Modal, Select, Divider } from 'antd';
import { SendOutlined, UserOutlined, PlusOutlined, SearchOutlined, MessageOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { chatAPI } from '../services/chatApi';
import chatWebSocketService from '../services/chatWebSocket';
import '../styles/chat.css';

const { Sider, Content } = Layout;
const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function ChatPage({ user }) {
  const location = useLocation();
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [roomType, setRoomType] = useState('PRIVATE');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (user) {
      initializeChat();
    } else {
      setLoading(false); // Set loading to false if no user
    }

    // Handle window resize for mobile detection
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      chatWebSocketService.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      // Connect to WebSocket
      const token = localStorage.getItem('token');
      chatWebSocketService.connect(user.id, token);
      chatWebSocketService.requestNotificationPermission();

      // Load chat rooms
      await loadChatRooms();
    } catch (error) {
      console.error('Error initializing chat:', error);
      message.error('Không thể kết nối chat');
    } finally {
      setLoading(false);
    }
  };

  const loadChatRooms = async () => {
    try {
      const response = await chatAPI.getUserChatRooms(user.id);
      setChatRooms(response.data);

      // Nếu có selectedRoomId từ navigation, tự động chọn room đó
      const selectedRoomId = location.state?.selectedRoomId;
      if (selectedRoomId) {
        const targetRoom = response.data.find(room => room.roomId === selectedRoomId);
        if (targetRoom) {
          selectRoom(targetRoom);
        }
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error);
      message.error('Không thể tải danh sách chat');
    }
  };

  const selectRoom = async (room) => {
    if (selectedRoom) {
      // Unsubscribe from previous room
      chatWebSocketService.unsubscribeFromRoom(selectedRoom.roomId);
    }

    setSelectedRoom(room);
    setMessages([]);
    setTypingUsers(new Set());

    try {
      // Load messages
      const response = await chatAPI.getRoomMessages(room.roomId, user.id);
      setMessages(response.data.reverse()); // Reverse to show oldest first

      // Mark messages as read
      await chatAPI.markMessagesAsRead(room.roomId, user.id);

      // Subscribe to room via WebSocket
      chatWebSocketService.subscribeToRoom(
        room.roomId,
        handleNewMessage,
        handleTypingIndicator
      );

      // Update unread count in room list
      setChatRooms(prev => prev.map(r => 
        r.roomId === room.roomId ? { ...r, unreadCount: 0 } : r
      ));
    } catch (error) {
      console.error('Error loading room messages:', error);
      message.error('Không thể tải tin nhắn');
    }
  };

  const handleNewMessage = (messageData) => {
    if (messageData.type === 'USER_JOINED' || messageData.type === 'USER_LEFT') {
      // Handle user join/leave events
      return;
    }

    // Kiểm tra xem tin nhắn đã tồn tại chưa để tránh duplicate
    setMessages(prev => {
      const existingMessage = prev.find(msg => 
        msg.id === messageData.id || 
        (msg.content === messageData.content && 
         msg.sender.id === messageData.sender.id && 
         Math.abs(new Date(msg.sentAt) - new Date(messageData.sentAt)) < 1000)
      );
      
      if (existingMessage) {
        console.log('Duplicate message detected, skipping:', messageData);
        return prev;
      }
      
      return [...prev, messageData];
    });

    // Update room list with new message
    setChatRooms(prev => prev.map(room => {
      if (room.roomId === messageData.roomId) {
        return {
          ...room,
          lastMessage: messageData,
          updatedAt: messageData.sentAt,
          unreadCount: messageData.sender.id !== user.id ? (room.unreadCount || 0) + 1 : 0
        };
      }
      return room;
    }));
  };

  const handleTypingIndicator = (typingData) => {
    if (typingData.userId === user.id) return; // Ignore own typing

    setTypingUsers(prev => {
      const newSet = new Set(prev);
      if (typingData.isTyping) {
        newSet.add(typingData.userId);
      } else {
        newSet.delete(typingData.userId);
      }
      return newSet;
    });

    // Clear typing indicator after 3 seconds
    setTimeout(() => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(typingData.userId);
        return newSet;
      });
    }, 3000);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || sendingMessage) return;

    setSendingMessage(true);
    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      const messageData = {
        roomId: selectedRoom.roomId,
        content: messageContent,
        messageType: 'TEXT'
      };

      // Chỉ gửi qua REST API, không gửi qua WebSocket để tránh duplicate
      // REST API sẽ handle việc broadcast qua WebSocket
      const response = await chatAPI.sendMessage(messageData, user.id);
      
      // Tin nhắn sẽ được nhận qua WebSocket subscription trong handleNewMessage
      console.log('Message sent successfully:', response.data);
      
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Không thể gửi tin nhắn');
      setNewMessage(messageContent); // Restore message on error
    } finally {
      setSendingMessage(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // Send typing indicator
    if (selectedRoom) {
      chatWebSocketService.sendTypingIndicator(selectedRoom.roomId, true);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        chatWebSocketService.sendTypingIndicator(selectedRoom.roomId, false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startNewChat = async () => {
    try {
      // Load available users based on role permissions
      const response = await chatAPI.canUsersChat(user.id, user.id); // This will be updated to get available users
      // For now, we'll create a simple implementation
      setShowNewChatModal(true);
    } catch (error) {
      console.error('Error starting new chat:', error);
      message.error('Không thể tạo chat mới');
    }
  };

  const createNewChat = async () => {
    if (selectedUsers.length === 0) {
      message.error('Vui lòng chọn người để chat');
      return;
    }

    try {
      let response;
      
      if (selectedUsers.length === 1 && roomType === 'PRIVATE') {
        // Create private room
        response = await chatAPI.getOrCreatePrivateRoom(user.id, selectedUsers[0]);
      } else {
        // Create group room
        const roomData = {
          roomName: newRoomName || 'Nhóm chat mới',
          roomType: roomType,
          participantIds: selectedUsers
        };
        response = await chatAPI.createChatRoom(roomData, user.id);
      }

      const newRoom = response.data;
      setChatRooms(prev => [newRoom, ...prev]);
      setShowNewChatModal(false);
      setSelectedUsers([]);
      setNewRoomName('');
      selectRoom(newRoom);
    } catch (error) {
      console.error('Error creating chat:', error);
      message.error('Không thể tạo chat');
    }
  };

  const getRoomDisplayName = (room) => {
    if (room.roomType === 'PRIVATE') {
      // For private rooms, show the other participant's name
      const otherParticipant = room.participants?.find(p => p.user.id !== user.id);
      return otherParticipant ? `${otherParticipant.user.firstName} ${otherParticipant.user.lastName}` : room.roomName;
    }
    return room.roomName;
  };

  const getRoomAvatar = (room) => {
    if (room.roomType === 'PRIVATE') {
      const otherParticipant = room.participants?.find(p => p.user.id !== user.id);
      return otherParticipant?.user.profileImage;
    }
    return null;
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    }
  };

  if (loading) {
    return (
      <div className="chat-loading">
        <Spin size="large" />
        <Text>Đang tải chat...</Text>
      </div>
    );
  }

  // Mobile view - completely different UI
  if (isMobile) {
    // Show chat list
    if (!selectedRoom) {
      return (
        <>
          <div className="mobile-chat-container">
            <div className="mobile-chat-header">
              <Title level={4}>
                <MessageOutlined /> Chat Tư Vấn
              </Title>
            </div>

            <div className="mobile-new-chat-section">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={startNewChat}
                className="mobile-new-chat-btn"
                block
                size="large"
              >
                Tạo cuộc chat mới
              </Button>
            </div>

            <div className="mobile-chat-search">
              <Input
                placeholder="Tìm kiếm cuộc trò chuyện..."
                prefix={<SearchOutlined />}
                className="search-input"
              />
            </div>

            <div className="mobile-chat-list">
              <List
                dataSource={chatRooms}
                renderItem={(room) => (
                  <List.Item
                    className="mobile-chat-item"
                    onClick={() => selectRoom(room)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge count={room.unreadCount || 0} size="small">
                          <Avatar 
                            src={getRoomAvatar(room)} 
                            icon={<UserOutlined />}
                            size={50}
                          />
                        </Badge>
                      }
                      title={
                        <div className="mobile-room-title">
                          <Text strong>{getRoomDisplayName(room)}</Text>
                          <Text type="secondary" className="mobile-room-time">
                            {room.lastMessage && formatMessageTime(room.lastMessage.sentAt)}
                          </Text>
                        </div>
                      }
                      description={
                        <Text ellipsis className="mobile-room-last-message">
                          {room.lastMessage ? 
                            `${room.lastMessage.sender.firstName}: ${room.lastMessage.content}` : 
                            'Chưa có tin nhắn'
                          }
                        </Text>
                      }
                    />
                  </List.Item>
                )}
                locale={{ 
                  emptyText: (
                    <Empty 
                      description="Chưa có cuộc trò chuyện nào. Nhấn nút trên để tạo chat mới!"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )
                }}
              />
            </div>
          </div>

          {/* New Chat Modal for Mobile */}
          <Modal
            title="Tạo cuộc trò chuyện mới"
            open={showNewChatModal}
            onOk={createNewChat}
            onCancel={() => setShowNewChatModal(false)}
            okText="Tạo"
            cancelText="Hủy"
          >
            <div className="new-chat-form">
              <div className="form-item">
                <Text strong>Loại chat:</Text>
                <Select
                  value={roomType}
                  onChange={setRoomType}
                  style={{ width: '100%', marginTop: 8 }}
                >
                  <Option value="PRIVATE">Chat riêng</Option>
                  <Option value="GROUP">Nhóm chat</Option>
                  <Option value="CONSULTATION">Tư vấn</Option>
                </Select>
              </div>

              {roomType !== 'PRIVATE' && (
                <div className="form-item">
                  <Text strong>Tên nhóm:</Text>
                  <Input
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Nhập tên nhóm..."
                    style={{ marginTop: 8 }}
                  />
                </div>
              )}

              <div className="form-item">
                <Text strong>Chọn người tham gia:</Text>
                <Select
                  mode="multiple"
                  value={selectedUsers}
                  onChange={setSelectedUsers}
                  placeholder="Chọn người để chat..."
                  style={{ width: '100%', marginTop: 8 }}
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {/* This will be populated with available users based on role permissions */}
                  <Option value={1}>Bác sĩ Nguyễn Văn A</Option>
                  <Option value={2}>Tư vấn viên Trần Thị B</Option>
                </Select>
              </div>
            </div>
          </Modal>
        </>
      );
    }

    // Show chat messages
    return (
      <div className="mobile-chat-messages">
        {/* Chat Header */}
        <div className="mobile-messages-header">
          <Button
            type="text"
            icon={<span style={{ fontSize: '20px' }}>←</span>}
            onClick={() => {
              setSelectedRoom(null);
              setMessages([]);
              if (selectedRoom) {
                chatWebSocketService.unsubscribeFromRoom(selectedRoom.roomId);
              }
            }}
            className="mobile-back-button"
          />
          <Avatar 
            src={getRoomAvatar(selectedRoom)} 
            icon={<UserOutlined />}
            size={40}
          />
          <div className="mobile-chat-info">
            <Title level={5}>{getRoomDisplayName(selectedRoom)}</Title>
            <Text type="secondary">
              {selectedRoom.participantCount} thành viên
              {typingUsers.size > 0 && (
                <span className="typing-indicator">
                  {' • '}
                  <Text type="secondary" className="typing-text">
                    đang nhập...
                  </Text>
                </span>
              )}
            </Text>
          </div>
        </div>

        {/* Messages List */}
        <div className="mobile-messages-container">
          <List
            className="messages-list"
            dataSource={messages}
            renderItem={(message) => (
              <div 
                className={`message-item ${message.sender.id === user.id ? 'own-message' : 'other-message'}`}
              >
                {message.sender.id !== user.id && (
                  <Avatar 
                    src={message.sender.profileImage} 
                    icon={<UserOutlined />}
                    size={32}
                    className="message-avatar"
                  />
                )}
                <div className="message-content">
                  {message.sender.id !== user.id && (
                    <Text className="message-sender">
                      {message.sender.firstName} {message.sender.lastName}
                    </Text>
                  )}
                  <div className="message-bubble">
                    <Text>{message.content}</Text>
                  </div>
                  <Text type="secondary" className="message-time">
                    {formatMessageTime(message.sentAt)}
                  </Text>
                </div>
              </div>
            )}
            locale={{ emptyText: <Empty description="Chưa có tin nhắn" /> }}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="mobile-input-container">
          <TextArea
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="mobile-message-input"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={sendMessage}
            loading={sendingMessage}
            disabled={!newMessage.trim()}
            className="mobile-send-button"
          >
            Gửi
          </Button>
        </div>
      </div>
    );
  }

  // Desktop view - original 2-column layout
  return (
    <Layout className="chat-layout">
      {/* Chat Room List */}
      <Sider 
        width={320} 
        className="chat-sidebar"
      >
        <div className="chat-header">
          <Title level={4}>
            <MessageOutlined /> Chat
          </Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={startNewChat}
            className="new-chat-btn"
          >
            Chat mới
          </Button>
        </div>

        <div className="chat-search">
          <Input
            placeholder="Tìm kiếm cuộc trò chuyện..."
            prefix={<SearchOutlined />}
            className="search-input"
          />
        </div>

        <List
          className="chat-room-list"
          dataSource={chatRooms}
          renderItem={(room) => (
            <List.Item
              className={`chat-room-item ${selectedRoom?.roomId === room.roomId ? 'active' : ''}`}
              onClick={() => selectRoom(room)}
            >
              <List.Item.Meta
                avatar={
                  <Badge count={room.unreadCount || 0} size="small">
                    <Avatar 
                      src={getRoomAvatar(room)} 
                      icon={<UserOutlined />}
                      size={48}
                    />
                  </Badge>
                }
                title={
                  <div className="room-title">
                    <Text strong>{getRoomDisplayName(room)}</Text>
                    <Text type="secondary" className="room-time">
                      {room.lastMessage && formatMessageTime(room.lastMessage.sentAt)}
                    </Text>
                  </div>
                }
                description={
                  <Text ellipsis className="room-last-message">
                    {room.lastMessage ? 
                      `${room.lastMessage.sender.firstName}: ${room.lastMessage.content}` : 
                      'Chưa có tin nhắn'
                    }
                  </Text>
                }
              />
            </List.Item>
          )}
          locale={{ emptyText: <Empty description="Chưa có cuộc trò chuyện nào" /> }}
        />
      </Sider>

      {/* Chat Messages */}
      <Content 
        className="chat-content"
      >
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="chat-messages-header">
              <Avatar 
                src={getRoomAvatar(selectedRoom)} 
                icon={<UserOutlined />}
                size={40}
              />
              <div className="chat-info">
                <Title level={5}>{getRoomDisplayName(selectedRoom)}</Title>
                <Text type="secondary">
                  {selectedRoom.participantCount} thành viên
                  {typingUsers.size > 0 && (
                    <span className="typing-indicator">
                      {' • '}
                      <Text type="secondary" className="typing-text">
                        đang nhập...
                      </Text>
                    </span>
                  )}
                </Text>
              </div>
            </div>

            {/* Messages List */}
            <div className="chat-messages-container">
              <List
                className="messages-list"
                dataSource={messages}
                renderItem={(message) => (
                  <div 
                    className={`message-item ${message.sender.id === user.id ? 'own-message' : 'other-message'}`}
                  >
                    {message.sender.id !== user.id && (
                      <Avatar 
                        src={message.sender.profileImage} 
                        icon={<UserOutlined />}
                        size={32}
                        className="message-avatar"
                      />
                    )}
                    <div className="message-content">
                      {message.sender.id !== user.id && (
                        <Text className="message-sender">
                          {message.sender.firstName} {message.sender.lastName}
                        </Text>
                      )}
                      <div className="message-bubble">
                        <Text>{message.content}</Text>
                      </div>
                      <Text type="secondary" className="message-time">
                        {formatMessageTime(message.sentAt)}
                      </Text>
                    </div>
                  </div>
                )}
                locale={{ emptyText: <Empty description="Chưa có tin nhắn" /> }}
              />
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="chat-input-container">
              <TextArea
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                className="message-input"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={sendMessage}
                loading={sendingMessage}
                disabled={!newMessage.trim()}
                className="send-button"
              >
                Gửi
              </Button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <Empty 
              description="Chọn một cuộc trò chuyện để bắt đầu"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
      </Content>

      {/* New Chat Modal */}
      <Modal
        title="Tạo cuộc trò chuyện mới"
        open={showNewChatModal}
        onOk={createNewChat}
        onCancel={() => setShowNewChatModal(false)}
        okText="Tạo"
        cancelText="Hủy"
      >
        <div className="new-chat-form">
          <div className="form-item">
            <Text strong>Loại chat:</Text>
            <Select
              value={roomType}
              onChange={setRoomType}
              style={{ width: '100%', marginTop: 8 }}
            >
              <Option value="PRIVATE">Chat riêng</Option>
              <Option value="GROUP">Nhóm chat</Option>
              <Option value="CONSULTATION">Tư vấn</Option>
            </Select>
          </div>

          {roomType !== 'PRIVATE' && (
            <div className="form-item">
              <Text strong>Tên nhóm:</Text>
              <Input
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Nhập tên nhóm..."
                style={{ marginTop: 8 }}
              />
            </div>
          )}

          <div className="form-item">
            <Text strong>Chọn người tham gia:</Text>
            <Select
              mode="multiple"
              value={selectedUsers}
              onChange={setSelectedUsers}
              placeholder="Chọn người để chat..."
              style={{ width: '100%', marginTop: 8 }}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {/* This will be populated with available users based on role permissions */}
              <Option value={1}>Bác sĩ Nguyễn Văn A</Option>
              <Option value={2}>Tư vấn viên Trần Thị B</Option>
            </Select>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

export default ChatPage;