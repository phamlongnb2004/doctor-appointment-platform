package com.doctorappointment.service;

import com.doctorappointment.dto.*;
import com.doctorappointment.model.*;
import com.doctorappointment.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatParticipantRepository chatParticipantRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Tạo phòng chat mới
     */
    public ChatRoomResponse createChatRoom(ChatRoomRequest request, Long creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tạo roomId unique
        String roomId = UUID.randomUUID().toString();

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setRoomId(roomId);
        chatRoom.setRoomName(request.getRoomName());
        chatRoom.setRoomType(request.getRoomType());
        chatRoom.setCreatedBy(creator);

        chatRoom = chatRoomRepository.save(chatRoom);

        // Thêm creator vào phòng
        ChatParticipant creatorParticipant = new ChatParticipant();
        creatorParticipant.setChatRoom(chatRoom);
        creatorParticipant.setUser(creator);
        creatorParticipant.setRole(ChatParticipant.ParticipantRole.OWNER);
        creatorParticipant.setCanDeleteMessage(true);
        chatParticipantRepository.save(creatorParticipant);

        // Thêm các participants khác
        if (request.getParticipantIds() != null) {
            for (Long participantId : request.getParticipantIds()) {
                if (!participantId.equals(creatorId)) {
                    User participant = userRepository.findById(participantId).orElse(null);
                    if (participant != null) {
                        ChatParticipant chatParticipant = new ChatParticipant();
                        chatParticipant.setChatRoom(chatRoom);
                        chatParticipant.setUser(participant);
                        chatParticipant.setRole(ChatParticipant.ParticipantRole.MEMBER);
                        chatParticipantRepository.save(chatParticipant);
                    }
                }
            }
        }

        return convertToChatRoomResponse(chatRoom, creator);
    }

    /**
     * Tạo hoặc lấy phòng chat private giữa 2 user
     */
    public ChatRoomResponse getOrCreatePrivateRoom(Long user1Id, Long user2Id) {
        User user1 = userRepository.findById(user1Id)
                .orElseThrow(() -> new RuntimeException("User 1 not found"));
        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new RuntimeException("User 2 not found"));

        // Kiểm tra xem đã có phòng private chưa
        Optional<ChatRoom> existingRoom = chatRoomRepository.findPrivateRoomBetweenUsers(user1, user2);
        
        if (existingRoom.isPresent()) {
            return convertToChatRoomResponse(existingRoom.get(), user1);
        }

        // Tạo phòng mới
        String roomId = UUID.randomUUID().toString();
        String roomName = user1.getFirstName() + " & " + user2.getFirstName();

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setRoomId(roomId);
        chatRoom.setRoomName(roomName);
        chatRoom.setRoomType(ChatRoom.RoomType.PRIVATE);
        chatRoom.setCreatedBy(user1);

        chatRoom = chatRoomRepository.save(chatRoom);

        // Thêm cả 2 user vào phòng
        ChatParticipant participant1 = new ChatParticipant();
        participant1.setChatRoom(chatRoom);
        participant1.setUser(user1);
        participant1.setRole(ChatParticipant.ParticipantRole.MEMBER);
        chatParticipantRepository.save(participant1);

        ChatParticipant participant2 = new ChatParticipant();
        participant2.setChatRoom(chatRoom);
        participant2.setUser(user2);
        participant2.setRole(ChatParticipant.ParticipantRole.MEMBER);
        chatParticipantRepository.save(participant2);

        return convertToChatRoomResponse(chatRoom, user1);
    }

    /**
     * Gửi tin nhắn
     */
    public ChatMessageResponse sendMessage(ChatMessageRequest request, Long senderId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        ChatRoom chatRoom = chatRoomRepository.findByRoomId(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        // Kiểm tra quyền gửi tin nhắn
        ChatParticipant senderParticipant = chatParticipantRepository
                .findByChatRoomAndUserAndIsActiveTrue(chatRoom, sender)
                .orElseThrow(() -> new RuntimeException("User is not a participant of this room"));

        if (!senderParticipant.isCanSendMessage()) {
            throw new RuntimeException("User does not have permission to send messages");
        }

        // Tạo tin nhắn
        ChatMessage message = new ChatMessage();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setContent(request.getContent());
        message.setMessageType(request.getMessageType());
        message.setAttachmentUrl(request.getAttachmentUrl());

        message = chatMessageRepository.save(message);

        // Cập nhật thời gian của phòng chat
        chatRoom.setUpdatedAt(LocalDateTime.now());
        chatRoomRepository.save(chatRoom);

        ChatMessageResponse response = convertToChatMessageResponse(message);

        // Gửi tin nhắn real-time qua WebSocket
        messagingTemplate.convertAndSend("/topic/chat/" + request.getRoomId(), response);

        // Gửi thông báo cho các participants khác
        List<ChatParticipant> otherParticipants = chatParticipantRepository
                .findOtherParticipants(chatRoom, sender);
        
        for (ChatParticipant participant : otherParticipants) {
            messagingTemplate.convertAndSendToUser(
                participant.getUser().getId().toString(),
                "/queue/chat/notification",
                response
            );
        }

        return response;
    }

    /**
     * Lấy danh sách phòng chat của user
     */
    public List<ChatRoomResponse> getUserChatRooms(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ChatRoom> chatRooms = chatRoomRepository.findByUserParticipant(user);

        return chatRooms.stream()
                .map(room -> convertToChatRoomResponse(room, user))
                .collect(Collectors.toList());
    }

    /**
     * Lấy tin nhắn trong phòng chat
     */
    public List<ChatMessageResponse> getRoomMessages(String roomId, Long userId, int page, int size) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatRoom chatRoom = chatRoomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        // Kiểm tra quyền truy cập
        if (!chatParticipantRepository.existsByChatRoomAndUserAndIsActiveTrue(chatRoom, user)) {
            throw new RuntimeException("User does not have access to this room");
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<ChatMessage> messages = chatMessageRepository
                .findByChatRoomAndIsDeletedFalseOrderBySentAtDesc(chatRoom, pageable);

        return messages.getContent().stream()
                .map(this::convertToChatMessageResponse)
                .collect(Collectors.toList());
    }

    /**
     * Đánh dấu tin nhắn đã đọc
     */
    public void markMessagesAsRead(String roomId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatRoom chatRoom = chatRoomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        List<ChatMessage> unreadMessages = chatMessageRepository.findUnreadMessages(chatRoom, user);
        
        for (ChatMessage message : unreadMessages) {
            message.setRead(true);
        }
        
        chatMessageRepository.saveAll(unreadMessages);

        // Cập nhật lastReadAt của participant
        Optional<ChatParticipant> participant = chatParticipantRepository
                .findByChatRoomAndUserAndIsActiveTrue(chatRoom, user);
        
        if (participant.isPresent()) {
            participant.get().setLastReadAt(LocalDateTime.now());
            chatParticipantRepository.save(participant.get());
        }
    }

    /**
     * Thêm participant vào phòng chat
     */
    public void addParticipant(String roomId, Long userId, Long participantId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User newParticipant = userRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        ChatRoom chatRoom = chatRoomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        // Kiểm tra quyền thêm participant (chỉ owner và admin)
        ChatParticipant userParticipant = chatParticipantRepository
                .findByChatRoomAndUserAndIsActiveTrue(chatRoom, user)
                .orElseThrow(() -> new RuntimeException("User is not a participant"));

        if (userParticipant.getRole() != ChatParticipant.ParticipantRole.OWNER &&
            userParticipant.getRole() != ChatParticipant.ParticipantRole.ADMIN) {
            throw new RuntimeException("User does not have permission to add participants");
        }

        // Kiểm tra xem participant đã có trong phòng chưa
        if (chatParticipantRepository.existsByChatRoomAndUserAndIsActiveTrue(chatRoom, newParticipant)) {
            throw new RuntimeException("User is already a participant");
        }

        // Thêm participant mới
        ChatParticipant participant = new ChatParticipant();
        participant.setChatRoom(chatRoom);
        participant.setUser(newParticipant);
        participant.setRole(ChatParticipant.ParticipantRole.MEMBER);
        chatParticipantRepository.save(participant);

        // Gửi thông báo
        ChatMessage systemMessage = new ChatMessage();
        systemMessage.setChatRoom(chatRoom);
        systemMessage.setSender(user);
        systemMessage.setContent(newParticipant.getFirstName() + " " + newParticipant.getLastName() + " đã được thêm vào nhóm");
        systemMessage.setMessageType(ChatMessage.MessageType.SYSTEM);
        chatMessageRepository.save(systemMessage);

        ChatMessageResponse notification = convertToChatMessageResponse(systemMessage);
        messagingTemplate.convertAndSend("/topic/chat/" + roomId, notification);
    }

    /**
     * Kiểm tra quyền chat giữa 2 user
     */
    public boolean canUsersChat(Long user1Id, Long user2Id) {
        User user1 = userRepository.findById(user1Id).orElse(null);
        User user2 = userRepository.findById(user2Id).orElse(null);

        if (user1 == null || user2 == null) {
            return false;
        }

        User.UserRole role1 = user1.getRole();
        User.UserRole role2 = user2.getRole();

        // Admin có thể chat với tất cả
        if (role1 == User.UserRole.ADMIN || role2 == User.UserRole.ADMIN) {
            return true;
        }

        // Consultant có thể chat với Patient và Doctor
        if (role1 == User.UserRole.CONSULTANT || role2 == User.UserRole.CONSULTANT) {
            return true;
        }

        // Doctor có thể chat với Patient và Consultant
        if ((role1 == User.UserRole.DOCTOR && role2 == User.UserRole.PATIENT) ||
            (role1 == User.UserRole.PATIENT && role2 == User.UserRole.DOCTOR)) {
            return true;
        }

        return false;
    }

    // Helper methods
    private ChatRoomResponse convertToChatRoomResponse(ChatRoom chatRoom, User currentUser) {
        ChatRoomResponse response = new ChatRoomResponse();
        response.setId(chatRoom.getId());
        response.setRoomId(chatRoom.getRoomId());
        response.setRoomName(chatRoom.getRoomName());
        response.setRoomType(chatRoom.getRoomType());
        response.setCreatedAt(chatRoom.getCreatedAt());
        response.setUpdatedAt(chatRoom.getUpdatedAt());
        response.setActive(chatRoom.isActive());

        // Set creator
        if (chatRoom.getCreatedBy() != null) {
            response.setCreatedBy(convertToUserResponse(chatRoom.getCreatedBy()));
        }

        // Set participants
        List<ChatParticipant> participants = chatParticipantRepository.findByChatRoomAndIsActiveTrue(chatRoom);
        response.setParticipants(participants.stream()
                .map(this::convertToParticipantResponse)
                .collect(Collectors.toList()));

        // Set participant count
        response.setParticipantCount((long) participants.size());

        // Set unread count
        Long unreadCount = chatMessageRepository.countUnreadMessages(chatRoom, currentUser);
        response.setUnreadCount(unreadCount);

        return response;
    }

    private ChatMessageResponse convertToChatMessageResponse(ChatMessage message) {
        ChatMessageResponse response = new ChatMessageResponse();
        response.setId(message.getId());
        response.setRoomId(message.getChatRoom().getRoomId());
        response.setSender(convertToUserResponse(message.getSender()));
        response.setContent(message.getContent());
        response.setMessageType(message.getMessageType());
        response.setAttachmentUrl(message.getAttachmentUrl());
        response.setSentAt(message.getSentAt());
        response.setRead(message.isRead());
        response.setEdited(message.isEdited());
        response.setDeleted(message.isDeleted());
        response.setEditedAt(message.getEditedAt());
        return response;
    }

    private ChatRoomResponse.ParticipantResponse convertToParticipantResponse(ChatParticipant participant) {
        ChatRoomResponse.ParticipantResponse response = new ChatRoomResponse.ParticipantResponse();
        response.setId(participant.getId());
        response.setUser(convertToUserResponse(participant.getUser()));
        response.setRole(participant.getRole().name());
        response.setJoinedAt(participant.getJoinedAt());
        response.setActive(participant.isActive());
        response.setCanSendMessage(participant.isCanSendMessage());
        return response;
    }

    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole().name());
        response.setProfileImage(user.getProfileImage());
        response.setActive(user.isActive());
        return response;
    }
}