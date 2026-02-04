package com.doctorappointment.dto;

import com.doctorappointment.model.ChatRoom;
import com.doctorappointment.model.User;

import java.time.LocalDateTime;
import java.util.List;

public class ChatRoomResponse {
    private Long id;
    private String roomId;
    private String roomName;
    private ChatRoom.RoomType roomType;
    private UserResponse createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean active;
    private List<ParticipantResponse> participants;
    private ChatMessageResponse lastMessage;
    private Long unreadCount;
    private Long participantCount;

    // Constructors
    public ChatRoomResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public ChatRoom.RoomType getRoomType() { return roomType; }
    public void setRoomType(ChatRoom.RoomType roomType) { this.roomType = roomType; }

    public UserResponse getCreatedBy() { return createdBy; }
    public void setCreatedBy(UserResponse createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public List<ParticipantResponse> getParticipants() { return participants; }
    public void setParticipants(List<ParticipantResponse> participants) { this.participants = participants; }

    public ChatMessageResponse getLastMessage() { return lastMessage; }
    public void setLastMessage(ChatMessageResponse lastMessage) { this.lastMessage = lastMessage; }

    public Long getUnreadCount() { return unreadCount; }
    public void setUnreadCount(Long unreadCount) { this.unreadCount = unreadCount; }

    public Long getParticipantCount() { return participantCount; }
    public void setParticipantCount(Long participantCount) { this.participantCount = participantCount; }

    public static class ParticipantResponse {
        private Long id;
        private UserResponse user;
        private String role;
        private LocalDateTime joinedAt;
        private boolean isActive;
        private boolean canSendMessage;

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public UserResponse getUser() { return user; }
        public void setUser(UserResponse user) { this.user = user; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public LocalDateTime getJoinedAt() { return joinedAt; }
        public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }

        public boolean isActive() { return isActive; }
        public void setActive(boolean active) { isActive = active; }

        public boolean isCanSendMessage() { return canSendMessage; }
        public void setCanSendMessage(boolean canSendMessage) { this.canSendMessage = canSendMessage; }
    }
}