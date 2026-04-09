package com.doctorappointment.service;

import com.doctorappointment.model.Doctor;
import com.doctorappointment.model.DoctorCertification;
import com.doctorappointment.repository.DoctorCertificationRepository;
import com.doctorappointment.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorCertificationService {
    
    private final DoctorCertificationRepository certificationRepository;
    private final DoctorRepository doctorRepository;
    private final CloudinaryService cloudinaryService;
    
    public List<DoctorCertification> getDoctorCertifications(Long doctorId) {
        return certificationRepository.findByDoctorIdOrderByDisplayOrderAsc(doctorId);
    }
    
    @Transactional
    public DoctorCertification addCertification(Long doctorId, MultipartFile file, String title, String description) throws IOException {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        // Upload image to Cloudinary
        String imageUrl = cloudinaryService.uploadImage(file, "doctor-certifications");
        
        // Get next display order
        List<DoctorCertification> existing = certificationRepository.findByDoctorIdOrderByDisplayOrderAsc(doctorId);
        int nextOrder = existing.isEmpty() ? 0 : existing.get(existing.size() - 1).getDisplayOrder() + 1;
        
        DoctorCertification certification = new DoctorCertification();
        certification.setDoctor(doctor);
        certification.setImageUrl(imageUrl);
        certification.setTitle(title);
        certification.setDescription(description);
        certification.setDisplayOrder(nextOrder);
        
        return certificationRepository.save(certification);
    }
    
    @Transactional
    public void deleteCertification(Long doctorId, Long certificationId) {
        certificationRepository.deleteByDoctorIdAndId(doctorId, certificationId);
    }
}
