package com.doctorappointment.repository;

import com.doctorappointment.model.ChatRoom;
import com.doctorappointment.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    
    Optional<ChatRoom> findByRoomId(String roomId);
    
    List<ChatRoom> findByActiveTrue();
    
    List<ChatRoom> findByRoomTypeAndActiveTrue(ChatRoom.RoomType roomType);
    
    @Query("SELECT cr FROM ChatRoom cr " +
           "JOIN cr.participants cp " +
           "WHERE cp.user = :user AND cp.isActive = true AND cr.active = true " +
           "ORDER BY cr.updatedAt DESC")
    List<ChatRoom> findByUserParticipant(@Param("user") User user);
    
    @Query("SELECT cr FROM ChatRoom cr " +
           "JOIN cr.participants cp1 " +
           "JOIN cr.participants cp2 " +
           "WHERE cp1.user = :user1 AND cp2.user = :user2 " +
           "AND cr.roomType = 'PRIVATE' AND cr.active = true " +
           "AND cp1.isActive = true AND cp2.isActive = true")
    Optional<ChatRoom> findPrivateRoomBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);
    
    @Query("SELECT COUNT(cp) FROM ChatParticipant cp " +
           "WHERE cp.chatRoom = :chatRoom AND cp.isActive = true")
    Long countActiveParticipants(@Param("chatRoom") ChatRoom chatRoom);
}