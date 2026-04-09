package com.doctorappointment.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "medical_records")
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"medicalRecord"})
    private Appointment appointment;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"appointments", "password", "chatParticipants", "cartItems", "orders", "notifications", "userSessions"})
    private User patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonIgnoreProperties({"appointments", "availability", "reviews", "articles"})
    private Doctor doctor;

    @Column(columnDefinition = "TEXT")
    private String chiefComplaint; // Lý do khám

    @Column(columnDefinition = "TEXT")
    private String symptoms; // Triệu chứng

    @Column(columnDefinition = "TEXT")
    private String diagnosis; // Chẩn đoán

    @Column(columnDefinition = "TEXT")
    private String treatment; // Phương pháp điều trị

    @Column(columnDefinition = "TEXT")
    private String prescription; // Đơn thuốc

    @Column(columnDefinition = "TEXT")
    private String notes; // Ghi chú của bác sĩ

    @Column(columnDefinition = "TEXT")
    private String vitalSigns; // Dấu hiệu sinh tồn (JSON: blood pressure, temperature, heart rate, etc.)

    @Column(columnDefinition = "TEXT")
    private String followUpInstructions; // Hướng dẫn tái khám

    @OneToMany(mappedBy = "medicalRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MedicalRecordAttachment> attachments = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime examinationStartTime; // Thời gian bắt đầu khám

    @Column
    private LocalDateTime examinationEndTime; // Thời gian kết thúc khám

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public MedicalRecord() {}

    // Getters
    public Long getId() { return id; }
    public Appointment getAppointment() { return appointment; }
    public User getPatient() { return patient; }
    public Doctor getDoctor() { return doctor; }
    public String getChiefComplaint() { return chiefComplaint; }
    public String getSymptoms() { return symptoms; }
    public String getDiagnosis() { return diagnosis; }
    public String getTreatment() { return treatment; }
    public String getPrescription() { return prescription; }
    public String getNotes() { return notes; }
    public String getVitalSigns() { return vitalSigns; }
    public String getFollowUpInstructions() { return followUpInstructions; }
    public List<MedicalRecordAttachment> getAttachments() { return attachments; }
    public LocalDateTime getExaminationStartTime() { return examinationStartTime; }
    public LocalDateTime getExaminationEndTime() { return examinationEndTime; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }
    public void setPatient(User patient) { this.patient = patient; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    public void setTreatment(String treatment) { this.treatment = treatment; }
    public void setPrescription(String prescription) { this.prescription = prescription; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setVitalSigns(String vitalSigns) { this.vitalSigns = vitalSigns; }
    public void setFollowUpInstructions(String followUpInstructions) { this.followUpInstructions = followUpInstructions; }
    public void setAttachments(List<MedicalRecordAttachment> attachments) { this.attachments = attachments; }
    public void setExaminationStartTime(LocalDateTime examinationStartTime) { this.examinationStartTime = examinationStartTime; }
    public void setExaminationEndTime(LocalDateTime examinationEndTime) { this.examinationEndTime = examinationEndTime; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (examinationStartTime == null) {
            examinationStartTime = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
