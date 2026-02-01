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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public Appointment createAppointment(AppointmentRequest request) {
        User patient = userRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        LocalDateTime appointmentDateTime = request.getAppointmentDateTimeAsLocal();
        if (appointmentDateTime == null) {
            throw new RuntimeException("Appointment date and time is required");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDateTime(appointmentDateTime)
                .reason(request.getReason())
                .notes(request.getNotes())
                .status(AppointmentStatus.PENDING)
                .build();
        return appointmentRepository.save(appointment);
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
            appointment.setStatus(status);
            return appointmentRepository.save(appointment);
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
}
