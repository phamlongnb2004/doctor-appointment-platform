import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class ChatWebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.userId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.messageHandlers = new Map();
    this.typingHandlers = new Map();
  }

  /**
   * Kết nối WebSocket cho chat
   */
  connect(userId, token) {
    this.userId = userId;

    // Create SockJS connection - use environment variable
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
    const WS_URL = API_BASE_URL.replace('/api', '') + '/api/ws';
    const socket = new SockJS(WS_URL);

    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      onConnect: () => {
        console.log('Chat WebSocket connected');
        this.connected = true;
        this.reconnectAttempts = 0;

        // Subscribe to personal notifications
        this.subscribeToPersonalNotifications();
      },
      onDisconnect: () => {
        console.log('Chat WebSocket disconnected');
        this.connected = false;
      },
      onStompError: (error) => {
        console.error('Chat STOMP error:', error);
        this.handleReconnect();
      },
      onWebSocketClose: () => {
        console.log('Chat WebSocket closed');
        this.connected = false;
        this.handleReconnect();
      }
    });

    this.client.activate();
  }

  /**
   * Subscribe to personal chat notifications
   */
  subscribeToPersonalNotifications() {
    if (this.client && this.connected && this.userId) {
      const subscription = this.client.subscribe(
        `/user/${this.userId}/queue/chat/notification`,
        (message) => {
          try {
            const notification = JSON.parse(message.body);
            console.log('Received chat notification:', notification);
            
            // Trigger notification handlers
            this.triggerNotificationHandlers(notification);
          } catch (error) {
            console.error('Error parsing chat notification:', error);
          }
        }
      );
      
      this.subscriptions.set('personal-notifications', subscription);
    }
  }

  /**
   * Subscribe to a chat room
   */
  subscribeToRoom(roomId, messageHandler, typingHandler) {
    if (!this.client || !this.connected) {
      console.warn('WebSocket not connected, cannot subscribe to room');
      return;
    }

    // Subscribe to room messages
    const messageSubscription = this.client.subscribe(
      `/topic/chat/${roomId}`,
      (message) => {
        try {
          const chatMessage = JSON.parse(message.body);
          console.log('Received chat message:', chatMessage);
          
          if (messageHandler) {
            messageHandler(chatMessage);
          }
        } catch (error) {
          console.error('Error parsing chat message:', error);
        }
      }
    );

    // Subscribe to typing indicators
    const typingSubscription = this.client.subscribe(
      `/topic/chat/${roomId}/typing`,
      (message) => {
        try {
          const typingData = JSON.parse(message.body);
          console.log('Received typing indicator:', typingData);
          
          if (typingHandler) {
            typingHandler(typingData);
          }
        } catch (error) {
          console.error('Error parsing typing indicator:', error);
        }
      }
    );

    this.subscriptions.set(`room-${roomId}`, messageSubscription);
    this.subscriptions.set(`typing-${roomId}`, typingSubscription);

    // Store handlers
    this.messageHandlers.set(roomId, messageHandler);
    this.typingHandlers.set(roomId, typingHandler);

    // Send join room message
    this.joinRoom(roomId);
  }

  /**
   * Unsubscribe from a chat room
   */
  unsubscribeFromRoom(roomId) {
    const messageSubscription = this.subscriptions.get(`room-${roomId}`);
    const typingSubscription = this.subscriptions.get(`typing-${roomId}`);

    if (messageSubscription) {
      messageSubscription.unsubscribe();
      this.subscriptions.delete(`room-${roomId}`);
    }

    if (typingSubscription) {
      typingSubscription.unsubscribe();
      this.subscriptions.delete(`typing-${roomId}`);
    }

    // Remove handlers
    this.messageHandlers.delete(roomId);
    this.typingHandlers.delete(roomId);

    // Send leave room message
    this.leaveRoom(roomId);
  }

  /**
   * Send message to room
   */
  sendMessage(roomId, content, messageType = 'TEXT') {
    if (this.client && this.connected) {
      this.client.publish({
        destination: `/app/chat/${roomId}/send`,
        body: JSON.stringify({
          content: content,
          messageType: messageType
        })
      });
    }
  }

  /**
   * Join room
   */
  joinRoom(roomId) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: `/app/chat/${roomId}/join`,
        body: JSON.stringify({})
      });
    }
  }

  /**
   * Leave room
   */
  leaveRoom(roomId) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: `/app/chat/${roomId}/leave`,
        body: JSON.stringify({})
      });
    }
  }

  /**
   * Send typing indicator
   */
  sendTypingIndicator(roomId, isTyping) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: `/app/chat/${roomId}/typing`,
        body: JSON.stringify({
          isTyping: isTyping
        })
      });
    }
  }

  /**
   * Handle reconnection
   */
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect chat WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        if (this.userId) {
          const token = localStorage.getItem('token');
          this.connect(this.userId, token);
        }
      }, this.reconnectDelay);
    } else {
      console.error('Max chat WebSocket reconnection attempts reached');
    }
  }

  /**
   * Trigger notification handlers
   */
  triggerNotificationHandlers(notification) {
    // You can implement custom notification handling here
    // For example, show browser notifications, update UI badges, etc.
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(`New message from ${notification.sender?.firstName}`, {
        body: notification.content,
        icon: notification.sender?.profileImage || '/default-avatar.png'
      });
    }
  }

  /**
   * Request notification permission
   */
  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    // Unsubscribe from all rooms
    this.subscriptions.forEach((subscription, key) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    this.subscriptions.clear();
    this.messageHandlers.clear();
    this.typingHandlers.clear();

    // Deactivate client
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.connected = false;
    this.userId = null;
    console.log('Chat WebSocket disconnected');
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.connected;
  }
}

// Create singleton instance
const chatWebSocketService = new ChatWebSocketService();

export default chatWebSocketService;