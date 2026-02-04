package com.doctorappointment.dto;

import com.doctorappointment.model.ChatMessage;

import java.time.LocalDateTime;

public class ChatMessageResponse {
    private Long id;
    private String roomId;
    private UserResponse sender;
    private String content;
    private ChatMessage.MessageType messageType;
    private String attachmentUrl;
    private LocalDateTime sentAt;
    private boolean isRead;
    private boolean isEdited;
    private boolean isDeleted;
    private LocalDateTime editedAt;

    // Constructors
    public ChatMessageResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public UserResponse getSender() { return sender; }
    public void setSender(UserResponse sender) { this.sender = sender; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public ChatMessage.MessageType getMessageType() { return messageType; }
    public void setMessageType(ChatMessage.MessageType messageType) { this.messageType = messageType; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public boolean isEdited() { return isEdited; }
    public void setEdited(boolean edited) { isEdited = edited; }

    public boolean isDeleted() { return isDeleted; }
    public void setDeleted(boolean deleted) { isDeleted = deleted; }

    public LocalDateTime getEditedAt() { return editedAt; }
    public void setEditedAt(LocalDateTime editedAt) { this.editedAt = editedAt; }
}