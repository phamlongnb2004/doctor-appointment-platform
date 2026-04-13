package com.doctorappointment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "quick_bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuickBooking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String patientName;
    
    @Column(nullable = false)
    private String phoneNumber;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String specialty;
    
    @Column(columnDefinition = "TEXT")
    private String symptoms;
    
    @Column(nullable = false)
    private LocalDateTime preferredDate;
    
    @Column(nullable = false)
    private String preferredTime; // MORNING, AFTERNOON, EVENING
    
    @Column
    private LocalDateTime confirmedDate; // Ngày giờ cụ thể admin set
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuickBookingStatus status = QuickBookingStatus.PENDING;
    
    @Column(columnDefinition = "TEXT")
    private String adminNotes;
    
    @ManyToOne
    @JoinColumn(name = "assigned_doctor_id")
    private Doctor assignedDoctor;
    
    @ManyToOne
    @JoinColumn(name = "converted_appointment_id")
    private Appointment convertedAppointment;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime updatedAt;
    
    @Column
    private LocalDateTime convertedAt;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum QuickBookingStatus {
        PENDING,        // Chờ xử lý
        ASSIGNED,       // Đã phân công bác sĩ
        CONVERTED,      // Đã chuyển thành appointment
        CANCELLED       // Đã hủy
    }
}
