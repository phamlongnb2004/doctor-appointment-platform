package com.doctorappointment.dto;

import com.doctorappointment.model.ChatRoom;

import java.util.List;

public class ChatRoomRequest {
    private String roomName;
    private ChatRoom.RoomType roomType;
    private List<Long> participantIds;
    private String description;

    // Constructors
    public ChatRoomRequest() {}

    public ChatRoomRequest(String roomName, ChatRoom.RoomType roomType, List<Long> participantIds) {
        this.roomName = roomName;
        this.roomType = roomType;
        this.participantIds = participantIds;
    }

    // Getters and Setters
    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public ChatRoom.RoomType getRoomType() { return roomType; }
    public void setRoomType(ChatRoom.RoomType roomType) { this.roomType = roomType; }

    public List<Long> getParticipantIds() { return participantIds; }
    public void setParticipantIds(List<Long> participantIds) { this.participantIds = participantIds; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}