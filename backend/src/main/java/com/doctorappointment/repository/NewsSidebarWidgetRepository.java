package com.doctorappointment.repository;

import com.doctorappointment.model.NewsSidebarWidget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsSidebarWidgetRepository extends JpaRepository<NewsSidebarWidget, Long> {
    
    @Query("SELECT w FROM NewsSidebarWidget w WHERE w.isActive = true ORDER BY w.displayOrder ASC")
    List<NewsSidebarWidget> findAllActiveOrderByDisplayOrder();
    
    List<NewsSidebarWidget> findAllByOrderByDisplayOrderAsc();
}
