package com.doctorappointment.repository;

import com.doctorappointment.model.ServiceWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ServiceWalletRepository extends JpaRepository<ServiceWallet, Long> {
    Optional<ServiceWallet> findByUserId(Long userId);
}
