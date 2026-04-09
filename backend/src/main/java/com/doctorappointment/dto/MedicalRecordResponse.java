package com.doctorappointment.dto;

import com.doctorappointment.model.MedicalRecord;
import com.doctorappointment.model.MedicalRecordAttachment;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class MedicalRecordResponse {
    private Long id;
    private Long appointmentId;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private String chiefComplaint;
    private String symptoms;
    private String diagnosis;
    private String treatment;
    private String prescription;
    private String notes;
    private String vitalSigns;
    private String followUpInstructions;
    private List<AttachmentInfo> attachments;
    private LocalDateTime examinationStartTime;
    private LocalDateTime examinationEndTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static class AttachmentInfo {
        private Long id;
        private String fileName;
        private String fileUrl;
        private String fileType;
        private Long fileSize;
        private String description;
        private LocalDateTime uploadedAt;

        public AttachmentInfo(MedicalRecordAttachment attachment) {
            this.id = attachment.getId();
            this.fileName = attachment.getFileName();
            this.fileUrl = attachment.getFileUrl();
            this.fileType = attachment.getFileType();
            this.fileSize = attachment.getFileSize();
            this.description = attachment.getDescription();
            this.uploadedAt = attachment.getUploadedAt();
        }

        // Getters
        public Long getId() { return id; }
        public String getFileName() { return fileName; }
        public String getFileUrl() { return fileUrl; }
        public String getFileType() { return fileType; }
        public Long getFileSize() { return fileSize; }
        public String getDescription() { return description; }
        public LocalDateTime getUploadedAt() { return uploadedAt; }
    }

    public MedicalRecordResponse(MedicalRecord record) {
        this.id = record.getId();
        this.appointmentId = record.getAppointment().getId();
        this.patientId = record.getPatient().getId();
        this.patientName = record.getPatient().getFirstName() + " " + record.getPatient().getLastName();
        this.doctorId = record.getDoctor().getId();
        this.doctorName = record.getDoctor().getUser().getFirstName() + " " + record.getDoctor().getUser().getLastName();
        this.chiefComplaint = record.getChiefComplaint();
        this.symptoms = record.getSymptoms();
        this.diagnosis = record.getDiagnosis();
        this.treatment = record.getTreatment();
        this.prescription = record.getPrescription();
        this.notes = record.getNotes();
        this.vitalSigns = record.getVitalSigns();
        this.followUpInstructions = record.getFollowUpInstructions();
        this.attachments = record.getAttachments().stream()
            .map(AttachmentInfo::new)
            .collect(Collectors.toList());
        this.examinationStartTime = record.getExaminationStartTime();
        this.examinationEndTime = record.getExaminationEndTime();
        this.createdAt = record.getCreatedAt();
        this.updatedAt = record.getUpdatedAt();
    }

    // Getters
    public Long getId() { return id; }
    public Long getAppointmentId() { return appointmentId; }
    public Long getPatientId() { return patientId; }
    public String getPatientName() { return patientName; }
    public Long getDoctorId() { return doctorId; }
    public String getDoctorName() { return doctorName; }
    public String getChiefComplaint() { return chiefComplaint; }
    public String getSymptoms() { return symptoms; }
    public String getDiagnosis() { return diagnosis; }
    public String getTreatment() { return treatment; }
    public String getPrescription() { return prescription; }
    public String getNotes() { return notes; }
    public String getVitalSigns() { return vitalSigns; }
    public String getFollowUpInstructions() { return followUpInstructions; }
    public List<AttachmentInfo> getAttachments() { return attachments; }
    public LocalDateTime getExaminationStartTime() { return examinationStartTime; }
    public LocalDateTime getExaminationEndTime() { return examinationEndTime; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
