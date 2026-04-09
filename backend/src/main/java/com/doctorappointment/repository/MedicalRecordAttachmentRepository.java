package com.doctorappointment.repository;

import com.doctorappointment.model.MedicalRecordAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicalRecordAttachmentRepository extends JpaRepository<MedicalRecordAttachment, Long> {
    List<MedicalRecordAttachment> findByMedicalRecord_Id(Long medicalRecordId);
}
