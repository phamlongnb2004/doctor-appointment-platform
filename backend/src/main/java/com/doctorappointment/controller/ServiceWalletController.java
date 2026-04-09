package com.doctorappointment.controller;

import com.doctorappointment.config.JwtService;
import com.doctorappointment.dto.*;
import com.doctorappointment.model.User;
import com.doctorappointment.service.ServiceWalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wallet")
public class ServiceWalletController {

    @Autowired
    private ServiceWalletService walletService;

    @Autowired
    private JwtService jwtService;

    /**
     * Lấy ví của user hiện tại
     */
    @GetMapping
    public ResponseEntity<ServiceWalletResponse> getMyWallet(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer "
        Long userId = jwtService.extractUserId(token);
        ServiceWalletResponse wallet = walletService.getWallet(userId);
        return ResponseEntity.ok(wallet);
    }

    /**
     * Sử dụng dịch vụ từ ví - tạo mã
     */
    @PostMapping("/use")
    public ResponseEntity<ServiceUsageCodeResponse> useService(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UseServiceRequest request) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        ServiceUsageCodeResponse code = walletService.useService(userId, request);
        return ResponseEntity.ok(code);
    }

    /**
     * Lấy danh sách mã của user
     */
    @GetMapping("/codes")
    public ResponseEntity<List<ServiceUsageCodeResponse>> getMyCodes(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        List<ServiceUsageCodeResponse> codes = walletService.getUserCodes(userId);
        return ResponseEntity.ok(codes);
    }

    /**
     * Lấy danh sách mã đang hoạt động
     */
    @GetMapping("/codes/active")
    public ResponseEntity<List<ServiceUsageCodeResponse>> getMyActiveCodes(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        List<ServiceUsageCodeResponse> codes = walletService.getUserActiveCodes(userId);
        return ResponseEntity.ok(codes);
    }

    /**
     * Tra cứu mã (public - bất kỳ ai cũng có thể tra)
     */
    @GetMapping("/codes/lookup/{code}")
    public ResponseEntity<ServiceUsageCodeResponse> lookupCode(@PathVariable String code) {
        ServiceUsageCodeResponse codeResponse = walletService.lookupCode(code);
        return ResponseEntity.ok(codeResponse);
    }

    /**
     * Bác sĩ xác nhận và sử dụng mã
     */
    @PostMapping("/codes/verify")
    public ResponseEntity<ServiceUsageCodeResponse> verifyCode(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody VerifyCodeRequest request) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        
        // TODO: Check if user is DOCTOR role
        
        ServiceUsageCodeResponse code = walletService.verifyAndUseCode(userId, request);
        return ResponseEntity.ok(code);
    }

    /**
     * Bác sĩ xem danh sách mã đã sử dụng
     */
    @GetMapping("/codes/used")
    public ResponseEntity<List<ServiceUsageCodeResponse>> getUsedCodes(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        
        // TODO: Check if user is DOCTOR role

        List<ServiceUsageCodeResponse> codes = walletService.getDoctorUsedCodes(userId);
        return ResponseEntity.ok(codes);
    }

    /**
     * Admin xem tất cả mã
     */
    @GetMapping("/admin/codes")
    public ResponseEntity<List<ServiceUsageCodeResponse>> getAllCodes(
            @RequestHeader("Authorization") String authHeader) {
        // TODO: Check if user is ADMIN role

        List<ServiceUsageCodeResponse> codes = walletService.getAllCodes();
        return ResponseEntity.ok(codes);
    }
}
