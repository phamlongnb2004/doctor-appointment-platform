package com.doctorappointment.repository;

import com.doctorappointment.model.QuickBooking;
import com.doctorappointment.model.QuickBooking.QuickBookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QuickBookingRepository extends JpaRepository<QuickBooking, Long> {
    
    // Tìm theo status
    List<QuickBooking> findByStatusOrderByCreatedAtDesc(QuickBookingStatus status);
    
    // Tìm theo bác sĩ được phân công
    List<QuickBooking> findByAssignedDoctorIdOrderByCreatedAtDesc(Long doctorId);
    
    // Tìm theo bác sĩ và status
    List<QuickBooking> findByAssignedDoctorIdAndStatusOrderByCreatedAtDesc(Long doctorId, QuickBookingStatus status);
    
    // Tìm tất cả chưa xử lý
    List<QuickBooking> findByStatusInOrderByCreatedAtDesc(List<QuickBookingStatus> statuses);
    
    // Đếm số lượng theo status
    long countByStatus(QuickBookingStatus status);
    
    // Đếm số lượng pending cho bác sĩ
    long countByAssignedDoctorIdAndStatus(Long doctorId, QuickBookingStatus status);
    
    // Tìm theo khoảng thời gian
    @Query("SELECT qb FROM QuickBooking qb WHERE qb.createdAt BETWEEN :startDate AND :endDate ORDER BY qb.createdAt DESC")
    List<QuickBooking> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Tìm theo số điện thoại
    List<QuickBooking> findByPhoneNumberOrderByCreatedAtDesc(String phoneNumber);
    
    // Tìm theo email
    List<QuickBooking> findByEmailOrderByCreatedAtDesc(String email);
}
