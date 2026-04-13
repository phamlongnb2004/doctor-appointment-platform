package com.doctorappointment.dto;

import com.doctorappointment.model.QuickBooking.QuickBookingStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class QuickBookingResponse {
    private Long id;
    private String patientName;
    private String phoneNumber;
    private String email;
    private String specialty;
    private String symptoms;
    private LocalDateTime preferredDate;
    private String preferredTime;
    private LocalDateTime confirmedDate; // Giờ cụ thể admin set
    private QuickBookingStatus status;
    private String adminNotes;
    private Long assignedDoctorId;
    private String assignedDoctorName;
    private Long convertedAppointmentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime convertedAt;
}
