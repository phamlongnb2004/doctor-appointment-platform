package com.doctorappointment.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket configuration for real-time user status updates
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory message broker for topics
        // /topic - for broadcasting to all subscribers (e.g., chat rooms, online users count)
        // /queue - for private messages to specific users
        config.enableSimpleBroker("/topic", "/queue");

        // Set prefix for messages from clients
        config.setApplicationDestinationPrefixes("/app");
        
        // Set user destination prefix for private messages
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register WebSocket endpoint that clients will connect to
        // SockJS fallback is enabled for browsers that don't support WebSocket
        // Note: Since context-path is /api, the endpoint should be /ws (not /api/ws)
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns(
                    "http://localhost:3000", 
                    "http://localhost:5173",
                    "https://doctor-appointment-frontend-ujug.onrender.com"
                )
                .withSockJS();

        // Also register without SockJS for native WebSocket clients
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns(
                    "http://localhost:3000", 
                    "http://localhost:5173",
                    "https://doctor-appointment-frontend-ujug.onrender.com"
                );
    }
}
