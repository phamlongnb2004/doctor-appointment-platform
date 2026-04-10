package com.doctorappointment.service;

import com.doctorappointment.dto.DoctorRevenueResponse;
import com.doctorappointment.model.Appointment;
import com.doctorappointment.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorRevenueService {
    private final AppointmentRepository appointmentRepository;
    
    public DoctorRevenueResponse getDoctorRevenue(Long doctorId) {
        // Get all appointments for this doctor
        List<Appointment> allAppointments = appointmentRepository.findByDoctorId(doctorId);
        
        // Filter completed appointments (these generate revenue)
        List<Appointment> completedAppointments = allAppointments.stream()
                .filter(apt -> "COMPLETED".equalsIgnoreCase(apt.getStatus()))
                .collect(Collectors.toList());
        
        // Calculate total revenue
        BigDecimal totalRevenue = completedAppointments.stream()
                .map(apt -> apt.getFee() != null ? apt.getFee() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate monthly revenue (current month)
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        BigDecimal monthlyRevenue = completedAppointments.stream()
                .filter(apt -> !apt.getAppointmentDate().isBefore(startOfMonth))
                .map(apt -> apt.getFee() != null ? apt.getFee() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate weekly revenue (last 7 days)
        LocalDate weekAgo = now.minusDays(7);
        BigDecimal weeklyRevenue = completedAppointments.stream()
                .filter(apt -> !apt.getAppointmentDate().isBefore(weekAgo))
                .map(apt -> apt.getFee() != null ? apt.getFee() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate today's revenue
        BigDecimal todayRevenue = completedAppointments.stream()
                .filter(apt -> apt.getAppointmentDate().equals(now))
                .map(apt -> apt.getFee() != null ? apt.getFee() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Count appointments by status
        long completed = allAppointments.stream()
                .filter(apt -> "COMPLETED".equalsIgnoreCase(apt.getStatus()))
                .count();
        long cancelled = allAppointments.stream()
                .filter(apt -> "CANCELLED".equalsIgnoreCase(apt.getStatus()))
                .count();
        long pending = allAppointments.stream()
                .filter(apt -> "PENDING".equalsIgnoreCase(apt.getStatus()) || 
                              "CONFIRMED".equalsIgnoreCase(apt.getStatus()))
                .count();
        
        // Get monthly data for last 6 months
        List<DoctorRevenueResponse.MonthlyRevenueData> monthlyData = getMonthlyRevenueData(completedAppointments);
        
        // Get recent appointments (last 10 completed)
        List<DoctorRevenueResponse.AppointmentRevenueDetail> recentAppointments = completedAppointments.stream()
                .sorted(Comparator.comparing(Appointment::getAppointmentDate).reversed())
                .limit(10)
                .map(apt -> DoctorRevenueResponse.AppointmentRevenueDetail.builder()
                        .appointmentId(apt.getId())
                        .patientName(apt.getPatient() != null ? apt.getPatient().getFullName() : "N/A")
                        .appointmentDate(apt.getAppointmentDate())
                        .timeSlot(apt.getTimeSlot())
                        .fee(apt.getFee())
                        .status(apt.getStatus())
                        .build())
                .collect(Collectors.toList());
        
        return DoctorRevenueResponse.builder()
                .totalRevenue(totalRevenue)
                .monthlyRevenue(monthlyRevenue)
                .weeklyRevenue(weeklyRevenue)
                .todayRevenue(todayRevenue)
                .totalAppointments(allAppointments.size())
                .completedAppointments((int) completed)
                .cancelledAppointments((int) cancelled)
                .pendingAppointments((int) pending)
                .monthlyData(monthlyData)
                .recentAppointments(recentAppointments)
                .build();
    }
    
    private List<DoctorRevenueResponse.MonthlyRevenueData> getMonthlyRevenueData(List<Appointment> completedAppointments) {
        LocalDate now = LocalDate.now();
        List<DoctorRevenueResponse.MonthlyRevenueData> monthlyData = new ArrayList<>();
        
        for (int i = 5; i >= 0; i--) {
            LocalDate monthStart = now.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);
            
            List<Appointment> monthAppointments = completedAppointments.stream()
                    .filter(apt -> !apt.getAppointmentDate().isBefore(monthStart) && 
                                  !apt.getAppointmentDate().isAfter(monthEnd))
                    .collect(Collectors.toList());
            
            BigDecimal monthRevenue = monthAppointments.stream()
                    .map(apt -> apt.getFee() != null ? apt.getFee() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            String monthName = monthStart.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + 
                             " " + monthStart.getYear();
            
            monthlyData.add(DoctorRevenueResponse.MonthlyRevenueData.builder()
                    .month(monthName)
                    .revenue(monthRevenue)
                    .appointmentCount(monthAppointments.size())
                    .build());
        }
        
        return monthlyData;
    }
}
