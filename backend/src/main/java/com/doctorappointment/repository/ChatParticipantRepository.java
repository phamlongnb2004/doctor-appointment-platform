package com.doctorappointment.repository;

import com.doctorappointment.model.ChatParticipant;
import com.doctorappointment.model.ChatRoom;
import com.doctorappointment.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatParticipantRepository extends JpaRepository<ChatParticipant, Long> {
    
    List<ChatParticipant> findByChatRoomAndIsActiveTrue(ChatRoom chatRoom);
    
    List<ChatParticipant> findByUserAndIsActiveTrue(User user);
    
    Optional<ChatParticipant> findByChatRoomAndUserAndIsActiveTrue(ChatRoom chatRoom, User user);
    
    @Query("SELECT cp FROM ChatParticipant cp " +
           "WHERE cp.chatRoom = :chatRoom AND cp.user != :excludeUser AND cp.isActive = true")
    List<ChatParticipant> findOtherParticipants(@Param("chatRoom") ChatRoom chatRoom, @Param("excludeUser") User excludeUser);
    
    @Query("SELECT COUNT(cp) FROM ChatParticipant cp " +
           "WHERE cp.chatRoom = :chatRoom AND cp.isActive = true")
    Long countByChatRoomAndIsActiveTrue(@Param("chatRoom") ChatRoom chatRoom);
    
    boolean existsByChatRoomAndUserAndIsActiveTrue(ChatRoom chatRoom, User user);
}