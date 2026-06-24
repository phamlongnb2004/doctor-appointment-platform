package com.doctorappointment.repository;

import com.doctorappointment.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByDoctor_Id(Long doctorId);
    List<Review> findByPatient_Id(Long patientId);
    boolean existsByMedicalRecord_Id(Long medicalRecordId);
    Review findByMedicalRecord_Id(Long medicalRecordId);
}
