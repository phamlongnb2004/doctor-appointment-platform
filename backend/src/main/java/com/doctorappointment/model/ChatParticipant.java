package com.doctorappointment.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_participants")
public class ChatParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipantRole role;

    @Column(nullable = false)
    private LocalDateTime joinedAt;

    private LocalDateTime leftAt;

    @Column(nullable = false)
    private boolean isActive = true;

    @Column(nullable = false)
    private boolean canSendMessage = true;

    @Column(nullable = false)
    private boolean canDeleteMessage = false;

    private LocalDateTime lastReadAt;

    // Constructors
    public ChatParticipant() {}

    public ChatParticipant(ChatRoom chatRoom, User user, ParticipantRole role) {
        this.chatRoom = chatRoom;
        this.user = user;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ChatRoom getChatRoom() { return chatRoom; }
    public void setChatRoom(ChatRoom chatRoom) { this.chatRoom = chatRoom; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public ParticipantRole getRole() { return role; }
    public void setRole(ParticipantRole role) { this.role = role; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }

    public LocalDateTime getLeftAt() { return leftAt; }
    public void setLeftAt(LocalDateTime leftAt) { this.leftAt = leftAt; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public boolean isCanSendMessage() { return canSendMessage; }
    public void setCanSendMessage(boolean canSendMessage) { this.canSendMessage = canSendMessage; }

    public boolean isCanDeleteMessage() { return canDeleteMessage; }
    public void setCanDeleteMessage(boolean canDeleteMessage) { this.canDeleteMessage = canDeleteMessage; }

    public LocalDateTime getLastReadAt() { return lastReadAt; }
    public void setLastReadAt(LocalDateTime lastReadAt) { this.lastReadAt = lastReadAt; }

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
        lastReadAt = LocalDateTime.now();
    }

    public enum ParticipantRole {
        OWNER,      // Người tạo phòng
        ADMIN,      // Quản trị viên phòng
        MODERATOR,  // Người điều hành
        MEMBER      // Thành viên thường
    }
}