package com.doctorappointment.service;

import com.doctorappointment.model.UserSession;
import com.doctorappointment.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Service to manage user sessions and online status
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserSessionService {
    private final UserSessionRepository userSessionRepository;

    // In-memory cache for quick online status lookup
    private final Map<Long, Boolean> onlineUsersCache = new ConcurrentHashMap<>();

    // Session timeout in minutes
    private static final int SESSION_TIMEOUT_MINUTES = 5;

    /**
     * Register a new user session when they log in
     */
    @Transactional
    public UserSession registerSession(Long userId, String sessionId, String ipAddress, String userAgent) {
        // Mark any existing sessions for this user as offline
        userSessionRepository.markUserOffline(userId);

        // Create new session
        UserSession session = new UserSession(userId, sessionId, ipAddress, userAgent);
        session = userSessionRepository.save(session);

        // Update cache
        onlineUsersCache.put(userId, true);

        log.info("User {} session registered, online status: true", userId);
        return session;
    }

    /**
     * Update user activity (heartbeat)
     */
    @Transactional
    public void updateActivity(String sessionId) {
        Optional<UserSession> sessionOpt = userSessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isPresent()) {
            UserSession session = sessionOpt.get();
            session.updateActivity();
            userSessionRepository.save(session);
            log.debug("Session {} activity updated", sessionId);
        }
    }

    /**
     * Mark user as offline (logout)
     */
    @Transactional
    public void logout(Long userId) {
        userSessionRepository.markUserOffline(userId);
        onlineUsersCache.put(userId, false);
        log.info("User {} marked as offline", userId);
    }

    /**
     * Mark user as offline by session ID
     */
    @Transactional
    public void logoutBySession(String sessionId) {
        Optional<UserSession> sessionOpt = userSessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isPresent()) {
            UserSession session = sessionOpt.get();
            session.markOffline();
            userSessionRepository.save(session);
            onlineUsersCache.put(session.getUserId(), false);
            log.info("Session {} logged out, user {} marked as offline", sessionId, session.getUserId());
        }
    }

    /**
     * Check if user is online
     */
    public boolean isUserOnline(Long userId) {
        // Check cache first
        Boolean cached = onlineUsersCache.get(userId);
        if (cached != null) {
            return cached;
        }

        // Fallback to database
        boolean online = userSessionRepository.existsByUserIdAndOnlineTrue(userId);
        onlineUsersCache.put(userId, online);
        return online;
    }

    /**
     * Get all online users
     */
    @Transactional(readOnly = true)
    public List<UserSession> getOnlineUsers() {
        return userSessionRepository.findByOnlineTrue();
    }

    /**
     * Get online status for multiple users
     */
    @Transactional(readOnly = true)
    public Map<Long, Boolean> getOnlineStatusForUsers(List<Long> userIds) {
        List<UserSession> onlineSessions = userSessionRepository.findByUserIdInAndOnlineTrue(userIds);
        return userIds.stream()
                .collect(Collectors.toMap(
                        userId -> userId,
                        userId -> onlineSessions.stream()
                                .anyMatch(s -> s.getUserId().equals(userId))
                ));
    }

    /**
     * Get count of online users
     */
    public long getOnlineUserCount() {
        return userSessionRepository.countByOnlineTrue();
    }

    /**
     * Scheduled task to clean up expired sessions
     * Runs every 10 minutes (optimized for free tier)
     */
    @Scheduled(fixedRate = 60000) // Every 10 minutes
    @Transactional
    public void cleanupExpiredSessions() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(SESSION_TIMEOUT_MINUTES);
        List<UserSession> expiredSessions = userSessionRepository.findExpiredSessions(threshold);

        for (UserSession session : expiredSessions) {
            session.markOffline();
            userSessionRepository.save(session);
            onlineUsersCache.put(session.getUserId(), false);
            log.debug("Session {} expired, user {} marked as offline", session.getSessionId(), session.getUserId());
        }

        if (!expiredSessions.isEmpty()) {
            log.info("Cleaned up {} expired sessions", expiredSessions.size());
        }
    }

    /**
     * Clear all sessions for a user
     */
    @Transactional
    public void clearUserSessions(Long userId) {
        userSessionRepository.markUserOffline(userId);
        onlineUsersCache.remove(userId);
        log.info("All sessions cleared for user {}", userId);
    }

    /**
     * Get session by session ID
     */
    @Transactional(readOnly = true)
    public Optional<UserSession> getSession(String sessionId) {
        return userSessionRepository.findBySessionId(sessionId);
    }
}
