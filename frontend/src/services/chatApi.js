import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const chatApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
chatApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Chat API
export const chatAPI = {
  // Tạo phòng chat mới
  createChatRoom: (roomData, creatorId) => 
    chatApi.post(`/chat/rooms?creatorId=${creatorId}`, roomData),

  // Tạo hoặc lấy phòng chat private
  getOrCreatePrivateRoom: (user1Id, user2Id) => 
    chatApi.post(`/chat/rooms/private?user1Id=${user1Id}&user2Id=${user2Id}`),

  // Lấy danh sách phòng chat của user
  getUserChatRooms: (userId) => 
    chatApi.get(`/chat/rooms?userId=${userId}`),

  // Lấy tin nhắn trong phòng
  getRoomMessages: (roomId, userId, page = 0, size = 50) => 
    chatApi.get(`/chat/rooms/${roomId}/messages?userId=${userId}&page=${page}&size=${size}`),

  // Gửi tin nhắn
  sendMessage: (messageData, senderId) => 
    chatApi.post(`/chat/messages?senderId=${senderId}`, messageData),

  // Đánh dấu tin nhắn đã đọc
  markMessagesAsRead: (roomId, userId) => 
    chatApi.put(`/chat/rooms/${roomId}/read?userId=${userId}`),

  // Thêm participant vào phòng
  addParticipant: (roomId, userId, participantId) => 
    chatApi.post(`/chat/rooms/${roomId}/participants?userId=${userId}&participantId=${participantId}`),

  // Kiểm tra quyền chat
  canUsersChat: (user1Id, user2Id) => 
    chatApi.get(`/chat/can-chat?user1Id=${user1Id}&user2Id=${user2Id}`),
};

export default chatApi;