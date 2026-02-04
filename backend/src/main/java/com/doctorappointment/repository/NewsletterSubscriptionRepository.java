package com.doctorappointment.repository;

import com.doctorappointment.model.NewsletterSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NewsletterSubscriptionRepository extends JpaRepository<NewsletterSubscription, Long> {
    Optional<NewsletterSubscription> findByEmail(String email);
    Optional<NewsletterSubscription> findByEmailAndVerificationCode(String email, String verificationCode);
    boolean existsByEmail(String email);
}
