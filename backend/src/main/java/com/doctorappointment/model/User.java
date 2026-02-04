package com.doctorappointment.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(columnDefinition = "LONGTEXT")
    private String profileImage;

    @Column(columnDefinition = "LONGTEXT")
    private String coverImage;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private boolean active;

    public User() {}

    // Getters
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getPhone() { return phone; }
    public UserRole getRole() { return role; }
    public String getProfileImage() { return profileImage; }
    public String getCoverImage() { return coverImage; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public boolean isActive() { return active; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setRole(UserRole role) { this.role = role; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public void setActive(boolean active) { this.active = active; }

    // Builder pattern
    public static UserBuilder builder() { return new UserBuilder(); }

    public static class UserBuilder {
        private User user = new User();

        public UserBuilder id(Long id) { user.id = id; return this; }
        public UserBuilder email(String email) { user.email = email; return this; }
        public UserBuilder password(String password) { user.password = password; return this; }
        public UserBuilder firstName(String firstName) { user.firstName = firstName; return this; }
        public UserBuilder lastName(String lastName) { user.lastName = lastName; return this; }
        public UserBuilder phone(String phone) { user.phone = phone; return this; }
        public UserBuilder role(UserRole role) { user.role = role; return this; }
        public UserBuilder profileImage(String profileImage) { user.profileImage = profileImage; return this; }
        public UserBuilder coverImage(String coverImage) { user.coverImage = coverImage; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { user.createdAt = createdAt; return this; }
        public UserBuilder updatedAt(LocalDateTime updatedAt) { user.updatedAt = updatedAt; return this; }
        public UserBuilder active(boolean active) { user.active = active; return this; }

        public User build() { return user; }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        active = true;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum UserRole {
        PATIENT,
        DOCTOR,
        ADMIN,
        CONSULTANT
    }
}
