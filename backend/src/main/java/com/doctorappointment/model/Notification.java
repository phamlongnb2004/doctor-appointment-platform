package com.doctorappointment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 50)
    private String type; // APPOINTMENT_NEW, APPOINTMENT_CONFIRMED, APPOINTMENT_CANCELLED

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "related_id")
    private Long relatedId; // appointment ID

    @Column(name = "related_type", length = 50)
    private String relatedType; // APPOINTMENT

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
