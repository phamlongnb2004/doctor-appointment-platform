package com.doctorappointment.repository;

import com.doctorappointment.model.Appointment;
import com.doctorappointment.model.Appointment.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient_Id(Long patientId);
    List<Appointment> findByDoctor_Id(Long doctorId);
    List<Appointment> findByStatus(AppointmentStatus status);
    List<Appointment> findByDoctor_IdAndAppointmentDateTimeBetween(
            Long doctorId, LocalDateTime start, LocalDateTime end);
    List<Appointment> findByDoctor_IdAndAppointmentDateTimeBetweenAndStatusIn(
            Long doctorId, LocalDateTime start, LocalDateTime end, List<AppointmentStatus> statuses);
}
