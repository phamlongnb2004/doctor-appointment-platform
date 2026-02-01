package com.doctorappointment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String profileImage;
    private String coverImage;
    private String accessToken;
    private String tokenType;
}
