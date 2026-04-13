package com.doctorappointment.controller;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestController {

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping("/cors-config")
    public Map<String, Object> getCorsConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("message", "CORS Test Endpoint");
        config.put("timestamp", System.currentTimeMillis());
        config.put("allowedOrigins", new String[]{
            "http://localhost:3000",
            "http://localhost:5173",
            "https://doctor-appointment-platform-vaff.onrender.com",
            "https://doctor-appointment-frontend.onrender.com"
        });
        config.put("note", "If you can see this from frontend, CORS is working!");
        return config;
    }
    
    @PostMapping("/fix-users-sequence")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public Map<String, Object> fixUsersSequence() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Get current max ID
            Object maxIdObj = entityManager.createNativeQuery("SELECT MAX(id) FROM users").getSingleResult();
            Long maxId = maxIdObj != null ? ((Number) maxIdObj).longValue() : 0L;
            
            // Get current sequence value
            Object seqValueObj = entityManager.createNativeQuery("SELECT last_value FROM users_id_seq").getSingleResult();
            Long seqValue = seqValueObj != null ? ((Number) seqValueObj).longValue() : 0L;
            
            result.put("maxId", maxId);
            result.put("oldSequenceValue", seqValue);
            
            if (seqValue <= maxId) {
                // Fix the sequence
                Long newSeqValue = maxId + 1;
                entityManager.createNativeQuery("SELECT setval('users_id_seq', :newValue, false)")
                    .setParameter("newValue", newSeqValue)
                    .getSingleResult();
                
                // Verify
                Object newValueObj = entityManager.createNativeQuery("SELECT last_value FROM users_id_seq").getSingleResult();
                Long newValue = newValueObj != null ? ((Number) newValueObj).longValue() : 0L;
                
                result.put("newSequenceValue", newValue);
                result.put("status", "fixed");
                result.put("message", "✅ Users sequence fixed successfully!");
            } else {
                result.put("status", "ok");
                result.put("message", "✅ Sequence is already correct, no fix needed");
            }
            
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "❌ Error: " + e.getMessage());
            e.printStackTrace();
        }
        
        return result;
    }
}
