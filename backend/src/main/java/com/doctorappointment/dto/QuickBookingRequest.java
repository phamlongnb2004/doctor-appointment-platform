package com.doctorappointment.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Data
public class QuickBookingRequest {
    
    @NotBlank(message = "Tên bệnh nhân không được để trống")
    private String patientName;
    
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Số điện thoại không hợp lệ")
    private String phoneNumber;
    
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
    
    @NotBlank(message = "Chuyên khoa không được để trống")
    private String specialty;
    
    private String symptoms;
    
    @NotNull(message = "Ngày khám mong muốn không được để trống")
    private LocalDateTime preferredDate;
    
    @NotBlank(message = "Thời gian khám mong muốn không được để trống")
    @Pattern(regexp = "^(MORNING|AFTERNOON|EVENING)$", message = "Thời gian không hợp lệ")
    private String preferredTime;
}
