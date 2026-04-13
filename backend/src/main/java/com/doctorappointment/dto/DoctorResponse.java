package com.doctorappointment.dto;

import com.doctorappointment.model.Doctor;
import java.time.LocalDateTime;

public class DoctorResponse {
    private Long id;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String profileImage;
    private String specialization;
    private String licenseNumber;
    private String biography;
    private String clinicAddress;
    private Double ratingScore;
    private Integer consultationFee;
    private Integer experienceYears;
    private Integer reviewCount;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public DoctorResponse() {}

    public static DoctorResponse fromDoctor(Doctor doctor) {
        DoctorResponse response = new DoctorResponse();
        response.setId(doctor.getId());
        response.setSpecialization(doctor.getSpecialization());
        response.setLicenseNumber(doctor.getLicenseNumber());
        response.setBiography(doctor.getBiography());
        response.setClinicAddress(doctor.getClinicAddress());
        response.setRatingScore(doctor.getRatingScore());
        response.setConsultationFee(doctor.getConsultationFee());
        response.setExperienceYears(doctor.getExperienceYears());
        response.setReviewCount(doctor.getReviewCount());
        response.setActive(doctor.getActive());
        response.setCreatedAt(doctor.getCreatedAt());
        response.setUpdatedAt(doctor.getUpdatedAt());
        
        // Handle null or lazy-loaded User gracefully
        try {
            if (doctor.getUser() != null) {
                response.setUserId(doctor.getUser().getId());
                response.setEmail(doctor.getUser().getEmail());
                response.setFirstName(doctor.getUser().getFirstName());
                response.setLastName(doctor.getUser().getLastName());
                response.setPhone(doctor.getUser().getPhone());
                response.setProfileImage(doctor.getUser().getProfileImage());
            } else {
                // Doctor without user - use default values
                response.setUserId(null);
                response.setEmail("doctor" + doctor.getId() + "@hospital.com");
                response.setFirstName("Bác sĩ");
                response.setLastName(doctor.getSpecialization());
                response.setPhone("N/A");
                response.setProfileImage(null);
            }
        } catch (Exception e) {
            // Lazy loading exception - use default values
            response.setUserId(null);
            response.setEmail("doctor" + doctor.getId() + "@hospital.com");
            response.setFirstName("Bác sĩ");
            response.setLastName(doctor.getSpecialization());
            response.setPhone("N/A");
            response.setProfileImage(null);
        }
        
        return response;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getBiography() { return biography; }
    public void setBiography(String biography) { this.biography = biography; }

    public String getClinicAddress() { return clinicAddress; }
    public void setClinicAddress(String clinicAddress) { this.clinicAddress = clinicAddress; }

    public Double getRatingScore() { return ratingScore; }
    public void setRatingScore(Double ratingScore) { this.ratingScore = ratingScore; }

    public Integer getConsultationFee() { return consultationFee; }
    public void setConsultationFee(Integer consultationFee) { this.consultationFee = consultationFee; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Computed field for full name
    public String getFullName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        } else if (firstName != null) {
            return firstName;
        } else if (lastName != null) {
            return lastName;
        }
        return "Bác sĩ #" + id;
    }
}
