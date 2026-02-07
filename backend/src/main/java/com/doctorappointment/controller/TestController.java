package com.doctorappointment.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestController {

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
}
