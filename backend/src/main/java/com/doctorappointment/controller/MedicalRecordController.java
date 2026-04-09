package com.doctorappointment.controller;

import com.doctorappointment.dto.MedicalRecordRequest;
import com.doctorappointment.dto.MedicalRecordResponse;
import com.doctorappointment.model.MedicalRecordAttachment;
import com.doctorappointment.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/medical-records")
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
public class MedicalRecordController {
    private final MedicalRecordService medicalRecordService;

    @PostMapping("/start/{appointmentId}")
    public ResponseEntity<?> startExamination(@PathVariable Long appointmentId) {
        try {
            MedicalRecordResponse record = medicalRecordService.startExamination(appointmentId);
            return ResponseEntity.status(HttpStatus.CREATED).body(record);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{recordId}")
    public ResponseEntity<?> updateMedicalRecord(
            @PathVariable Long recordId,
            @RequestBody MedicalRecordRequest request) {
        try {
            MedicalRecordResponse record = medicalRecordService.updateMedicalRecord(recordId, request);
            return ResponseEntity.ok(record);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{recordId}/complete")
    public ResponseEntity<?> completeExamination(@PathVariable Long recordId) {
        try {
            MedicalRecordResponse record = medicalRecordService.completeExamination(recordId);
            return ResponseEntity.ok(record);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{recordId}/attachments")
    public ResponseEntity<?> addAttachment(
            @PathVariable Long recordId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description) {
        try {
            MedicalRecordAttachment attachment = medicalRecordService.addAttachment(recordId, file, description);
            return ResponseEntity.status(HttpStatus.CREATED).body(attachment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/attachments/{attachmentId}")
    public ResponseEntity<?> deleteAttachment(@PathVariable Long attachmentId) {
        try {
            medicalRecordService.deleteAttachment(attachmentId);
            return ResponseEntity.ok(Map.of("message", "Attachment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicalRecordById(@PathVariable Long id) {
        try {
            MedicalRecordResponse record = medicalRecordService.getMedicalRecordById(id);
            return ResponseEntity.ok(record);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<?> getMedicalRecordByAppointmentId(@PathVariable Long appointmentId) {
        try {
            MedicalRecordResponse record = medicalRecordService.getMedicalRecordByAppointmentId(appointmentId);
            return ResponseEntity.ok(record);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientMedicalHistory(@PathVariable Long patientId) {
        try {
            List<MedicalRecordResponse> records = medicalRecordService.getPatientMedicalHistory(patientId);
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorMedicalRecords(@PathVariable Long doctorId) {
        try {
            List<MedicalRecordResponse> records = medicalRecordService.getDoctorMedicalRecords(doctorId);
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
