package com.doctorappointment.repository;

import com.doctorappointment.model.ServiceUsageCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceUsageCodeRepository extends JpaRepository<ServiceUsageCode, Long> {
    Optional<ServiceUsageCode> findByCode(String code);
    
    List<ServiceUsageCode> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<ServiceUsageCode> findByWalletItemIdOrderByCreatedAtDesc(Long walletItemId);
    
    @Query("SELECT c FROM ServiceUsageCode c WHERE c.userId = :userId AND c.status = 'ACTIVE' ORDER BY c.createdAt DESC")
    List<ServiceUsageCode> findActiveCodesByUserId(@Param("userId") Long userId);
    
    @Query("SELECT c FROM ServiceUsageCode c WHERE c.status = 'USED' AND c.usedByDoctorId = :doctorId ORDER BY c.usedAt DESC")
    List<ServiceUsageCode> findUsedCodesByDoctorId(@Param("doctorId") Long doctorId);
    
    @Query("SELECT c FROM ServiceUsageCode c ORDER BY c.createdAt DESC")
    List<ServiceUsageCode> findAllOrderByCreatedAtDesc();
}
