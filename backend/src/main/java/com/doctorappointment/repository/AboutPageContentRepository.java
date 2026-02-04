package com.doctorappointment.repository;

import com.doctorappointment.model.AboutPageContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AboutPageContentRepository extends JpaRepository<AboutPageContent, Long> {
    Optional<AboutPageContent> findBySectionKey(String sectionKey);
}
