package com.doctorappointment.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctors")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"password", "appointments", "reviews", "hibernateLazyInitializer", "handler"})
    private User user;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private String licenseNumber;

    @Column(columnDefinition = "TEXT")
    private String biography;
    
    @Column(columnDefinition = "TEXT")
    private String qualifications;
    
    @Column(name = "clinic_address", columnDefinition = "TEXT")
    private String clinicAddress;

    @Column(nullable = false)
    private Double ratingScore;

    @Column(nullable = false)
    private Integer consultationFee;

    @Column(nullable = false)
    private Integer experienceYears;

    @Column(nullable = false)
    private Integer reviewCount;

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Doctor() {}

    // Getters
    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getSpecialization() { return specialization; }
    public String getLicenseNumber() { return licenseNumber; }
    public String getBiography() { return biography; }
    public String getQualifications() { return qualifications; }
    public String getClinicAddress() { return clinicAddress; }
    public Double getRatingScore() { return ratingScore; }
    public Integer getConsultationFee() { return consultationFee; }
    public Integer getExperienceYears() { return experienceYears; }
    public Integer getReviewCount() { return reviewCount; }
    public Boolean getActive() { return active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public void setBiography(String biography) { this.biography = biography; }
    public void setQualifications(String qualifications) { this.qualifications = qualifications; }
    public void setClinicAddress(String clinicAddress) { this.clinicAddress = clinicAddress; }
    public void setRatingScore(Double ratingScore) { this.ratingScore = ratingScore; }
    public void setConsultationFee(Integer consultationFee) { this.consultationFee = consultationFee; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }
    public void setActive(Boolean active) { this.active = active; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder pattern
    public static DoctorBuilder builder() { return new DoctorBuilder(); }

    public static class DoctorBuilder {
        private Doctor doctor = new Doctor();

        public DoctorBuilder id(Long id) { doctor.id = id; return this; }
        public DoctorBuilder user(User user) { doctor.user = user; return this; }
        public DoctorBuilder specialization(String specialization) { doctor.specialization = specialization; return this; }
        public DoctorBuilder licenseNumber(String licenseNumber) { doctor.licenseNumber = licenseNumber; return this; }
        public DoctorBuilder biography(String biography) { doctor.biography = biography; return this; }
        public DoctorBuilder ratingScore(Double ratingScore) { doctor.ratingScore = ratingScore; return this; }
        public DoctorBuilder consultationFee(Integer consultationFee) { doctor.consultationFee = consultationFee; return this; }
        public DoctorBuilder experienceYears(Integer experienceYears) { doctor.experienceYears = experienceYears; return this; }
        public DoctorBuilder reviewCount(Integer reviewCount) { doctor.reviewCount = reviewCount; return this; }
        public DoctorBuilder active(Boolean active) { doctor.active = active; return this; }
        public DoctorBuilder createdAt(LocalDateTime createdAt) { doctor.createdAt = createdAt; return this; }
        public DoctorBuilder updatedAt(LocalDateTime updatedAt) { doctor.updatedAt = updatedAt; return this; }

        public Doctor build() { return doctor; }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (ratingScore == null) {
            ratingScore = 0.0;
        }
        if (reviewCount == null) {
            reviewCount = 0;
        }
        if (active == null) {
            active = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
