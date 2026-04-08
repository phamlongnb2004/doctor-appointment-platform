package com.doctorappointment.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"appointments", "password", "chatParticipants", "cartItems", "orders", "notifications", "userSessions"})
    private User patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonIgnoreProperties({"appointments", "availability", "reviews", "articles"})
    private Doctor doctor;

    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime appointmentDateTime;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Appointment() {}

    // Getters
    public Long getId() { return id; }
    public User getPatient() { return patient; }
    public Doctor getDoctor() { return doctor; }
    public LocalDateTime getAppointmentDateTime() { return appointmentDateTime; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public AppointmentStatus getStatus() { return status; }
    public String getReason() { return reason; }
    public String getNotes() { return notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setPatient(User patient) { this.patient = patient; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }
    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) { this.appointmentDateTime = appointmentDateTime; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public void setStatus(AppointmentStatus status) { this.status = status; }
    public void setReason(String reason) { this.reason = reason; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder
    public static AppointmentBuilder builder() { return new AppointmentBuilder(); }
    public static class AppointmentBuilder {
        private Appointment appointment = new Appointment();
        public AppointmentBuilder id(Long id) { appointment.id = id; return this; }
        public AppointmentBuilder patient(User patient) { appointment.patient = patient; return this; }
        public AppointmentBuilder doctor(Doctor doctor) { appointment.doctor = doctor; return this; }
        public AppointmentBuilder appointmentDateTime(LocalDateTime appointmentDateTime) { appointment.appointmentDateTime = appointmentDateTime; return this; }
        public AppointmentBuilder durationMinutes(Integer durationMinutes) { appointment.durationMinutes = durationMinutes; return this; }
        public AppointmentBuilder status(AppointmentStatus status) { appointment.status = status; return this; }
        public AppointmentBuilder reason(String reason) { appointment.reason = reason; return this; }
        public AppointmentBuilder notes(String notes) { appointment.notes = notes; return this; }
        public AppointmentBuilder createdAt(LocalDateTime createdAt) { appointment.createdAt = createdAt; return this; }
        public AppointmentBuilder updatedAt(LocalDateTime updatedAt) { appointment.updatedAt = updatedAt; return this; }
        public Appointment build() { return appointment; }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        durationMinutes = 30;
        status = AppointmentStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum AppointmentStatus {
        PENDING,
        CONFIRMED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }
}
