// WebSocket service for real-time user status updates
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = [];
    this.userId = null;
    this.sessionId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  /**
   * Connect to WebSocket server
   * @param {number} userId - Current user's ID
   * @param {string} sessionId - Session ID from login
   * @param {function} onStatusChange - Callback for status changes
   */
  connect(userId, sessionId, onStatusChange) {
    this.userId = userId;
    this.sessionId = sessionId;

    // Create SockJS connection - use environment variable
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
    const WS_URL = API_BASE_URL.replace('/api', '') + '/api/ws';
    const socket = new SockJS(WS_URL);

    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connected');
        this.connected = true;
        this.reconnectAttempts = 0;

        // Subscribe to user status updates
        const statusSubscription = this.client.subscribe('/topic/user/status', (message) => {
          try {
            const data = JSON.parse(message.body);
            console.log('Received status update:', data);
            if (onStatusChange) {
              onStatusChange(data);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        });
        this.subscriptions.push(statusSubscription);

        // Send login event
        this.sendLogin();
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        this.connected = false;
      },
      onStompError: (error) => {
        console.error('STOMP error:', error);
        this.handleReconnect();
      },
      onWebSocketClose: () => {
        console.log('WebSocket closed');
        this.connected = false;
        this.handleReconnect();
      }
    });

    this.client.activate();
  }

  /**
   * Handle reconnection logic
   */
  handleReconnect() {
    // Don't reconnect if no userId or sessionId (user not logged in)
    if (!this.userId || !this.sessionId) {
      console.log('No user session, skipping reconnect');
      return;
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => {
        if (this.userId && this.sessionId) {
          this.connect(this.userId, this.sessionId, this.subscriptions[0]?.callback);
        }
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  /**
   * Send login event to server
   */
  sendLogin() {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/user/login',
        body: JSON.stringify({
          userId: this.userId,
          sessionId: this.sessionId
        })
      });
      console.log('Login event sent for user:', this.userId);
    }
  }

  /**
   * Send heartbeat to keep connection alive
   */
  sendHeartbeat() {
    if (this.client && this.connected && this.sessionId) {
      this.client.publish({
        destination: `/app/user/heartbeat/${this.sessionId}`,
        body: JSON.stringify({})
      });
    }
  }

  /**
   * Send logout event to server
   */
  sendLogout() {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/user/logout',
        body: JSON.stringify({
          userId: this.userId,
          sessionId: this.sessionId
        })
      });
      console.log('Logout event sent for user:', this.userId);
    }
  }

  /**
   * Get online count
   */
  getOnlineCount() {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/user/online-count',
        body: JSON.stringify({})
      });
    }
  }

  /**
   * Get batch user status
   * @param {number[]} userIds - Array of user IDs
   */
  getBatchUserStatus(userIds) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/user/status/batch',
        body: JSON.stringify({ userIds })
      });
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    // Send logout event before disconnecting
    this.sendLogout();

    // Unsubscribe from all topics
    this.subscriptions.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
    this.subscriptions = [];

    // Deactivate client
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.connected = false;
    this.userId = null;
    this.sessionId = null;
    console.log('WebSocket disconnected');
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.connected;
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
