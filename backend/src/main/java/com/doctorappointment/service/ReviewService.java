package com.doctorappointment.service;

import com.doctorappointment.model.Doctor;
import com.doctorappointment.model.MedicalRecord;
import com.doctorappointment.model.Review;
import com.doctorappointment.model.User;
import com.doctorappointment.repository.DoctorRepository;
import com.doctorappointment.repository.MedicalRecordRepository;
import com.doctorappointment.repository.ReviewRepository;
import com.doctorappointment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByDoctorId(Long doctorId) {
        return reviewRepository.findByDoctor_Id(doctorId);
    }

    public List<Review> getReviewsByPatientId(Long patientId) {
        return reviewRepository.findByPatient_Id(patientId);
    }

    public boolean hasReviewForMedicalRecord(Long medicalRecordId) {
        return reviewRepository.existsByMedicalRecord_Id(medicalRecordId);
    }

    @Transactional
    public Review createReviewForMedicalRecord(Long medicalRecordId, Long patientId, Double rating, String comment) {
        // Check if review already exists
        if (reviewRepository.existsByMedicalRecord_Id(medicalRecordId)) {
            throw new RuntimeException("Review already exists for this medical record");
        }

        // Get medical record
        MedicalRecord medicalRecord = medicalRecordRepository.findById(medicalRecordId)
            .orElseThrow(() -> new RuntimeException("Medical record not found"));

        // Get patient
        User patient = userRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Get doctor from medical record
        Doctor doctor = medicalRecord.getDoctor();
        if (doctor == null) {
            throw new RuntimeException("Doctor not found in medical record");
        }

        // Create review
        Review review = Review.builder()
            .doctor(doctor)
            .patient(patient)
            .medicalRecord(medicalRecord)
            .rating(rating)
            .comment(comment)
            .build();

        Review savedReview = reviewRepository.save(review);

        // Update doctor rating
        updateDoctorRating(doctor.getId());

        return savedReview;
    }

    @Transactional
    public void updateDoctorRating(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<Review> reviews = reviewRepository.findByDoctor_Id(doctorId);
        
        if (reviews.isEmpty()) {
            doctor.setRatingScore(0.0);
            doctor.setReviewCount(0);
        } else {
            double avgRating = reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);
            
            doctor.setRatingScore(Math.round(avgRating * 10.0) / 10.0); // Round to 1 decimal
            doctor.setReviewCount(reviews.size());
        }

        doctorRepository.save(doctor);
    }

    public Review updateReview(Long id, Review reviewDetails) {
        return reviewRepository.findById(id).map(review -> {
            review.setRating(reviewDetails.getRating());
            review.setComment(reviewDetails.getComment());
            Review updatedReview = reviewRepository.save(review);
            
            // Update doctor rating after review update
            updateDoctorRating(review.getDoctor().getId());
            
            return updatedReview;
        }).orElseThrow(() -> new RuntimeException("Review not found"));
    }

    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));
        
        Long doctorId = review.getDoctor().getId();
        reviewRepository.deleteById(id);
        
        // Update doctor rating after review deletion
        updateDoctorRating(doctorId);
    }
}
