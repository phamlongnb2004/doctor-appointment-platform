package com.doctorappointment.repository;

import com.doctorappointment.model.ArticleCtaSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticleCtaSectionRepository extends JpaRepository<ArticleCtaSection, Long> {
    Optional<ArticleCtaSection> findFirstByIsActiveTrueOrderByIdAsc();
}
