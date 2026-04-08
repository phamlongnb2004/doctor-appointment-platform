package com.doctorappointment.repository;

import com.doctorappointment.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);

    @Query("SELECT d FROM Doctor d JOIN FETCH d.user WHERE d.user.active = true")
    List<Doctor> findByUser_ActiveTrue();

    Optional<Doctor> findByUserId(Long userId);
    
    @Query("SELECT d FROM Doctor d LEFT JOIN FETCH d.user")
    List<Doctor> findAllWithUser();
}
