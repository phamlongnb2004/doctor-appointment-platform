package com.doctorappointment.service;

import com.doctorappointment.model.Review;
import com.doctorappointment.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

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

    public Review updateReview(Long id, Review reviewDetails) {
        return reviewRepository.findById(id).map(review -> {
            review.setRating(reviewDetails.getRating());
            review.setComment(reviewDetails.getComment());
            return reviewRepository.save(review);
        }).orElseThrow(() -> new RuntimeException("Review not found"));
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
