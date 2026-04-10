package com.doctorappointment.controller;

import com.doctorappointment.dto.DoctorResponse;
import com.doctorappointment.dto.DoctorRevenueResponse;
import com.doctorappointment.model.Doctor;
import com.doctorappointment.model.DoctorCertification;
import com.doctorappointment.model.Specialty;
import com.doctorappointment.repository.SpecialtyRepository;
import com.doctorappointment.service.DoctorService;
import com.doctorappointment.service.DoctorCertificationService;
import com.doctorappointment.service.DoctorRevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/doctors")
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
public class DoctorController {
    private final DoctorService doctorService;
    private final SpecialtyRepository specialtyRepository;
    private final DoctorCertificationService certificationService;
    private final DoctorRevenueService revenueService;

    @PostMapping
    public ResponseEntity<?> createDoctor(@RequestBody Doctor doctor) {
        try {
            Doctor createdDoctor = doctorService.createDoctor(doctor);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDoctor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable Long id) {
        var doctor = doctorService.getDoctorById(id);
        if (doctor.isPresent()) {
            return ResponseEntity.ok(DoctorResponse.fromDoctor(doctor.get()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Doctor not found"));
    }

    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        List<DoctorResponse> doctors = doctorService.getAllDoctors().stream()
                .map(DoctorResponse::fromDoctor)
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/active/all")
    public ResponseEntity<List<DoctorResponse>> getActiveDoctors() {
        List<DoctorResponse> doctors = doctorService.getActiveDoctors().stream()
                .map(DoctorResponse::fromDoctor)
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctors);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getDoctorByUserId(@PathVariable Long userId) {
        var doctor = doctorService.getDoctorByUserId(userId);
        if (doctor.isPresent()) {
            return ResponseEntity.ok(doctor.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Doctor not found for user"));
    }

    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<Doctor>> getDoctorsBySpecialization(@PathVariable String specialization) {
        return ResponseEntity.ok(doctorService.getDoctorsBySpecialization(specialization));
    }

    @GetMapping("/specialties")
    public ResponseEntity<List<Specialty>> getAllSpecialties() {
        return ResponseEntity.ok(specialtyRepository.findByIsActiveTrueOrderByDisplayOrderAsc());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctorDetails) {
        try {
            Doctor updatedDoctor = doctorService.updateDoctor(id, doctorDetails);
            return ResponseEntity.ok(updatedDoctor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/my-profile/{userId}")
    public ResponseEntity<?> updateMyDoctorProfile(@PathVariable Long userId, @RequestBody Doctor doctorDetails) {
        try {
            System.out.println("=== UPDATE DOCTOR PROFILE ===");
            System.out.println("User ID: " + userId);
            System.out.println("Doctor Details: " + doctorDetails);
            
            // Get doctor by userId to ensure they can only update their own profile
            var doctorOpt = doctorService.getDoctorByUserId(userId);
            if (doctorOpt.isEmpty()) {
                System.out.println("ERROR: Doctor profile not found for user ID: " + userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Doctor profile not found"));
            }
            
            Doctor existingDoctor = doctorOpt.get();
            System.out.println("Existing Doctor ID: " + existingDoctor.getId());
            
            // Update only allowed fields
            if (doctorDetails.getSpecialization() != null) {
                existingDoctor.setSpecialization(doctorDetails.getSpecialization());
            }
            if (doctorDetails.getExperienceYears() != null) {
                existingDoctor.setExperienceYears(doctorDetails.getExperienceYears());
            }
            if (doctorDetails.getConsultationFee() != null) {
                existingDoctor.setConsultationFee(doctorDetails.getConsultationFee());
            }
            if (doctorDetails.getBiography() != null) {
                existingDoctor.setBiography(doctorDetails.getBiography());
            }
            if (doctorDetails.getClinicAddress() != null) {
                existingDoctor.setClinicAddress(doctorDetails.getClinicAddress());
            }
            
            System.out.println("About to update doctor...");
            Doctor updatedDoctor = doctorService.updateDoctor(existingDoctor.getId(), existingDoctor);
            System.out.println("Doctor updated successfully!");
            return ResponseEntity.ok(updatedDoctor);
        } catch (Exception e) {
            System.out.println("ERROR updating doctor profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        try {
            doctorService.deleteDoctor(id);
            return ResponseEntity.ok(Map.of("message", "Doctor deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
    
    // Doctor Certification endpoints
    @GetMapping("/{doctorId}/certifications")
    public ResponseEntity<List<DoctorCertification>> getDoctorCertifications(@PathVariable Long doctorId) {
        List<DoctorCertification> certifications = certificationService.getDoctorCertifications(doctorId);
        return ResponseEntity.ok(certifications);
    }
    
    @GetMapping("/my-profile/{userId}/certifications")
    public ResponseEntity<List<DoctorCertification>> getMyCertifications(@PathVariable Long userId) {
        try {
            var doctorOpt = doctorService.getDoctorByUserId(userId);
            if (doctorOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            Doctor doctor = doctorOpt.get();
            List<DoctorCertification> certifications = certificationService.getDoctorCertifications(doctor.getId());
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @PostMapping("/my-profile/{userId}/certifications")
    public ResponseEntity<?> uploadCertification(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description) {
        try {
            // Get doctor by userId
            var doctorOpt = doctorService.getDoctorByUserId(userId);
            if (doctorOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Doctor profile not found"));
            }
            
            Doctor doctor = doctorOpt.get();
            DoctorCertification certification = certificationService.addCertification(
                    doctor.getId(), file, title, description);
            
            return ResponseEntity.ok(certification);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/my-profile/{userId}/certifications/{certificationId}")
    public ResponseEntity<?> deleteCertification(
            @PathVariable Long userId,
            @PathVariable Long certificationId) {
        try {
            // Get doctor by userId to ensure they can only delete their own certifications
            var doctorOpt = doctorService.getDoctorByUserId(userId);
            if (doctorOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Doctor profile not found"));
            }
            
            Doctor doctor = doctorOpt.get();
            certificationService.deleteCertification(doctor.getId(), certificationId);
            
            return ResponseEntity.ok(Map.of("message", "Certification deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
    
    // Revenue endpoint
    @GetMapping("/my-profile/{userId}/revenue")
    public ResponseEntity<?> getMyRevenue(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            var doctorOpt = doctorService.getDoctorByUserId(userId);
            if (doctorOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Doctor profile not found"));
            }
            
            Doctor doctor = doctorOpt.get();
            DoctorRevenueResponse revenue = revenueService.getDoctorRevenue(doctor.getId(), startDate, endDate);
            
            return ResponseEntity.ok(revenue);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
