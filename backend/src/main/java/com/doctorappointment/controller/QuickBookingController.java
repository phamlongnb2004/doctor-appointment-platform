package com.doctorappointment.controller;

import com.doctorappointment.dto.QuickBookingRequest;
import com.doctorappointment.dto.QuickBookingResponse;
import com.doctorappointment.model.QuickBooking.QuickBookingStatus;
import com.doctorappointment.service.QuickBookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/quick-bookings")
@RequiredArgsConstructor
@CrossOrigin(
    origins = {
        "http://localhost:3000",
        "http://localhost:5173",
        "https://doctor-appointment-platform-vaff.onrender.com",
        "https://doctor-appointment-frontend-ujug.onrender.com",
        "https://doctor-appointment-frontend.onrender.com"
    },
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class QuickBookingController {
    
    private final QuickBookingService quickBookingService;
    
    /**
     * Tạo đặt lịch nhanh (public - không cần đăng nhập)
     */
    @PostMapping
    public ResponseEntity<QuickBookingResponse> createQuickBooking(
            @Valid @RequestBody QuickBookingRequest request) {
        QuickBookingResponse response = quickBookingService.createQuickBooking(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy tất cả đặt lịch nhanh (Admin only)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<QuickBookingResponse>> getAllQuickBookings() {
        List<QuickBookingResponse> bookings = quickBookingService.getAllQuickBookings();
        return ResponseEntity.ok(bookings);
    }
    
    /**
     * Lấy đặt lịch nhanh theo status (Admin only)
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<QuickBookingResponse>> getQuickBookingsByStatus(
            @PathVariable QuickBookingStatus status) {
        List<QuickBookingResponse> bookings = quickBookingService.getQuickBookingsByStatus(status);
        return ResponseEntity.ok(bookings);
    }
    
    /**
     * Lấy đặt lịch nhanh của bác sĩ (Doctor only)
     */
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<QuickBookingResponse>> getQuickBookingsForDoctor(
            @PathVariable Long doctorId) {
        List<QuickBookingResponse> bookings = quickBookingService.getQuickBookingsForDoctor(doctorId);
        return ResponseEntity.ok(bookings);
    }
    
    /**
     * Phân công bác sĩ và set giờ cụ thể (Admin only)
     */
    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuickBookingResponse> assignDoctor(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        Long doctorId = Long.valueOf(request.get("doctorId").toString());
        String adminNotes = (String) request.get("adminNotes");
        String confirmedDateTime = (String) request.get("confirmedDateTime"); // ISO format datetime
        
        QuickBookingResponse response = quickBookingService.assignDoctorWithTime(
            id, doctorId, adminNotes, confirmedDateTime);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Bác sĩ xác nhận và chuyển thành appointment (Doctor only)
     */
    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<QuickBookingResponse> confirmAndConvert(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Object> request) {
        Long userId = request != null && request.containsKey("userId") 
            ? Long.valueOf(request.get("userId").toString()) 
            : null;
        
        QuickBookingResponse response = quickBookingService.confirmAndConvertToAppointment(id, userId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Chuyển đổi thành appointment (Admin only)
     */
    @PostMapping("/{id}/convert")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuickBookingResponse> convertToAppointment(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Object> request) {
        Long userId = request != null && request.containsKey("userId") 
            ? Long.valueOf(request.get("userId").toString()) 
            : null;
        
        QuickBookingResponse response = quickBookingService.convertToAppointment(id, userId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Hủy đặt lịch nhanh (Admin only)
     */
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuickBookingResponse> cancelQuickBooking(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String reason = request.get("reason");
        QuickBookingResponse response = quickBookingService.cancelQuickBooking(id, reason);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Đếm số lượng pending (Admin only)
     */
    @GetMapping("/count/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> countPending() {
        long count = quickBookingService.countPendingQuickBookings();
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    /**
     * Đếm số lượng pending cho bác sĩ (Doctor only)
     */
    @GetMapping("/count/pending/doctor/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Map<String, Long>> countPendingForDoctor(@PathVariable Long doctorId) {
        long count = quickBookingService.countPendingForDoctor(doctorId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}
