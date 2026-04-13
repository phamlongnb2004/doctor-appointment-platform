package com.doctorappointment.service;

import com.doctorappointment.dto.QuickBookingRequest;
import com.doctorappointment.dto.QuickBookingResponse;
import com.doctorappointment.model.*;
import com.doctorappointment.model.QuickBooking.QuickBookingStatus;
import com.doctorappointment.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuickBookingService {
    
    private final QuickBookingRepository quickBookingRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;
    private final SendGridEmailService sendGridEmailService;
    
    /**
     * Tạo đặt lịch nhanh mới
     */
    @Transactional
    public QuickBookingResponse createQuickBooking(QuickBookingRequest request) {
        QuickBooking quickBooking = new QuickBooking();
        quickBooking.setPatientName(request.getPatientName());
        quickBooking.setPhoneNumber(request.getPhoneNumber());
        quickBooking.setEmail(request.getEmail());
        quickBooking.setSpecialty(request.getSpecialty());
        quickBooking.setSymptoms(request.getSymptoms());
        quickBooking.setPreferredDate(request.getPreferredDate());
        quickBooking.setPreferredTime(request.getPreferredTime());
        quickBooking.setStatus(QuickBookingStatus.PENDING);
        quickBooking.setCreatedAt(LocalDateTime.now());
        
        QuickBooking saved = quickBookingRepository.save(quickBooking);
        
        // Gửi thông báo cho admin
        notifyAdminsNewQuickBooking(saved);
        
        return mapToResponse(saved);
    }
    
    /**
     * Lấy tất cả đặt lịch nhanh (cho admin)
     */
    public List<QuickBookingResponse> getAllQuickBookings() {
        return quickBookingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Lấy đặt lịch nhanh theo status
     */
    public List<QuickBookingResponse> getQuickBookingsByStatus(QuickBookingStatus status) {
        return quickBookingRepository.findByStatusOrderByCreatedAtDesc(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Lấy đặt lịch nhanh của bác sĩ
     */
    public List<QuickBookingResponse> getQuickBookingsForDoctor(Long doctorId) {
        return quickBookingRepository.findByAssignedDoctorIdOrderByCreatedAtDesc(doctorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Phân công bác sĩ và set giờ cụ thể cho đặt lịch nhanh
     */
    @Transactional
    public QuickBookingResponse assignDoctorWithTime(Long quickBookingId, Long doctorId, 
                                                      String adminNotes, String confirmedDateTime) {
        QuickBooking quickBooking = quickBookingRepository.findById(quickBookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt lịch nhanh"));
        
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));
        
        quickBooking.setAssignedDoctor(doctor);
        quickBooking.setStatus(QuickBookingStatus.ASSIGNED);
        quickBooking.setAdminNotes(adminNotes);
        
        // Set giờ cụ thể admin đã chọn
        if (confirmedDateTime != null && !confirmedDateTime.isEmpty()) {
            try {
                // Parse ISO 8601 format with timezone (e.g., "2026-04-14T10:00:00.000Z")
                // Convert from UTC to Vietnam timezone (UTC+7)
                java.time.ZonedDateTime utcTime = java.time.ZonedDateTime.parse(confirmedDateTime);
                java.time.ZonedDateTime vietnamTime = utcTime.withZoneSameInstant(
                    java.time.ZoneId.of("Asia/Ho_Chi_Minh")
                );
                quickBooking.setConfirmedDate(vietnamTime.toLocalDateTime());
            } catch (Exception e) {
                // Fallback to LocalDateTime.parse if no timezone
                quickBooking.setConfirmedDate(LocalDateTime.parse(confirmedDateTime));
            }
        }
        
        quickBooking.setUpdatedAt(LocalDateTime.now());
        
        QuickBooking saved = quickBookingRepository.save(quickBooking);
        
        // Gửi thông báo cho bác sĩ
        notifyDoctorAssignment(saved, doctor);
        
        return mapToResponse(saved);
    }
    
    /**
     * Bác sĩ xác nhận và chuyển đổi thành appointment
     */
    @Transactional
    public QuickBookingResponse confirmAndConvertToAppointment(Long quickBookingId, Long userId) {
        QuickBooking quickBooking = quickBookingRepository.findById(quickBookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt lịch nhanh"));
        
        if (quickBooking.getAssignedDoctor() == null) {
            throw new RuntimeException("Chưa phân công bác sĩ cho đặt lịch này");
        }
        
        if (quickBooking.getConfirmedDate() == null) {
            throw new RuntimeException("Admin chưa set giờ cụ thể cho lịch hẹn này");
        }
        
        // Tạo appointment mới
        Appointment appointment = new Appointment();
        appointment.setDoctor(quickBooking.getAssignedDoctor());
        
        // Tìm user theo email, nếu không có thì tạo mới
        User user = userRepository.findByEmail(quickBooking.getEmail())
                .orElseGet(() -> {
                    // Tạo user mới cho bệnh nhân
                    User newUser = new User();
                    newUser.setEmail(quickBooking.getEmail());
                    
                    // Tách tên từ patientName
                    String[] nameParts = quickBooking.getPatientName().trim().split("\\s+");
                    if (nameParts.length >= 2) {
                        newUser.setFirstName(nameParts[0]);
                        newUser.setLastName(String.join(" ", java.util.Arrays.copyOfRange(nameParts, 1, nameParts.length)));
                    } else {
                        newUser.setFirstName(quickBooking.getPatientName());
                        newUser.setLastName("");
                    }
                    
                    newUser.setPhone(quickBooking.getPhoneNumber());
                    newUser.setRole(User.UserRole.PATIENT);
                    newUser.setActive(true);
                    
                    // Tạo mật khẩu ngẫu nhiên
                    String randomPassword = generateRandomPassword(12);
                    newUser.setPassword(passwordEncoder.encode(randomPassword));
                    
                    User savedUser = userRepository.save(newUser);
                    
                    // Gửi email thông báo cho bệnh nhân về tài khoản và mật khẩu
                    sendAccountCreationEmail(savedUser, randomPassword, quickBooking);
                    
                    return savedUser;
                });
        
        appointment.setPatient(user);
        appointment.setAppointmentDateTime(quickBooking.getConfirmedDate()); // Dùng giờ admin đã set
        appointment.setReason(quickBooking.getSymptoms());
        appointment.setNotes("Chuyển đổi từ đặt lịch nhanh #" + quickBooking.getId() + 
                           (quickBooking.getAdminNotes() != null ? "\nGhi chú admin: " + quickBooking.getAdminNotes() : ""));
        appointment.setStatus(Appointment.AppointmentStatus.CONFIRMED); // Đã confirm luôn
        appointment.setDurationMinutes(30);
        appointment.setCreatedAt(LocalDateTime.now());
        appointment.setUpdatedAt(LocalDateTime.now());
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Cập nhật quick booking
        quickBooking.setConvertedAppointment(savedAppointment);
        quickBooking.setStatus(QuickBookingStatus.CONVERTED);
        quickBooking.setConvertedAt(LocalDateTime.now());
        quickBooking.setUpdatedAt(LocalDateTime.now());
        
        QuickBooking saved = quickBookingRepository.save(quickBooking);
        
        // Gửi thông báo
        notifyConversion(saved, savedAppointment);
        
        return mapToResponse(saved);
    }
    
    /**
     * Phân công bác sĩ cho đặt lịch nhanh (method cũ - giữ lại để tương thích)
     */
    @Transactional
    public QuickBookingResponse assignDoctor(Long quickBookingId, Long doctorId, String adminNotes) {
        return assignDoctorWithTime(quickBookingId, doctorId, adminNotes, null);
    }
    
    /**
     * Chuyển đổi đặt lịch nhanh thành appointment chính thức
     */
    @Transactional
    public QuickBookingResponse convertToAppointment(Long quickBookingId, Long userId) {
        QuickBooking quickBooking = quickBookingRepository.findById(quickBookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt lịch nhanh"));
        
        if (quickBooking.getAssignedDoctor() == null) {
            throw new RuntimeException("Chưa phân công bác sĩ cho đặt lịch này");
        }
        
        // Tạo appointment mới
        Appointment appointment = new Appointment();
        appointment.setDoctor(quickBooking.getAssignedDoctor());
        
        // Tìm user theo email hoặc tạo mới
        User user = userRepository.findByEmail(quickBooking.getEmail())
                .orElse(null);
        
        if (user != null) {
            appointment.setPatient(user);
        } else {
            // Nếu không tìm thấy user, throw exception
            throw new RuntimeException("Không tìm thấy user với email: " + quickBooking.getEmail() + ". Vui lòng tạo tài khoản trước.");
        }
        
        appointment.setAppointmentDateTime(quickBooking.getPreferredDate());
        appointment.setReason(quickBooking.getSymptoms());
        appointment.setNotes("Chuyển đổi từ đặt lịch nhanh #" + quickBooking.getId());
        appointment.setStatus(Appointment.AppointmentStatus.PENDING);
        appointment.setDurationMinutes(30);
        appointment.setCreatedAt(LocalDateTime.now());
        appointment.setUpdatedAt(LocalDateTime.now());
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Cập nhật quick booking
        quickBooking.setConvertedAppointment(savedAppointment);
        quickBooking.setStatus(QuickBookingStatus.CONVERTED);
        quickBooking.setConvertedAt(LocalDateTime.now());
        quickBooking.setUpdatedAt(LocalDateTime.now());
        
        QuickBooking saved = quickBookingRepository.save(quickBooking);
        
        // Gửi thông báo
        notifyConversion(saved, savedAppointment);
        
        return mapToResponse(saved);
    }
    
    /**
     * Hủy đặt lịch nhanh
     */
    @Transactional
    public QuickBookingResponse cancelQuickBooking(Long quickBookingId, String reason) {
        QuickBooking quickBooking = quickBookingRepository.findById(quickBookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt lịch nhanh"));
        
        quickBooking.setStatus(QuickBookingStatus.CANCELLED);
        quickBooking.setAdminNotes(reason);
        quickBooking.setUpdatedAt(LocalDateTime.now());
        
        QuickBooking saved = quickBookingRepository.save(quickBooking);
        
        return mapToResponse(saved);
    }
    
    /**
     * Đếm số lượng đặt lịch nhanh pending
     */
    public long countPendingQuickBookings() {
        return quickBookingRepository.countByStatus(QuickBookingStatus.PENDING);
    }
    
    /**
     * Đếm số lượng đặt lịch nhanh pending cho bác sĩ
     */
    public long countPendingForDoctor(Long doctorId) {
        return quickBookingRepository.countByAssignedDoctorIdAndStatus(doctorId, QuickBookingStatus.ASSIGNED);
    }
    
    // Helper methods
    
    private QuickBookingResponse mapToResponse(QuickBooking quickBooking) {
        QuickBookingResponse response = new QuickBookingResponse();
        response.setId(quickBooking.getId());
        response.setPatientName(quickBooking.getPatientName());
        response.setPhoneNumber(quickBooking.getPhoneNumber());
        response.setEmail(quickBooking.getEmail());
        response.setSpecialty(quickBooking.getSpecialty());
        response.setSymptoms(quickBooking.getSymptoms());
        response.setPreferredDate(quickBooking.getPreferredDate());
        response.setPreferredTime(quickBooking.getPreferredTime());
        response.setConfirmedDate(quickBooking.getConfirmedDate()); // Thêm giờ đã confirm
        response.setStatus(quickBooking.getStatus());
        response.setAdminNotes(quickBooking.getAdminNotes());
        response.setCreatedAt(quickBooking.getCreatedAt());
        response.setUpdatedAt(quickBooking.getUpdatedAt());
        response.setConvertedAt(quickBooking.getConvertedAt());
        
        if (quickBooking.getAssignedDoctor() != null) {
            response.setAssignedDoctorId(quickBooking.getAssignedDoctor().getId());
            User doctorUser = quickBooking.getAssignedDoctor().getUser();
            if (doctorUser != null) {
                response.setAssignedDoctorName(
                    doctorUser.getFirstName() + " " + doctorUser.getLastName()
                );
            }
        }
        
        if (quickBooking.getConvertedAppointment() != null) {
            response.setConvertedAppointmentId(quickBooking.getConvertedAppointment().getId());
        }
        
        return response;
    }
    
    private void notifyAdminsNewQuickBooking(QuickBooking quickBooking) {
        // TODO: Implement notification to admins
    }
    
    private void notifyDoctorAssignment(QuickBooking quickBooking, Doctor doctor) {
        // TODO: Implement notification to doctor
    }
    
    private void notifyConversion(QuickBooking quickBooking, Appointment appointment) {
        // TODO: Implement notification about conversion
    }
    
    /**
     * Tạo mật khẩu ngẫu nhiên
     */
    private String generateRandomPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();
        
        for (int i = 0; i < length; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        return password.toString();
    }
    
    /**
     * Gửi email thông báo tài khoản đã được tạo
     */
    private void sendAccountCreationEmail(User user, String password, QuickBooking quickBooking) {
        try {
            String doctorName = "Chưa xác định";
            if (quickBooking.getAssignedDoctor() != null && quickBooking.getAssignedDoctor().getUser() != null) {
                User doctorUser = quickBooking.getAssignedDoctor().getUser();
                doctorName = doctorUser.getFirstName() + " " + doctorUser.getLastName();
            }
            
            String appointmentTime = quickBooking.getConfirmedDate() != null 
                ? quickBooking.getConfirmedDate().toString() 
                : "Chưa xác định";
            
            // Gửi email qua SendGrid
            sendGridEmailService.sendAccountCreationEmail(
                user.getEmail(),
                user.getFirstName() + " " + user.getLastName(),
                password,
                quickBooking.getSpecialty(),
                doctorName,
                appointmentTime
            );
            
        } catch (Exception e) {
            // Log error but don't fail the transaction
            System.err.println("Failed to send account creation email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
