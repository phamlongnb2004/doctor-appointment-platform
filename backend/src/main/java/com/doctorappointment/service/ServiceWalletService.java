package com.doctorappointment.service;

import com.doctorappointment.dto.*;
import com.doctorappointment.model.*;
import com.doctorappointment.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ServiceWalletService {

    @Autowired
    private ServiceWalletRepository walletRepository;

    @Autowired
    private ServiceWalletItemRepository walletItemRepository;

    @Autowired
    private ServiceUsageCodeRepository usageCodeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    /**
     * Tạo hoặc lấy ví của user
     */
    @Transactional
    public ServiceWallet getOrCreateWallet(Long userId) {
        return walletRepository.findByUserId(userId)
                .orElseGet(() -> {
                    ServiceWallet wallet = new ServiceWallet();
                    wallet.setUserId(userId);
                    return walletRepository.save(wallet);
                });
    }

    /**
     * Thêm dịch vụ vào ví từ đơn hàng đã thanh toán
     */
    @Transactional
    public void addServicesToWalletFromOrder(Order order) {
        if (order.getUserId() == null) {
            throw new RuntimeException("Cannot add services to wallet for guest orders");
        }

        ServiceWallet wallet = getOrCreateWallet(order.getUserId());

        for (OrderItem orderItem : order.getItems()) {
            ServiceWalletItem walletItem = new ServiceWalletItem();
            walletItem.setWallet(wallet);
            walletItem.setOrderId(order.getId());
            walletItem.setOrderNumber(order.getOrderNumber());
            walletItem.setServiceId(orderItem.getServiceId());
            walletItem.setServiceTitle(orderItem.getServiceTitle());
            walletItem.setServiceImage(orderItem.getServiceImage());
            walletItem.setServiceSlug(orderItem.getServiceSlug());
            walletItem.setQuantity(orderItem.getQuantity());
            walletItem.setUsedQuantity(0);
            walletItem.setUnitPrice(orderItem.getUnitPrice());
            walletItem.setStatus("ACTIVE");
            // Có thể set expiry date nếu cần (ví dụ: 1 năm)
            // walletItem.setExpiryDate(LocalDateTime.now().plusYears(1));

            wallet.getItems().add(walletItem);
        }

        walletRepository.save(wallet);
    }

    /**
     * Lấy ví của user
     */
    public ServiceWalletResponse getWallet(Long userId) {
        try {
            ServiceWallet wallet = getOrCreateWallet(userId);
            return mapToWalletResponse(wallet);
        } catch (Exception e) {
            System.err.println("Error in getWallet: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to get wallet: " + e.getMessage(), e);
        }
    }

    /**
     * Sử dụng dịch vụ từ ví - tạo mã sử dụng
     */
    @Transactional
    public ServiceUsageCodeResponse useService(Long userId, UseServiceRequest request) {
        ServiceWalletItem walletItem = walletItemRepository.findById(request.getWalletItemId())
                .orElseThrow(() -> new RuntimeException("Wallet item not found"));

        // Kiểm tra quyền sở hữu
        if (!walletItem.getWallet().getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to wallet item");
        }

        // Kiểm tra còn dịch vụ không
        if (!walletItem.isAvailable()) {
            throw new RuntimeException("Service is not available");
        }

        // Tạo mã sử dụng
        ServiceUsageCode usageCode = new ServiceUsageCode();
        usageCode.setCode(generateUsageCode());
        usageCode.setWalletItemId(walletItem.getId());
        usageCode.setUserId(userId);
        usageCode.setServiceId(walletItem.getServiceId());
        usageCode.setServiceTitle(walletItem.getServiceTitle());
        usageCode.setStatus("ACTIVE");
        usageCode.setNotes(request.getNotes());
        
        // Set expiry date nếu wallet item có
        if (walletItem.getExpiryDate() != null) {
            usageCode.setExpiryDate(walletItem.getExpiryDate());
        }

        usageCode = usageCodeRepository.save(usageCode);

        // Cập nhật số lượng đã sử dụng
        walletItem.setUsedQuantity(walletItem.getUsedQuantity() + 1);
        if (walletItem.getUsedQuantity() >= walletItem.getQuantity()) {
            walletItem.setStatus("USED");
        }
        walletItemRepository.save(walletItem);

        return mapToUsageCodeResponse(usageCode);
    }

    /**
     * Tra cứu mã sử dụng
     */
    public ServiceUsageCodeResponse lookupCode(String code) {
        ServiceUsageCode usageCode = usageCodeRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Code not found"));
        return mapToUsageCodeResponse(usageCode);
    }

    /**
     * Xác nhận sử dụng mã (bác sĩ sử dụng)
     */
    @Transactional
    public ServiceUsageCodeResponse verifyAndUseCode(Long doctorId, VerifyCodeRequest request) {
        ServiceUsageCode usageCode = usageCodeRepository.findByCode(request.getCode())
                .orElseThrow(() -> new RuntimeException("Code not found"));

        // Kiểm tra mã còn hợp lệ không
        if (!usageCode.isValid()) {
            throw new RuntimeException("Code is not valid or has been used");
        }

        // Đánh dấu đã sử dụng
        usageCode.setStatus("USED");
        usageCode.setUsedByDoctorId(doctorId);
        usageCode.setUsedAt(LocalDateTime.now());
        if (request.getNotes() != null && !request.getNotes().isEmpty()) {
            usageCode.setNotes(usageCode.getNotes() != null ? 
                usageCode.getNotes() + "\n" + request.getNotes() : request.getNotes());
        }

        usageCode = usageCodeRepository.save(usageCode);
        return mapToUsageCodeResponse(usageCode);
    }

    /**
     * Lấy danh sách mã của user
     */
    public List<ServiceUsageCodeResponse> getUserCodes(Long userId) {
        List<ServiceUsageCode> codes = usageCodeRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return codes.stream().map(this::mapToUsageCodeResponse).collect(Collectors.toList());
    }

    /**
     * Lấy danh sách mã đang hoạt động của user
     */
    public List<ServiceUsageCodeResponse> getUserActiveCodes(Long userId) {
        List<ServiceUsageCode> codes = usageCodeRepository.findActiveCodesByUserId(userId);
        return codes.stream().map(this::mapToUsageCodeResponse).collect(Collectors.toList());
    }

    /**
     * Lấy danh sách mã đã sử dụng bởi bác sĩ
     */
    public List<ServiceUsageCodeResponse> getDoctorUsedCodes(Long doctorId) {
        List<ServiceUsageCode> codes = usageCodeRepository.findUsedCodesByDoctorId(doctorId);
        return codes.stream().map(this::mapToUsageCodeResponse).collect(Collectors.toList());
    }

    /**
     * Admin: Lấy tất cả mã
     */
    public List<ServiceUsageCodeResponse> getAllCodes() {
        List<ServiceUsageCode> codes = usageCodeRepository.findAllOrderByCreatedAtDesc();
        return codes.stream().map(this::mapToUsageCodeResponse).collect(Collectors.toList());
    }

    /**
     * Tạo mã sử dụng ngẫu nhiên
     */
    private String generateUsageCode() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        String random = String.format("%04d", new Random().nextInt(10000));
        String code = "SVC" + timestamp + random;
        
        // Kiểm tra trùng lặp
        while (usageCodeRepository.findByCode(code).isPresent()) {
            random = String.format("%04d", new Random().nextInt(10000));
            code = "SVC" + timestamp + random;
        }
        
        return code;
    }

    /**
     * Map entities to responses
     */
    private ServiceWalletResponse mapToWalletResponse(ServiceWallet wallet) {
        ServiceWalletResponse response = new ServiceWalletResponse();
        response.setId(wallet.getId());
        response.setUserId(wallet.getUserId());
        response.setCreatedAt(wallet.getCreatedAt());
        response.setUpdatedAt(wallet.getUpdatedAt());

        List<ServiceWalletItemResponse> items = walletItemRepository
                .findByWalletIdOrderByCreatedAtDesc(wallet.getId())
                .stream()
                .map(this::mapToWalletItemResponse)
                .collect(Collectors.toList());
        response.setItems(items);

        return response;
    }

    private ServiceWalletItemResponse mapToWalletItemResponse(ServiceWalletItem item) {
        ServiceWalletItemResponse response = new ServiceWalletItemResponse();
        response.setId(item.getId());
        response.setOrderId(item.getOrderId());
        response.setOrderNumber(item.getOrderNumber());
        response.setServiceId(item.getServiceId());
        response.setServiceTitle(item.getServiceTitle());
        response.setServiceImage(item.getServiceImage());
        response.setServiceSlug(item.getServiceSlug());
        response.setQuantity(item.getQuantity());
        response.setUsedQuantity(item.getUsedQuantity());
        response.setAvailableQuantity(item.getAvailableQuantity());
        response.setUnitPrice(item.getUnitPrice());
        response.setStatus(item.getStatus());
        response.setExpiryDate(item.getExpiryDate());
        response.setCreatedAt(item.getCreatedAt());
        response.setUpdatedAt(item.getUpdatedAt());
        return response;
    }

    private ServiceUsageCodeResponse mapToUsageCodeResponse(ServiceUsageCode code) {
        ServiceUsageCodeResponse response = new ServiceUsageCodeResponse();
        response.setId(code.getId());
        response.setCode(code.getCode());
        response.setWalletItemId(code.getWalletItemId());
        response.setUserId(code.getUserId());
        response.setServiceId(code.getServiceId());
        response.setServiceTitle(code.getServiceTitle());
        response.setStatus(code.getStatus());
        response.setUsedByDoctorId(code.getUsedByDoctorId());
        response.setUsedAt(code.getUsedAt());
        response.setExpiryDate(code.getExpiryDate());
        response.setNotes(code.getNotes());
        response.setCreatedAt(code.getCreatedAt());
        response.setUpdatedAt(code.getUpdatedAt());
        response.setValid(code.isValid());

        // Lấy tên user
        userRepository.findById(code.getUserId()).ifPresent(user -> 
            response.setUserName(user.getFirstName() + " " + user.getLastName())
        );

        // Lấy tên bác sĩ nếu đã sử dụng
        if (code.getUsedByDoctorId() != null) {
            doctorRepository.findById(code.getUsedByDoctorId()).ifPresent(doctor -> {
                if (doctor.getUser() != null) {
                    response.setUsedByDoctorName(
                        doctor.getUser().getFirstName() + " " + doctor.getUser().getLastName()
                    );
                }
            });
        }

        return response;
    }
}
