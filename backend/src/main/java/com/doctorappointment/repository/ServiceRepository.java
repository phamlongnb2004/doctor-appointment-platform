package com.doctorappointment.repository;

import com.doctorappointment.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    
    @Query("SELECT s FROM Service s WHERE s.isActive = true ORDER BY s.displayOrder ASC")
    List<Service> findAllActiveOrderByDisplayOrder();
    
    List<Service> findByIsActiveTrueOrderByDisplayOrderAsc();
}