package com.doctorappointment.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
@Order(1)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                // Remove CORS from Security - let CorsConfig filter handle it
                .authorizeHttpRequests(auth -> {
                    auth
                        .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll() // H2 Console
                        .requestMatchers(new AntPathRequestMatcher("/test/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/orders/sepay/ipn")).permitAll() // Allow SePay IPN callback
                        .requestMatchers(new AntPathRequestMatcher("/users/online/**")).hasAnyRole("ADMIN", "CONSULTANT")
                        .requestMatchers(new AntPathRequestMatcher("/users/stats")).hasAnyRole("ADMIN", "CONSULTANT")
                        .requestMatchers(new AntPathRequestMatcher("/users/doctors")).hasAnyRole("ADMIN", "CONSULTANT")
                        .requestMatchers(new AntPathRequestMatcher("/users/patients")).hasAnyRole("ADMIN", "CONSULTANT")
                        .requestMatchers(new AntPathRequestMatcher("/chat/**")).hasAnyRole("ADMIN", "DOCTOR", "CONSULTANT", "PATIENT")
                        .requestMatchers(new AntPathRequestMatcher("/users/debug/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/actuator/**")).permitAll()
                        .anyRequest().permitAll();
                })
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())) // Allow H2 Console frames
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
