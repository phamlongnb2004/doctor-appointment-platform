package com.doctorappointment.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_record_attachments")
public class MedicalRecordAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "medical_record_id", nullable = false)
    @JsonIgnoreProperties({"attachments"})
    private MedicalRecord medicalRecord;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileUrl;

    @Column(nullable = false)
    private String fileType; // image, pdf, document, etc.

    @Column
    private Long fileSize; // in bytes

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    public MedicalRecordAttachment() {}

    // Getters
    public Long getId() { return id; }
    public MedicalRecord getMedicalRecord() { return medicalRecord; }
    public String getFileName() { return fileName; }
    public String getFileUrl() { return fileUrl; }
    public String getFileType() { return fileType; }
    public Long getFileSize() { return fileSize; }
    public String getDescription() { return description; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setMedicalRecord(MedicalRecord medicalRecord) { this.medicalRecord = medicalRecord; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public void setDescription(String description) { this.description = description; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}
