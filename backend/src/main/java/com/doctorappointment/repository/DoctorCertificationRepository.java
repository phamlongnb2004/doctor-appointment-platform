package com.doctorappointment.repository;

import com.doctorappointment.model.DoctorCertification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DoctorCertificationRepository extends JpaRepository<DoctorCertification, Long> {
    List<DoctorCertification> findByDoctorIdOrderByDisplayOrderAsc(Long doctorId);
    void deleteByDoctorIdAndId(Long doctorId, Long id);
}
