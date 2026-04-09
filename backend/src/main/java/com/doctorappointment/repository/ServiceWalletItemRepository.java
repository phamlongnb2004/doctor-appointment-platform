package com.doctorappointment.repository;

import com.doctorappointment.model.ServiceWalletItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceWalletItemRepository extends JpaRepository<ServiceWalletItem, Long> {
    List<ServiceWalletItem> findByWalletIdOrderByCreatedAtDesc(Long walletId);
    
    @Query("SELECT i FROM ServiceWalletItem i WHERE i.wallet.userId = :userId AND i.status = 'ACTIVE' ORDER BY i.createdAt DESC")
    List<ServiceWalletItem> findActiveItemsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT i FROM ServiceWalletItem i WHERE i.wallet.userId = :userId ORDER BY i.createdAt DESC")
    List<ServiceWalletItem> findAllItemsByUserId(@Param("userId") Long userId);
}
