package com.doctorappointment.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity to track user online status and activity
 */
@Entity
@Table(name = "user_sessions")
public class UserSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String sessionId;

    @Column(nullable = false)
    private LocalDateTime loginTime;

    @Column(nullable = false)
    private LocalDateTime lastActivityTime;

    @Column(nullable = false)
    private boolean online;

    private String ipAddress;

    private String userAgent;

    public UserSession() {}

    public UserSession(Long userId, String sessionId, String ipAddress, String userAgent) {
        this.userId = userId;
        this.sessionId = sessionId;
        this.loginTime = LocalDateTime.now();
        this.lastActivityTime = LocalDateTime.now();
        this.online = true;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
    }

    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getSessionId() { return sessionId; }
    public LocalDateTime getLoginTime() { return loginTime; }
    public LocalDateTime getLastActivityTime() { return lastActivityTime; }
    public boolean isOnline() { return online; }
    public String getIpAddress() { return ipAddress; }
    public String getUserAgent() { return userAgent; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public void setLoginTime(LocalDateTime loginTime) { this.loginTime = loginTime; }
    public void setLastActivityTime(LocalDateTime lastActivityTime) { this.lastActivityTime = lastActivityTime; }
    public void setOnline(boolean online) { this.online = online; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    /**
     * Update the last activity time to current time
     */
    public void updateActivity() {
        this.lastActivityTime = LocalDateTime.now();
    }

    /**
     * Mark user as offline
     */
    public void markOffline() {
        this.online = false;
    }

    /**
     * Check if session has expired (no activity for specified minutes)
     */
    public boolean isExpired(int timeoutMinutes) {
        return LocalDateTime.now().isAfter(lastActivityTime.plusMinutes(timeoutMinutes));
    }
}
