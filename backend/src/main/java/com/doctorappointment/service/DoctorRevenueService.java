package com.doctorappointment.service;

import com.doctorappointment.dto.DoctorRevenueResponse;
import com.doctorappointment.model.Appointment;
import com.doctorappointment.model.Appointment.AppointmentStatus;
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
    
    public DoctorRevenueResponse getDoctorRevenue(Long doctorId, LocalDate startDate, LocalDate endDate) {
        // Set default date range if not provided (last 6 months)
        LocalDate now = LocalDate.now();
        final LocalDate filterStartDate = (startDate != null) ? startDate : now.minusMonths(6);
        final LocalDate filterEndDate = (endDate != null) ? endDate : now;
        
        // Get all appointments for this doctor within date range
        List<Appointment> allAppointments = appointmentRepository.findByDoctor_Id(doctorId).stream()
                .filter(apt -> {
                    LocalDate aptDate = apt.getAppointmentDateTime().toLocalDate();
                    return !aptDate.isBefore(filterStartDate) && !aptDate.isAfter(filterEndDate);
                })
                .collect(Collectors.toList());
        
        // Filter completed appointments (these generate revenue)
        List<Appointment> completedAppointments = allAppointments.stream()
                .filter(apt -> apt.getStatus() == AppointmentStatus.COMPLETED)
                .collect(Collectors.toList());
        
        // Get doctor's consultation fee
        BigDecimal consultationFee = BigDecimal.valueOf(200000); // Default fee, should get from doctor
        
        // Calculate total revenue
        BigDecimal totalRevenue = BigDecimal.valueOf(completedAppointments.size())
                .multiply(consultationFee);
        
        // Calculate monthly revenue (current month)
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        long monthlyCount = completedAppointments.stream()
                .filter(apt -> !apt.getAppointmentDateTime().toLocalDate().isBefore(startOfMonth))
                .count();
        BigDecimal monthlyRevenue = BigDecimal.valueOf(monthlyCount).multiply(consultationFee);
        
        // Calculate weekly revenue (last 7 days)
        LocalDate weekAgo = today.minusDays(7);
        long weeklyCount = completedAppointments.stream()
                .filter(apt -> !apt.getAppointmentDateTime().toLocalDate().isBefore(weekAgo))
                .count();
        BigDecimal weeklyRevenue = BigDecimal.valueOf(weeklyCount).multiply(consultationFee);
        
        // Calculate today's revenue
        long todayCount = completedAppointments.stream()
                .filter(apt -> apt.getAppointmentDateTime().toLocalDate().equals(today))
                .count();
        BigDecimal todayRevenue = BigDecimal.valueOf(todayCount).multiply(consultationFee);
        
        // Count appointments by status
        long completed = allAppointments.stream()
                .filter(apt -> apt.getStatus() == AppointmentStatus.COMPLETED)
                .count();
        long cancelled = allAppointments.stream()
                .filter(apt -> apt.getStatus() == AppointmentStatus.CANCELLED)
                .count();
        long pending = allAppointments.stream()
                .filter(apt -> apt.getStatus() == AppointmentStatus.PENDING || 
                              apt.getStatus() == AppointmentStatus.CONFIRMED)
                .count();
        
        // Get monthly data for last 6 months
        List<DoctorRevenueResponse.MonthlyRevenueData> monthlyData = getMonthlyRevenueData(completedAppointments, consultationFee);
        
        // Get recent appointments (last 10 completed)
        List<DoctorRevenueResponse.AppointmentRevenueDetail> recentAppointments = completedAppointments.stream()
                .sorted(Comparator.comparing(Appointment::getAppointmentDateTime).reversed())
                .limit(10)
                .map(apt -> {
                    String patientName = "N/A";
                    if (apt.getPatient() != null) {
                        patientName = apt.getPatient().getFirstName() + " " + apt.getPatient().getLastName();
                    }
                    return DoctorRevenueResponse.AppointmentRevenueDetail.builder()
                            .appointmentId(apt.getId())
                            .patientName(patientName)
                            .appointmentDate(apt.getAppointmentDateTime().toLocalDate())
                            .timeSlot(apt.getAppointmentDateTime().toLocalTime().toString())
                            .fee(consultationFee)
                            .status(apt.getStatus().toString())
                            .build();
                })
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
    
    private List<DoctorRevenueResponse.MonthlyRevenueData> getMonthlyRevenueData(List<Appointment> completedAppointments, BigDecimal consultationFee) {
        LocalDate now = LocalDate.now();
        List<DoctorRevenueResponse.MonthlyRevenueData> monthlyData = new ArrayList<>();
        
        for (int i = 5; i >= 0; i--) {
            LocalDate monthStart = now.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);
            
            List<Appointment> monthAppointments = completedAppointments.stream()
                    .filter(apt -> {
                        LocalDate aptDate = apt.getAppointmentDateTime().toLocalDate();
                        return !aptDate.isBefore(monthStart) && !aptDate.isAfter(monthEnd);
                    })
                    .collect(Collectors.toList());
            
            BigDecimal monthRevenue = BigDecimal.valueOf(monthAppointments.size())
                    .multiply(consultationFee);
            
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
