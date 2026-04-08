package com.doctorappointment.service;

import com.doctorappointment.dto.AppointmentRequest;
import com.doctorappointment.model.Appointment;
import com.doctorappointment.model.Appointment.AppointmentStatus;
import com.doctorappointment.model.Doctor;
import com.doctorappointment.model.User;
import com.doctorappointment.repository.AppointmentRepository;
import com.doctorappointment.repository.DoctorRepository;
import com.doctorappointment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final NotificationService notificationService;

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public Appointment createAppointment(AppointmentRequest request) {
        User patient = userRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        LocalDateTime appointmentDateTime = request.getAppointmentDateTimeAsLocal();
        if (appointmentDateTime == null) {
            throw new RuntimeException("Appointment date and time is required");
        }

        // Check if slot is already booked (PENDING or CONFIRMED)
        LocalDateTime slotEnd = appointmentDateTime.plusMinutes(30);
        List<AppointmentStatus> bookedStatuses = Arrays.asList(
            AppointmentStatus.PENDING, 
            AppointmentStatus.CONFIRMED
        );
        
        List<Appointment> existingAppointments = appointmentRepository
            .findByDoctor_IdAndAppointmentDateTimeBetweenAndStatusIn(
                request.getDoctorId(), 
                appointmentDateTime, 
                slotEnd, 
                bookedStatuses
            );
        
        if (!existingAppointments.isEmpty()) {
            throw new RuntimeException("Khung giờ này đã được đặt. Vui lòng chọn khung giờ khác.");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDateTime(appointmentDateTime)
                .reason(request.getReason())
                .notes(request.getNotes())
                .status(AppointmentStatus.PENDING)
                .build();
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Create notification for doctor
        notificationService.createNotification(
            doctor.getUser().getId(),
            "APPOINTMENT_BOOKED",
            "Lịch hẹn mới",
            "Bệnh nhân " + patient.getFirstName() + " " + patient.getLastName() + " đã đặt lịch khám",
            savedAppointment.getId(),
            "APPOINTMENT"
        );
        
        return savedAppointment;
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        return appointmentRepository.findByPatient_Id(patientId);
    }

    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctor_Id(doctorId);
    }

    public List<Appointment> getAppointmentsByStatus(AppointmentStatus status) {
        return appointmentRepository.findByStatus(status);
    }

    public List<Appointment> getDoctorAppointmentsInRange(Long doctorId, LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByDoctor_IdAndAppointmentDateTimeBetween(doctorId, start, end);
    }

    public Appointment updateAppointmentStatus(Long id, AppointmentStatus status) {
        return appointmentRepository.findById(id).map(appointment -> {
            AppointmentStatus oldStatus = appointment.getStatus();
            appointment.setStatus(status);
            Appointment updatedAppointment = appointmentRepository.save(appointment);
            
            // Create notification for patient when doctor confirms
            if (status == AppointmentStatus.CONFIRMED && oldStatus != AppointmentStatus.CONFIRMED) {
                notificationService.createNotification(
                    appointment.getPatient().getId(),
                    "APPOINTMENT_CONFIRMED",
                    "Lịch hẹn đã được xác nhận",
                    "Bác sĩ " + appointment.getDoctor().getUser().getFirstName() + " " + 
                    appointment.getDoctor().getUser().getLastName() + " đã xác nhận lịch khám của bạn",
                    updatedAppointment.getId(),
                    "APPOINTMENT"
                );
            }
            
            return updatedAppointment;
        }).orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {
        return appointmentRepository.findById(id).map(appointment -> {
            appointment.setAppointmentDateTime(appointmentDetails.getAppointmentDateTime());
            appointment.setReason(appointmentDetails.getReason());
            appointment.setNotes(appointmentDetails.getNotes());
            return appointmentRepository.save(appointment);
        }).orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    public void cancelAppointment(Long id) {
        appointmentRepository.findById(id).ifPresent(appointment -> {
            appointment.setStatus(AppointmentStatus.CANCELLED);
            appointmentRepository.save(appointment);
        });
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    public List<String> getAvailableSlots(Long doctorId, LocalDate date) {
        // Define all possible time slots
        List<String> allSlots = Arrays.asList(
            "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00",
            "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"
        );
        
        // Get start and end of day
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        
        // Get all booked appointments for this doctor on this date (PENDING or CONFIRMED)
        List<AppointmentStatus> bookedStatuses = Arrays.asList(
            AppointmentStatus.PENDING, 
            AppointmentStatus.CONFIRMED
        );
        
        List<Appointment> bookedAppointments = appointmentRepository
            .findByDoctor_IdAndAppointmentDateTimeBetweenAndStatusIn(
                doctorId, 
                startOfDay, 
                endOfDay, 
                bookedStatuses
            );
        
        // Filter out booked slots
        List<String> availableSlots = new ArrayList<>();
        for (String slot : allSlots) {
            String startTime = slot.split(" - ")[0];
            String[] timeParts = startTime.split(":");
            int hour = Integer.parseInt(timeParts[0]);
            int minute = Integer.parseInt(timeParts[1]);
            
            LocalDateTime slotDateTime = date.atTime(hour, minute);
            
            // Check if this slot is booked
            boolean isBooked = bookedAppointments.stream()
                .anyMatch(apt -> apt.getAppointmentDateTime().equals(slotDateTime));
            
            if (!isBooked) {
                availableSlots.add(slot);
            }
        }
        
        return availableSlots;
    }
}
