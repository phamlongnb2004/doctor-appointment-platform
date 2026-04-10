package com.doctorappointment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorRevenueResponse {
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
    private BigDecimal weeklyRevenue;
    private BigDecimal todayRevenue;
    
    private Integer totalAppointments;
    private Integer completedAppointments;
    private Integer cancelledAppointments;
    private Integer pendingAppointments;
    
    private List<MonthlyRevenueData> monthlyData;
    private List<AppointmentRevenueDetail> recentAppointments;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyRevenueData {
        private String month;
        private BigDecimal revenue;
        private Integer appointmentCount;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppointmentRevenueDetail {
        private Long appointmentId;
        private String patientName;
        private LocalDate appointmentDate;
        private String timeSlot;
        private BigDecimal fee;
        private String status;
    }
}
