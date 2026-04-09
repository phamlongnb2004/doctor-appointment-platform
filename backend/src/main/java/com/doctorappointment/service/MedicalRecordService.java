package com.doctorappointment.service;

import com.doctorappointment.dto.MedicalRecordRequest;
import com.doctorappointment.dto.MedicalRecordResponse;
import com.doctorappointment.model.Appointment;
import com.doctorappointment.model.Appointment.AppointmentStatus;
import com.doctorappointment.model.Doctor;
import com.doctorappointment.model.MedicalRecord;
import com.doctorappointment.model.MedicalRecordAttachment;
import com.doctorappointment.model.User;
import com.doctorappointment.repository.AppointmentRepository;
import com.doctorappointment.repository.MedicalRecordAttachmentRepository;
import com.doctorappointment.repository.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {
    private final MedicalRecordRepository medicalRecordRepository;
    private final MedicalRecordAttachmentRepository attachmentRepository;
    private final AppointmentRepository appointmentRepository;
    private final CloudinaryService cloudinaryService;
    private final NotificationService notificationService;

    @Transactional
    public MedicalRecordResponse startExamination(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new RuntimeException("Appointment must be confirmed before starting examination");
        }

        // Check if medical record already exists
        if (medicalRecordRepository.findByAppointment_Id(appointmentId).isPresent()) {
            throw new RuntimeException("Medical record already exists for this appointment");
        }

        // Update appointment status to IN_PROGRESS
        appointment.setStatus(AppointmentStatus.IN_PROGRESS);
        appointmentRepository.save(appointment);

        // Create medical record
        MedicalRecord record = new MedicalRecord();
        record.setAppointment(appointment);
        record.setPatient(appointment.getPatient());
        record.setDoctor(appointment.getDoctor());
        record.setChiefComplaint(appointment.getReason());
        record.setExaminationStartTime(LocalDateTime.now());

        MedicalRecord savedRecord = medicalRecordRepository.save(record);

        // Notify patient
        notificationService.createNotification(
            appointment.getPatient().getId(),
            "EXAMINATION_STARTED",
            "Bắt đầu khám bệnh",
            "Bác sĩ " + appointment.getDoctor().getUser().getFirstName() + " " + 
            appointment.getDoctor().getUser().getLastName() + " đã bắt đầu khám",
            appointmentId,
            "APPOINTMENT"
        );

        return new MedicalRecordResponse(savedRecord);
    }

    @Transactional
    public MedicalRecordResponse updateMedicalRecord(Long recordId, MedicalRecordRequest request) {
        MedicalRecord record = medicalRecordRepository.findById(recordId)
            .orElseThrow(() -> new RuntimeException("Medical record not found"));

        if (record.getExaminationEndTime() != null) {
            throw new RuntimeException("Cannot update completed medical record");
        }

        // Update fields
        if (request.getChiefComplaint() != null) record.setChiefComplaint(request.getChiefComplaint());
        if (request.getSymptoms() != null) record.setSymptoms(request.getSymptoms());
        if (request.getDiagnosis() != null) record.setDiagnosis(request.getDiagnosis());
        if (request.getTreatment() != null) record.setTreatment(request.getTreatment());
        if (request.getPrescription() != null) record.setPrescription(request.getPrescription());
        if (request.getNotes() != null) record.setNotes(request.getNotes());
        if (request.getVitalSigns() != null) record.setVitalSigns(request.getVitalSigns());
        if (request.getFollowUpInstructions() != null) record.setFollowUpInstructions(request.getFollowUpInstructions());

        MedicalRecord updatedRecord = medicalRecordRepository.save(record);
        return new MedicalRecordResponse(updatedRecord);
    }

    @Transactional
    public MedicalRecordResponse completeExamination(Long recordId) {
        MedicalRecord record = medicalRecordRepository.findById(recordId)
            .orElseThrow(() -> new RuntimeException("Medical record not found"));

        if (record.getExaminationEndTime() != null) {
            throw new RuntimeException("Examination already completed");
        }

        // Set end time
        record.setExaminationEndTime(LocalDateTime.now());
        MedicalRecord completedRecord = medicalRecordRepository.save(record);

        // Update appointment status to COMPLETED
        Appointment appointment = record.getAppointment();
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);

        // Notify patient
        notificationService.createNotification(
            appointment.getPatient().getId(),
            "EXAMINATION_COMPLETED",
            "Hoàn thành khám bệnh",
            "Bác sĩ đã hoàn thành khám và cập nhật hồ sơ bệnh án của bạn",
            appointment.getId(),
            "APPOINTMENT"
        );

        return new MedicalRecordResponse(completedRecord);
    }

    @Transactional
    public MedicalRecordAttachment addAttachment(Long recordId, MultipartFile file, String description) {
        MedicalRecord record = medicalRecordRepository.findById(recordId)
            .orElseThrow(() -> new RuntimeException("Medical record not found"));

        try {
            // Upload to Cloudinary
            String fileUrl = cloudinaryService.uploadImage(file, "medical-records");

            MedicalRecordAttachment attachment = new MedicalRecordAttachment();
            attachment.setMedicalRecord(record);
            attachment.setFileName(file.getOriginalFilename());
            attachment.setFileUrl(fileUrl);
            attachment.setFileType(file.getContentType());
            attachment.setFileSize(file.getSize());
            attachment.setDescription(description);

            return attachmentRepository.save(attachment);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload attachment: " + e.getMessage());
        }
    }

    public MedicalRecordResponse getMedicalRecordById(Long id) {
        MedicalRecord record = medicalRecordRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Medical record not found"));
        return new MedicalRecordResponse(record);
    }

    public MedicalRecordResponse getMedicalRecordByAppointmentId(Long appointmentId) {
        MedicalRecord record = medicalRecordRepository.findByAppointment_Id(appointmentId)
            .orElseThrow(() -> new RuntimeException("Medical record not found for this appointment"));
        return new MedicalRecordResponse(record);
    }

    public List<MedicalRecordResponse> getPatientMedicalHistory(Long patientId) {
        return medicalRecordRepository.findByPatient_IdOrderByCreatedAtDesc(patientId)
            .stream()
            .map(MedicalRecordResponse::new)
            .collect(Collectors.toList());
    }

    public List<MedicalRecordResponse> getDoctorMedicalRecords(Long doctorId) {
        return medicalRecordRepository.findByDoctor_Id(doctorId)
            .stream()
            .map(MedicalRecordResponse::new)
            .collect(Collectors.toList());
    }

    @Transactional
    public void deleteAttachment(Long attachmentId) {
        MedicalRecordAttachment attachment = attachmentRepository.findById(attachmentId)
            .orElseThrow(() -> new RuntimeException("Attachment not found"));
        
        // Delete from Cloudinary
        try {
            cloudinaryService.deleteImage(attachment.getFileUrl());
        } catch (Exception e) {
            // Log error but continue with database deletion
        }
        
        attachmentRepository.delete(attachment);
    }
}
