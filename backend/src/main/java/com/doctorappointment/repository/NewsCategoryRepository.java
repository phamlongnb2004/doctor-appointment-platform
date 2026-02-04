package com.doctorappointment.repository;

import com.doctorappointment.model.NewsCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NewsCategoryRepository extends JpaRepository<NewsCategory, Long> {
    
    @Query("SELECT nc FROM NewsCategory nc WHERE nc.isActive = true ORDER BY nc.displayOrder ASC")
    List<NewsCategory> findAllActiveOrderByDisplayOrder();
    
    @Query("SELECT nc FROM NewsCategory nc ORDER BY nc.displayOrder ASC")
    List<NewsCategory> findAllOrderByDisplayOrder();
    
    Optional<NewsCategory> findBySlug(String slug);
    
    Optional<NewsCategory> findByName(String name);
    
    boolean existsByName(String name);
    
    boolean existsBySlug(String slug);
}
