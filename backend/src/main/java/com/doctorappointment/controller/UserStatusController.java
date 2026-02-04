package com.doctorappointment.controller;

import com.doctorappointment.service.UserSessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * WebSocket Controller for handling user status updates
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class UserStatusController {

    private final UserSessionService userSessionService;

    // Store session to user ID mapping
    private final Map<String, Long> sessionToUserMap = new ConcurrentHashMap<>();

    // Store connected sessions
    private final Map<String, String> connectedSessions = new ConcurrentHashMap<>();

    /**
     * Handle user login/connection event
     * Client sends: /app/user/login
     * Response sent to: /topic/user/status
     */
    @MessageMapping("/user/login")
    @SendTo("/topic/user/status")
    public Map<String, Object> handleUserLogin(Map<String, Object> message, SimpMessageHeaderAccessor headerAccessor) {
        Long userId = Long.valueOf(message.get("userId").toString());
        String sessionId = message.get("sessionId") != null ? message.get("sessionId").toString() : headerAccessor.getSessionId();

        log.info("User {} connected via WebSocket, session: {}", userId, sessionId);

        // Store session mapping
        if (sessionId != null) {
            sessionToUserMap.put(sessionId, userId);
            connectedSessions.put(sessionId, "connected");
        }

        // Update user status in database
        String ipAddress = headerAccessor.getSessionAttributes() != null ?
                (String) headerAccessor.getSessionAttributes().get("ipAddress") : "unknown";
        String userAgent = headerAccessor.getSessionAttributes() != null ?
                (String) headerAccessor.getSessionAttributes().get("userAgent") : "unknown";

        userSessionService.registerSession(userId, sessionId, ipAddress, userAgent);

        // Broadcast updated user status
        return Map.of(
                "type", "USER_LOGIN",
                "userId", userId,
                "sessionId", sessionId,
                "status", "online",
                "timestamp", LocalDateTime.now().toString(),
                "onlineCount", userSessionService.getOnlineUserCount()
        );
    }

    /**
     * Handle user heartbeat/activity update
     * Client sends: /app/user/heartbeat/{sessionId}
     * Response sent to: /topic/user/status
     */
    @MessageMapping("/user/heartbeat/{sessionId}")
    @SendTo("/topic/user/status")
    public Map<String, Object> handleHeartbeat(
            @DestinationVariable String sessionId,
            Map<String, Object> message,
            SimpMessageHeaderAccessor headerAccessor) {

        log.debug("Heartbeat received for session: {}", sessionId);

        // Update activity
        userSessionService.updateActivity(sessionId);

        // Get user ID from session
        Long userId = sessionToUserMap.get(sessionId);

        return Map.of(
                "type", "HEARTBEAT",
                "userId", userId != null ? userId : "unknown",
                "sessionId", sessionId,
                "status", "online",
                "timestamp", LocalDateTime.now().toString()
        );
    }

    /**
     * Handle user logout/disconnection event
     * Client sends: /app/user/logout
     * Response sent to: /topic/user/status
     */
    @MessageMapping("/user/logout")
    @SendTo("/topic/user/status")
    public Map<String, Object> handleUserLogout(Map<String, Object> message, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        Long userId = sessionToUserMap.get(sessionId);

        log.info("User {} disconnected via WebSocket, session: {}", userId, sessionId);

        if (userId != null) {
            userSessionService.logoutBySession(sessionId);

            // Clean up mappings
            sessionToUserMap.remove(sessionId);
            connectedSessions.remove(sessionId);

            // Broadcast logout event
            return Map.of(
                    "type", "USER_LOGOUT",
                    "userId", userId,
                    "sessionId", sessionId,
                    "status", "offline",
                    "timestamp", LocalDateTime.now().toString(),
                    "onlineCount", userSessionService.getOnlineUserCount()
            );
        }

        return Map.of(
                "type", "USER_LOGOUT",
                "sessionId", sessionId,
                "status", "offline",
                "timestamp", LocalDateTime.now().toString()
        );
    }

    /**
     * Handle session disconnect (WebSocket disconnect event)
     * This is called automatically by Spring when a WebSocket connection is closed
     */
    @MessageMapping("/user/disconnect")
    @SendTo("/topic/user/status")
    public Map<String, Object> handleDisconnect(Map<String, Object> message, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        Long userId = sessionToUserMap.get(sessionId);

        log.info("WebSocket session disconnected: {}, userId: {}", sessionId, userId);

        if (userId != null) {
            userSessionService.logoutBySession(sessionId);

            // Clean up mappings
            sessionToUserMap.remove(sessionId);
            connectedSessions.remove(sessionId);

            return Map.of(
                    "type", "USER_DISCONNECT",
                    "userId", userId,
                    "sessionId", sessionId,
                    "status", "offline",
                    "timestamp", LocalDateTime.now().toString(),
                    "onlineCount", userSessionService.getOnlineUserCount()
            );
        }

        return Map.of(
                "type", "USER_DISCONNECT",
                "sessionId", sessionId,
                "status", "offline",
                "timestamp", LocalDateTime.now().toString()
        );
    }

    /**
     * Get online users count (for admin dashboard polling)
     * Client sends: /app/user/online-count
     * Response sent to: /queue/user/online-count (private message to sender)
     */
    @MessageMapping("/user/online-count")
    @SendToUser("/queue/online-count")
    public Map<String, Object> getOnlineCount(Map<String, Object> message) {
        return Map.of(
                "type", "ONLINE_COUNT",
                "count", userSessionService.getOnlineUserCount(),
                "timestamp", LocalDateTime.now().toString()
        );
    }

    /**
     * Get online status for specific users (for admin dashboard)
     * Client sends: /app/user/status/batch with list of user IDs
     * Response sent to: /queue/user/status/batch (private message to sender)
     */
    @MessageMapping("/user/status/batch")
    @SendToUser("/queue/user/status/batch")
    public Map<String, Object> getBatchUserStatus(Map<String, Object> message) {
        @SuppressWarnings("unchecked")
        java.util.List<Long> userIds = ((java.util.List<?>) message.get("userIds"))
                .stream()
                .map(id -> Long.valueOf(id.toString()))
                .toList();

        Map<Long, Boolean> statusMap = userSessionService.getOnlineStatusForUsers(userIds);

        return Map.of(
                "type", "BATCH_STATUS",
                "statusMap", statusMap,
                "timestamp", LocalDateTime.now().toString()
        );
    }
}
