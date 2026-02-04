# Hệ Thống Chat - Doctor Appointment Platform

## Tổng quan
Hệ thống chat cho phép các người dùng trong nền tảng đặt lịch khám bác sĩ có thể nhắn tin với nhau theo quy tắc phân quyền cụ thể.

## Phân quyền Chat

### Roles (Vai trò)
1. **ADMIN** - Quản trị viên
2. **DOCTOR** - Bác sĩ  
3. **CONSULTANT** - Tư vấn viên (Role mới)
4. **PATIENT** - Bệnh nhân

### Quy tắc phân quyền
- **Admin**: Có thể chat với tất cả mọi người
- **Consultant**: Có thể chat với Patient và Doctor
- **Doctor**: Có thể chat với Patient và Consultant  
- **Patient**: Có thể chat với Doctor và Consultant

## Tính năng

### Backend Features
- ✅ Model: ChatRoom, ChatMessage, ChatParticipant
- ✅ Repository layer với các query tối ưu
- ✅ Service layer với business logic
- ✅ REST API endpoints
- ✅ WebSocket real-time messaging
- ✅ Phân quyền chat theo role
- ✅ Typing indicators
- ✅ Message read status
- ✅ Private và Group chat
- ✅ File attachment support (chuẩn bị)

### Frontend Features  
- ✅ Chat interface với Ant Design
- ✅ Real-time messaging qua WebSocket
- ✅ Chat room list
- ✅ Message history
- ✅ Typing indicators
- ✅ Unread message count
- ✅ Responsive design
- ✅ Browser notifications

## Cách sử dụng

### 1. Tạo user CONSULTANT để test
```sql
-- Chạy script trong database/create_consultant.sql
INSERT INTO users (email, password, first_name, last_name, phone, role, created_at, updated_at, active)
VALUES (
    'consultant@doctor.com',
    '$2a$10$BtFvPdKclKnmZGZJLwITT.1h/tKU1bvaQydBRGWgqkjXi8Mxv.hIC', -- password123
    'Nguyễn',
    'Tư Vấn', 
    '0987654321',
    'CONSULTANT',
    NOW(),
    NOW(),
    1
);
```

### 2. Đăng nhập và test
1. Đăng nhập với admin: `admin@doctor.com` / `password123`
2. Hoặc đăng nhập với consultant: `consultant@doctor.com` / `password123`
3. Truy cập `/chat-test` để xem danh sách users và test chat
4. Truy cập `/chat` để sử dụng giao diện chat chính

### 3. API Endpoints

#### REST API
```
GET    /api/chat/rooms                     - Lấy danh sách phòng chat
POST   /api/chat/rooms                     - Tạo phòng chat mới
POST   /api/chat/rooms/private             - Tạo/lấy phòng chat private
GET    /api/chat/rooms/{roomId}/messages   - Lấy tin nhắn trong phòng
POST   /api/chat/messages                  - Gửi tin nhắn
PUT    /api/chat/rooms/{roomId}/read       - Đánh dấu đã đọc
GET    /api/chat/can-chat                  - Kiểm tra quyền chat
```

#### WebSocket Endpoints
```
/app/chat/{roomId}/send     - Gửi tin nhắn
/app/chat/{roomId}/join     - Join phòng chat
/app/chat/{roomId}/leave    - Leave phòng chat  
/app/chat/{roomId}/typing   - Typing indicator

/topic/chat/{roomId}        - Subscribe tin nhắn phòng
/topic/chat/{roomId}/typing - Subscribe typing indicators
/user/{userId}/queue/chat/notification - Thông báo cá nhân
```

## Cấu trúc Database

### Bảng chat_rooms
- id, room_id, room_name, room_type
- created_by, created_at, updated_at, active

### Bảng chat_messages  
- id, chat_room_id, sender_id, content
- message_type, attachment_url, sent_at
- is_read, is_edited, is_deleted

### Bảng chat_participants
- id, chat_room_id, user_id, role
- joined_at, left_at, is_active
- can_send_message, can_delete_message, last_read_at

## Cấu trúc Frontend

### Components
- `ChatPage.js` - Giao diện chat chính
- `ChatTestPage.js` - Trang test chat
- `ChatButton.js` - Button để bắt đầu chat

### Services
- `chatApi.js` - REST API calls
- `chatWebSocket.js` - WebSocket service

### Styles
- `chat.css` - CSS cho giao diện chat

## Cách mở rộng

### Thêm tính năng mới
1. **File sharing**: Cập nhật ChatMessage model và API
2. **Voice messages**: Thêm message type mới
3. **Group management**: Thêm admin functions cho group
4. **Message reactions**: Thêm bảng message_reactions
5. **Chat history search**: Thêm full-text search

### Tối ưu performance
1. **Message pagination**: Đã implement
2. **Connection pooling**: Cấu hình WebSocket
3. **Message caching**: Redis cache
4. **File CDN**: AWS S3/CloudFront

## Troubleshooting

### Lỗi thường gặp
1. **403 Forbidden**: Kiểm tra JWT token và role permissions
2. **WebSocket connection failed**: Kiểm tra CORS và endpoint
3. **Messages not real-time**: Kiểm tra WebSocket subscription
4. **Can't create chat**: Kiểm tra role permissions

### Debug
1. Kiểm tra browser console cho WebSocket errors
2. Kiểm tra backend logs cho authentication issues  
3. Test API endpoints với Postman
4. Verify database permissions và foreign keys

## Security

### Implemented
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection

### TODO
- [ ] Rate limiting
- [ ] Message encryption
- [ ] File upload validation
- [ ] Audit logging