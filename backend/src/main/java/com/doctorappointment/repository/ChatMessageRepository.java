package com.doctorappointment.repository;

import com.doctorappointment.model.ChatMessage;
import com.doctorappointment.model.ChatRoom;
import com.doctorappointment.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    Page<ChatMessage> findByChatRoomAndIsDeletedFalseOrderBySentAtDesc(ChatRoom chatRoom, Pageable pageable);
    
    List<ChatMessage> findByChatRoomAndIsDeletedFalseOrderBySentAtAsc(ChatRoom chatRoom);
    
    @Query("SELECT cm FROM ChatMessage cm " +
           "WHERE cm.chatRoom = :chatRoom AND cm.isDeleted = false " +
           "AND cm.sentAt > :since " +
           "ORDER BY cm.sentAt ASC")
    List<ChatMessage> findRecentMessages(@Param("chatRoom") ChatRoom chatRoom, @Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(cm) FROM ChatMessage cm " +
           "WHERE cm.chatRoom = :chatRoom AND cm.sender != :user " +
           "AND cm.isRead = false AND cm.isDeleted = false")
    Long countUnreadMessages(@Param("chatRoom") ChatRoom chatRoom, @Param("user") User user);
    
    @Query("SELECT cm FROM ChatMessage cm " +
           "WHERE cm.chatRoom = :chatRoom AND cm.sender != :user " +
           "AND cm.isRead = false AND cm.isDeleted = false " +
           "ORDER BY cm.sentAt ASC")
    List<ChatMessage> findUnreadMessages(@Param("chatRoom") ChatRoom chatRoom, @Param("user") User user);
    
    List<ChatMessage> findBySenderAndChatRoomAndIsDeletedFalse(User sender, ChatRoom chatRoom);
    
    @Query("SELECT cm FROM ChatMessage cm " +
           "WHERE cm.chatRoom IN :chatRooms AND cm.isDeleted = false " +
           "ORDER BY cm.sentAt DESC")
    List<ChatMessage> findLatestMessagesByRooms(@Param("chatRooms") List<ChatRoom> chatRooms);
}