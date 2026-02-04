package com.doctorappointment.repository;

import com.doctorappointment.model.MembershipBenefit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MembershipBenefitRepository extends JpaRepository<MembershipBenefit, Long> {
    List<MembershipBenefit> findByIsActiveTrueOrderByDisplayOrderAsc();
    List<MembershipBenefit> findAllByOrderByDisplayOrderAsc();
}
