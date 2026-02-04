package com.doctorappointment.dto;

import com.doctorappointment.model.ChatMessage;

public class ChatMessageRequest {
    private String roomId;
    private String content;
    private ChatMessage.MessageType messageType;
    private String attachmentUrl;

    // Constructors
    public ChatMessageRequest() {}

    public ChatMessageRequest(String roomId, String content, ChatMessage.MessageType messageType) {
        this.roomId = roomId;
        this.content = content;
        this.messageType = messageType;
    }

    // Getters and Setters
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public ChatMessage.MessageType getMessageType() { return messageType; }
    public void setMessageType(ChatMessage.MessageType messageType) { this.messageType = messageType; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }
}