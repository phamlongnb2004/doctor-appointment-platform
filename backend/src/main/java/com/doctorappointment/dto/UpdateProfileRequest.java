package com.doctorappointment.dto;

public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String profileImage;
    private String coverImage;

    public UpdateProfileRequest() {}

    // Getters
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getPhone() { return phone; }
    public String getProfileImage() { return profileImage; }
    public String getCoverImage() { return coverImage; }

    // Setters
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    // Builder pattern
    public static UpdateProfileRequestBuilder builder() { return new UpdateProfileRequestBuilder(); }

    public static class UpdateProfileRequestBuilder {
        private UpdateProfileRequest request = new UpdateProfileRequest();

        public UpdateProfileRequestBuilder firstName(String firstName) { request.firstName = firstName; return this; }
        public UpdateProfileRequestBuilder lastName(String lastName) { request.lastName = lastName; return this; }
        public UpdateProfileRequestBuilder phone(String phone) { request.phone = phone; return this; }
        public UpdateProfileRequestBuilder profileImage(String profileImage) { request.profileImage = profileImage; return this; }
        public UpdateProfileRequestBuilder coverImage(String coverImage) { request.coverImage = coverImage; return this; }

        public UpdateProfileRequest build() { return request; }
    }
}
