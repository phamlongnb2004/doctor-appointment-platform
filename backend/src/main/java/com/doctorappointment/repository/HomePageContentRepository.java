package com.doctorappointment.repository;

import com.doctorappointment.model.HomePageContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HomePageContentRepository extends JpaRepository<HomePageContent, Long> {
    
    Optional<HomePageContent> findBySectionKey(String sectionKey);
    
    @Query("SELECT h FROM HomePageContent h WHERE h.isActive = true ORDER BY h.displayOrder ASC")
    List<HomePageContent> findAllActiveOrderByDisplayOrder();
    
    @Query("SELECT h FROM HomePageContent h WHERE h.sectionKey = ?1 AND h.isActive = true")
    Optional<HomePageContent> findActiveBySectionKey(String sectionKey);
    
    List<HomePageContent> findByIsActiveTrueOrderByDisplayOrderAsc();
}