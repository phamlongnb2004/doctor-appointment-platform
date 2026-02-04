package com.doctorappointment.repository;

import com.doctorappointment.model.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SpecialtyRepository extends JpaRepository<Specialty, Long> {
    List<Specialty> findByIsActiveTrueOrderByDisplayOrderAsc();
    List<Specialty> findByIsActiveTrueAndIsFeaturedTrueOrderByDisplayOrderAsc();
}
