package com.doctorappointment.controller;

import com.doctorappointment.dto.*;
import com.doctorappointment.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;

    /**
     * Tạo phòng chat mới
     */
    @PostMapping("/rooms")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('CONSULTANT')")
    public ResponseEntity<ChatRoomResponse> createChatRoom(
            @RequestBody ChatRoomRequest request,
            @RequestParam Long creatorId) {
        try {
            ChatRoomResponse response = chatService.createChatRoom(request, creatorId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating chat room: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tạo hoặc lấy phòng chat private
     */
    @PostMapping("/rooms/private")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('CONSULTANT') or hasRole('PATIENT')")
    public ResponseEntity<ChatRoomResponse> getOrCreatePrivateRoom(
            @RequestParam Long user1Id,
            @RequestParam Long user2Id) {
        try {
            // Kiểm tra quyền chat
            if (!chatService.canUsersChat(user1Id, user2Id)) {
                return ResponseEntity.status(403).build();
            }

            ChatRoomResponse response = chatService.getOrCreatePrivateRoom(user1Id, user2Id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating private room: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy danh sách phòng chat của user
     */
    @GetMapping("/rooms")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('CONSULTANT') or hasRole('PATIENT')")
    public ResponseEntity<List<ChatRoomResponse>> getUserChatRooms(@RequestParam Long userId) {
        try {
            List<ChatRoomResponse> rooms = chatService.getUserChatRooms(userId);
            return ResponseEntity.ok(rooms);
        } catch (Exception e) {
            log.error("Error getting user chat rooms: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy tin nhắn trong phòng
     */
    @GetMapping("/rooms/{roomId}/messages")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('CONSULTANT') or hasRole('PATIENT')")
    public ResponseEntity<List<ChatMessageResponse>> getRoomMessages(
            @PathVariable String roomId,
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        try {
            List<ChatMessageResponse> messages = chatService.getRoomMessages(roomId, userId, page, size);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            log.error("Error getting room messages: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Gửi tin nhắn qua REST API
     */
    @PostMapping("/messages")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('CONSULTANT') or hasRole('PATIENT')")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @RequestBody ChatMessageRequest request,
            @RequestParam Long senderId) {
        try {
            ChatMessageResponse response = chatService.sendMessage(request, senderId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error sending message: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Đánh dấu tin nhắn đã đọc
     */
    @PutMapping("/rooms/{roomId}/read")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('CONSULTANT') or hasRole('PATIENT')")
    public ResponseEntity<Void> markMessagesAsRead(
            @PathVariable String roomId,
            @RequestParam Long userId) {
        try {
            chatService.markMessagesAsRead(roomId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error marking messages as read: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Thêm participant vào phòng
     */
    @PostMapping("/rooms/{roomId}/participants")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('CONSULTANT')")
    public ResponseEntity<Void> addParticipant(
            @PathVariable String roomId,
            @RequestParam Long userId,
            @RequestParam Long participantId) {
        try {
            chatService.addParticipant(roomId, userId, participantId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error adding participant: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Kiểm tra quyền chat
     */
    @GetMapping("/can-chat")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('CONSULTANT') or hasRole('PATIENT')")
    public ResponseEntity<Map<String, Boolean>> canUsersChat(
            @RequestParam Long user1Id,
            @RequestParam Long user2Id) {
        boolean canChat = chatService.canUsersChat(user1Id, user2Id);
        return ResponseEntity.ok(Map.of("canChat", canChat));
    }

    // WebSocket endpoints
    /**
     * Gửi tin nhắn qua WebSocket
     * Chỉ dùng để broadcast tin nhắn, không lưu vào database
     * Database sẽ được xử lý qua REST API
     */
    @MessageMapping("/chat/{roomId}/send")
    @SendTo("/topic/chat/{roomId}")
    public Map<String, Object> sendMessageViaWebSocket(
            @DestinationVariable String roomId,
            Map<String, Object> messageData,
            Principal principal) {
        try {
            Long senderId = extractUserIdFromPrincipal(principal);
            log.info("Broadcasting message from user {} to room {}", senderId, roomId);
            
            // Chỉ broadcast tin nhắn, không lưu database
            // Database sẽ được xử lý qua REST API
            return Map.of(
                "type", "MESSAGE_BROADCAST",
                "senderId", senderId,
                "roomId", roomId,
                "content", messageData.get("content"),
                "messageType", messageData.getOrDefault("messageType", "TEXT"),
                "timestamp", System.currentTimeMillis()
            );
        } catch (Exception e) {
            log.error("Error broadcasting message via WebSocket: ", e);
            return Map.of("error", "Failed to broadcast message");
        }
    }

    /**
     * Join phòng chat qua WebSocket
     */
    @MessageMapping("/chat/{roomId}/join")
    @SendTo("/topic/chat/{roomId}")
    public Map<String, Object> joinRoom(
            @DestinationVariable String roomId,
            Principal principal) {
        try {
            Long userId = extractUserIdFromPrincipal(principal);
            log.info("User {} joined room {}", userId, roomId);
            
            return Map.of(
                "type", "USER_JOINED",
                "userId", userId,
                "roomId", roomId,
                "timestamp", System.currentTimeMillis()
            );
        } catch (Exception e) {
            log.error("Error joining room: ", e);
            return Map.of("error", "Failed to join room");
        }
    }

    /**
     * Leave phòng chat qua WebSocket
     */
    @MessageMapping("/chat/{roomId}/leave")
    @SendTo("/topic/chat/{roomId}")
    public Map<String, Object> leaveRoom(
            @DestinationVariable String roomId,
            Principal principal) {
        try {
            Long userId = extractUserIdFromPrincipal(principal);
            log.info("User {} left room {}", userId, roomId);
            
            return Map.of(
                "type", "USER_LEFT",
                "userId", userId,
                "roomId", roomId,
                "timestamp", System.currentTimeMillis()
            );
        } catch (Exception e) {
            log.error("Error leaving room: ", e);
            return Map.of("error", "Failed to leave room");
        }
    }

    /**
     * Typing indicator qua WebSocket
     */
    @MessageMapping("/chat/{roomId}/typing")
    @SendTo("/topic/chat/{roomId}/typing")
    public Map<String, Object> userTyping(
            @DestinationVariable String roomId,
            Map<String, Object> typingData,
            Principal principal) {
        try {
            Long userId = extractUserIdFromPrincipal(principal);
            
            return Map.of(
                "type", "USER_TYPING",
                "userId", userId,
                "roomId", roomId,
                "isTyping", typingData.get("isTyping"),
                "timestamp", System.currentTimeMillis()
            );
        } catch (Exception e) {
            log.error("Error handling typing indicator: ", e);
            return Map.of("error", "Failed to handle typing");
        }
    }

    // Helper method to extract user ID from JWT principal
    private Long extractUserIdFromPrincipal(Principal principal) {
        // This is a placeholder - you'll need to implement this based on your JWT setup
        // For now, we'll extract from the principal name or implement JWT token parsing
        if (principal != null && principal.getName() != null) {
            // You might need to parse JWT token here to get user ID
            // For now, assuming principal name contains user ID
            try {
                return Long.parseLong(principal.getName());
            } catch (NumberFormatException e) {
                log.warn("Could not parse user ID from principal: {}", principal.getName());
                return 1L; // Default fallback
            }
        }
        return 1L; // Default fallback
    }
}