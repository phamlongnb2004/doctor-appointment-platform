package com.doctorappointment.controller;

import com.doctorappointment.model.Appointment;
import com.doctorappointment.model.Order;
import com.doctorappointment.repository.AppointmentRepository;
import com.doctorappointment.repository.DoctorRepository;
import com.doctorappointment.repository.OrderRepository;
import com.doctorappointment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
@RequiredArgsConstructor
public class ReportController {

    private final OrderRepository orderRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("ReportController is working!");
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : LocalDateTime.now().minusMonths(1);
        LocalDateTime end = endDate != null ? endDate.atTime(23, 59, 59) : LocalDateTime.now();

        // Revenue statistics - Based on payment status
        List<Order> orders = orderRepository.findAll().stream()
                .filter(o -> o.getCreatedAt() != null &&
                        o.getCreatedAt().isAfter(start) &&
                        o.getCreatedAt().isBefore(end))
                .collect(Collectors.toList());

        // Total revenue: Only orders that have been PAID (actual revenue received)
        BigDecimal totalRevenue = BigDecimal.ZERO;
        for (Order o : orders) {
            if ("PAID".equals(o.getPaymentStatus()) && !"CANCELLED".equals(o.getStatus())) {
                if (o.getFinalAmount() != null) {
                    totalRevenue = totalRevenue.add(o.getFinalAmount());
                }
            }
        }

        // Pending revenue: Orders that are confirmed/processing but not yet paid
        BigDecimal pendingRevenue = BigDecimal.ZERO;
        for (Order o : orders) {
            if (!"PAID".equals(o.getPaymentStatus()) && !"CANCELLED".equals(o.getStatus())) {
                if (o.getFinalAmount() != null) {
                    pendingRevenue = pendingRevenue.add(o.getFinalAmount());
                }
            }
        }

        // Completed orders: Orders with PAID status (payment completed)
        long completedOrders = orders.stream()
                .filter(o -> "PAID".equals(o.getPaymentStatus()) && !"CANCELLED".equals(o.getStatus()))
                .count();

        Map<String, Object> revenueStats = new HashMap<>();
        revenueStats.put("totalRevenue", totalRevenue);
        revenueStats.put("pendingRevenue", pendingRevenue);
        revenueStats.put("totalOrders", orders.size());
        revenueStats.put("completedOrders", completedOrders);
        revenueStats.put("startDate", start.toLocalDate());
        revenueStats.put("endDate", end.toLocalDate());

        // Appointment statistics
        List<Appointment> appointments = appointmentRepository.findAll().stream()
                .filter(a -> a.getCreatedAt() != null &&
                        a.getCreatedAt().isAfter(start) &&
                        a.getCreatedAt().isBefore(end))
                .collect(Collectors.toList());

        Map<String, Long> appointmentsByStatus = appointments.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getStatus() != null ? a.getStatus().toString() : "UNKNOWN",
                        Collectors.counting()
                ));

        Map<String, Object> appointmentStats = new HashMap<>();
        appointmentStats.put("totalAppointments", appointments.size());
        appointmentStats.put("byStatus", appointmentsByStatus);
        appointmentStats.put("startDate", start.toLocalDate());
        appointmentStats.put("endDate", end.toLocalDate());

        // Doctor statistics
        Map<Long, Long> appointmentsByDoctor = appointments.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getDoctor().getId(),
                        Collectors.counting()
                ));

        List<Map<String, Object>> topDoctors = new ArrayList<>();
        for (Map.Entry<Long, Long> entry : appointmentsByDoctor.entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toList())) {
            
            doctorRepository.findById(entry.getKey()).ifPresent(doctor -> {
                Map<String, Object> doctorStat = new HashMap<>();
                doctorStat.put("doctorId", doctor.getId());
                doctorStat.put("doctorName", doctor.getUser().getFirstName() + " " + doctor.getUser().getLastName());
                doctorStat.put("specialization", doctor.getSpecialization());
                doctorStat.put("appointmentCount", entry.getValue());

                // Calculate revenue
                double revenue = 0.0;
                for (Appointment a : appointments) {
                    if (a.getDoctor().getId().equals(doctor.getId())) {
                        Integer fee = a.getDoctor().getConsultationFee();
                        if (fee != null) {
                            revenue += fee.doubleValue();
                        }
                    }
                }
                doctorStat.put("revenue", BigDecimal.valueOf(revenue));
                topDoctors.add(doctorStat);
            });
        }

        Map<String, Object> doctorStats = new HashMap<>();
        doctorStats.put("totalDoctors", doctorRepository.count());
        doctorStats.put("activeDoctors", appointmentsByDoctor.size());
        doctorStats.put("topDoctors", topDoctors);
        doctorStats.put("totalAppointments", appointments.size());
        doctorStats.put("startDate", start.toLocalDate());
        doctorStats.put("endDate", end.toLocalDate());

        // Combine all stats
        Map<String, Object> result = new HashMap<>();
        result.put("revenue", revenueStats);
        result.put("appointments", appointmentStats);
        result.put("doctors", doctorStats);
        result.put("totalUsers", userRepository.count());

        return ResponseEntity.ok(result);
    }
}
