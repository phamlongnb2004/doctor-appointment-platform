package com.doctorappointment.repository;

import com.doctorappointment.model.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
    
    @Query("SELECT t FROM Testimonial t WHERE t.isActive = true ORDER BY t.displayOrder ASC")
    List<Testimonial> findAllActiveOrderByDisplayOrder();
    
    @Query("SELECT t FROM Testimonial t WHERE t.isActive = true AND t.isFeatured = true ORDER BY t.displayOrder ASC")
    List<Testimonial> findFeaturedTestimonials(Pageable pageable);
    
    List<Testimonial> findByIsActiveTrueOrderByDisplayOrderAsc();
}