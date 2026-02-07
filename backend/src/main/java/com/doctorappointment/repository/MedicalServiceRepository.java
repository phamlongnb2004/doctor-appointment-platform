package com.doctorappointment.repository;

import com.doctorappointment.model.MedicalService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalServiceRepository extends JpaRepository<MedicalService, Long> {
    List<MedicalService> findByIsActiveTrueOrderByDisplayOrderAsc();
    List<MedicalService> findAllByOrderByDisplayOrderAsc();
    List<MedicalService> findByCategoryIdAndIsActiveTrueOrderByDisplayOrderAsc(Long categoryId);
    List<MedicalService> findByIsFeaturedTrueAndIsActiveTrueOrderByDisplayOrderAsc();
    Optional<MedicalService> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
