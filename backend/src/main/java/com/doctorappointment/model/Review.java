package com.doctorappointment.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @Column(nullable = false)
    private Double rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Review() {}

    // Getters
    public Long getId() { return id; }
    public Doctor getDoctor() { return doctor; }
    public User getPatient() { return patient; }
    public Double getRating() { return rating; }
    public String getComment() { return comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }
    public void setPatient(User patient) { this.patient = patient; }
    public void setRating(Double rating) { this.rating = rating; }
    public void setComment(String comment) { this.comment = comment; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder
    public static ReviewBuilder builder() { return new ReviewBuilder(); }
    public static class ReviewBuilder {
        private Review review = new Review();
        public ReviewBuilder id(Long id) { review.id = id; return this; }
        public ReviewBuilder doctor(Doctor doctor) { review.doctor = doctor; return this; }
        public ReviewBuilder patient(User patient) { review.patient = patient; return this; }
        public ReviewBuilder rating(Double rating) { review.rating = rating; return this; }
        public ReviewBuilder comment(String comment) { review.comment = comment; return this; }
        public ReviewBuilder createdAt(LocalDateTime createdAt) { review.createdAt = createdAt; return this; }
        public ReviewBuilder updatedAt(LocalDateTime updatedAt) { review.updatedAt = updatedAt; return this; }
        public Review build() { return review; }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
