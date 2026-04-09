package com.doctorappointment.repository;

import com.doctorappointment.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    Optional<MedicalRecord> findByAppointment_Id(Long appointmentId);
    List<MedicalRecord> findByPatient_Id(Long patientId);
    List<MedicalRecord> findByDoctor_Id(Long doctorId);
    List<MedicalRecord> findByPatient_IdOrderByCreatedAtDesc(Long patientId);
}
