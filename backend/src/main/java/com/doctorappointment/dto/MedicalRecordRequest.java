package com.doctorappointment.dto;

public class MedicalRecordRequest {
    private Long appointmentId;
    private String chiefComplaint;
    private String symptoms;
    private String diagnosis;
    private String treatment;
    private String prescription;
    private String notes;
    private String vitalSigns;
    private String followUpInstructions;

    public MedicalRecordRequest() {}

    // Getters
    public Long getAppointmentId() { return appointmentId; }
    public String getChiefComplaint() { return chiefComplaint; }
    public String getSymptoms() { return symptoms; }
    public String getDiagnosis() { return diagnosis; }
    public String getTreatment() { return treatment; }
    public String getPrescription() { return prescription; }
    public String getNotes() { return notes; }
    public String getVitalSigns() { return vitalSigns; }
    public String getFollowUpInstructions() { return followUpInstructions; }

    // Setters
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    public void setTreatment(String treatment) { this.treatment = treatment; }
    public void setPrescription(String prescription) { this.prescription = prescription; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setVitalSigns(String vitalSigns) { this.vitalSigns = vitalSigns; }
    public void setFollowUpInstructions(String followUpInstructions) { this.followUpInstructions = followUpInstructions; }
}
