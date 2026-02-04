package com.doctorappointment.repository;

import com.doctorappointment.model.Statistic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StatisticRepository extends JpaRepository<Statistic, Long> {
    List<Statistic> findByIsActiveTrueOrderByDisplayOrderAsc();
}
