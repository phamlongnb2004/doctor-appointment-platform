package com.doctorappointment.service;

import com.doctorappointment.model.Notification;
import com.doctorappointment.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public Notification createNotification(Long userId, String type, String title, String message, Long relatedId, String relatedType) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRelatedId(relatedId);
        notification.setRelatedType(relatedType);
        notification.setIsRead(false);
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
    }

    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }

    public Notification markAsRead(Long notificationId) {
        return notificationRepository.findById(notificationId)
                .map(notification -> {
                    notification.setIsRead(true);
                    return notificationRepository.save(notification);
                })
                .orElse(null);
    }

    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }
}
