package com.doctorappointment.repository;

import com.doctorappointment.model.NewsSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NewsSectionRepository extends JpaRepository<NewsSection, Long> {
    
    List<NewsSection> findByIsActiveTrueOrderByDisplayOrderAsc();
    
    Optional<NewsSection> findByName(String name);
    
    List<NewsSection> findAllByOrderByDisplayOrderAsc();
    
    // Find sections by page (home, news, or both)
    List<NewsSection> findByIsActiveTrueAndPageInOrderByDisplayOrderAsc(List<String> pages);
}
