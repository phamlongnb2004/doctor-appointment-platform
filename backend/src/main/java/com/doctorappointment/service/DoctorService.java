package com.doctorappointment.service;

import com.doctorappointment.dto.DoctorResponse;
import com.doctorappointment.model.Appointment;
import com.doctorappointment.model.Appointment.AppointmentStatus;
import com.doctorappointment.model.Doctor;
import com.doctorappointment.repository.AppointmentRepository;
import com.doctorappointment.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAllWithUser();
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationContainingIgnoreCase(specialization);
    }

    public List<Doctor> getActiveDoctors() {
        return doctorRepository.findByUser_ActiveTrue();
    }
    
    public Optional<Doctor> getDoctorByUserId(Long userId) {
        return doctorRepository.findByUserId(userId);
    }

    public Doctor updateDoctor(Long id, Doctor doctorDetails) {
        return doctorRepository.findById(id).map(doctor -> {
            doctor.setSpecialization(doctorDetails.getSpecialization());
            doctor.setBiography(doctorDetails.getBiography());
            doctor.setConsultationFee(doctorDetails.getConsultationFee());
            doctor.setExperienceYears(doctorDetails.getExperienceYears());
            if (doctorDetails.getClinicAddress() != null) {
                doctor.setClinicAddress(doctorDetails.getClinicAddress());
            }
            return doctorRepository.save(doctor);
        }).orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
    
    /**
     * Get available doctors for a specific date and time
     * Filters out doctors who already have appointments in the specified time slot
     */
    public List<DoctorResponse> getAvailableDoctors(String dateTimeStr, String specialty) {
        LocalDateTime dateTime = LocalDateTime.parse(dateTimeStr);
        
        // Define time slot range (e.g., 1 hour before and after)
        LocalDateTime startTime = dateTime.minusMinutes(30);
        LocalDateTime endTime = dateTime.plusMinutes(30);
        
        // Get all active doctors
        List<Doctor> allDoctors = specialty != null && !specialty.isEmpty()
                ? doctorRepository.findBySpecializationContainingIgnoreCaseAndUser_ActiveTrue(specialty)
                : doctorRepository.findByUser_ActiveTrue();
        
        // Get doctors who have appointments in this time slot
        List<AppointmentStatus> busyStatuses = List.of(
                AppointmentStatus.PENDING,
                AppointmentStatus.CONFIRMED,
                AppointmentStatus.IN_PROGRESS
        );
        
        // Filter out busy doctors
        return allDoctors.stream()
                .filter(doctor -> {
                    List<Appointment> appointments = appointmentRepository
                            .findByDoctor_IdAndAppointmentDateTimeBetweenAndStatusIn(
                                    doctor.getId(), startTime, endTime, busyStatuses);
                    return appointments.isEmpty(); // Only include if no appointments
                })
                .map(DoctorResponse::fromDoctor)
                .collect(Collectors.toList());
    }
}
