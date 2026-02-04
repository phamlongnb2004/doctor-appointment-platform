package com.doctorappointment.repository;

import com.doctorappointment.model.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findByIsActiveTrueOrderByDisplayOrderAsc();
    List<Banner> findByPageAndIsActiveTrueOrderByDisplayOrderAsc(String page);
    List<Banner> findByPageOrderByDisplayOrderAsc(String page);
}
