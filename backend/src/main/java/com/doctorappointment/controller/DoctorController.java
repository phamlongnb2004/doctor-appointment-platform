package com.doctorappointment.controller;

import com.doctorappointment.dto.DoctorResponse;
import com.doctorappointment.model.Doctor;
import com.doctorappointment.model.Specialty;
import com.doctorappointment.repository.SpecialtyRepository;
import com.doctorappointment.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        try {
            doctorService.deleteDoctor(id);
            return ResponseEntity.ok(Map.of("message", "Doctor deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}
