package com.doctorappointment.repository;

import com.doctorappointment.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);
    List<Doctor> findByUser_ActiveTrue();
    Optional<Doctor> findByUserId(Long userId);
}
