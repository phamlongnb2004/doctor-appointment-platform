package com.doctorappointment.repository;

import com.doctorappointment.model.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {

    /**
     * Find active session by user ID
     */
    Optional<UserSession> findByUserIdAndOnlineTrue(Long userId);

    /**
     * Find session by session ID
     */
    Optional<UserSession> findBySessionId(String sessionId);

    /**
     * Find all online users
     */
    List<UserSession> findByOnlineTrue();

    /**
     * Find online users by user IDs
     */
    List<UserSession> findByUserIdInAndOnlineTrue(List<Long> userIds);

    /**
     * Find expired sessions (no activity for specified time)
     */
    @Query("SELECT s FROM UserSession s WHERE s.online = true AND s.lastActivityTime < :threshold")
    List<UserSession> findExpiredSessions(@Param("threshold") LocalDateTime threshold);

    /**
     * Update online status for a user
     */
    @Modifying
    @Query("UPDATE UserSession s SET s.online = :online, s.lastActivityTime = :activityTime WHERE s.userId = :userId")
    void updateOnlineStatus(@Param("userId") Long userId, @Param("online") boolean online, @Param("activityTime") LocalDateTime activityTime);

    /**
     * Update last activity time
     */
    @Modifying
    @Query("UPDATE UserSession s SET s.lastActivityTime = :activityTime WHERE s.sessionId = :sessionId")
    void updateLastActivityTime(@Param("sessionId") String sessionId, @Param("activityTime") LocalDateTime activityTime);

    /**
     * Mark all sessions for a user as offline
     */
    @Modifying
    @Query("UPDATE UserSession s SET s.online = false WHERE s.userId = :userId")
    void markUserOffline(@Param("userId") Long userId);

    /**
     * Count online users
     */
    long countByOnlineTrue();

    /**
     * Check if user is online
     */
    boolean existsByUserIdAndOnlineTrue(Long userId);
}
