package com.doctorappointment.dto;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class AppointmentRequest {
    private Long patientId;
    private Long doctorId;
    private Instant appointmentDateTime;
    private String reason;
    private String notes;

    public AppointmentRequest() {}

    // Getters
    public Long getPatientId() { return patientId; }
    public Long getDoctorId() { return doctorId; }
    public Instant getAppointmentDateTime() { return appointmentDateTime; }
    public String getReason() { return reason; }
    public String getNotes() { return notes; }

    // Setters
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public void setAppointmentDateTime(Instant appointmentDateTime) { this.appointmentDateTime = appointmentDateTime; }
    public void setReason(String reason) { this.reason = reason; }
    public void setNotes(String notes) { this.notes = notes; }

    // Builder pattern
    public static AppointmentRequestBuilder builder() { return new AppointmentRequestBuilder(); }

    public static class AppointmentRequestBuilder {
        private AppointmentRequest request = new AppointmentRequest();

        public AppointmentRequestBuilder patientId(Long patientId) { request.patientId = patientId; return this; }
        public AppointmentRequestBuilder doctorId(Long doctorId) { request.doctorId = doctorId; return this; }
        public AppointmentRequestBuilder appointmentDateTime(Instant appointmentDateTime) { request.appointmentDateTime = appointmentDateTime; return this; }
        public AppointmentRequestBuilder reason(String reason) { request.reason = reason; return this; }
        public AppointmentRequestBuilder notes(String notes) { request.notes = notes; return this; }

        public AppointmentRequest build() { return request; }
    }

    public LocalDateTime getAppointmentDateTimeAsLocal() {
        return appointmentDateTime != null
                ? LocalDateTime.ofInstant(appointmentDateTime, ZoneId.systemDefault())
                : null;
    }
}
