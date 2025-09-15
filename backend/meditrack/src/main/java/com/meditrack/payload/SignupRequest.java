package com.meditrack.payload;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SignupRequest {
    private String username;
    private String password;
    private String role; // ADMIN, PATIENT, DOCTOR
    private String specialization; // only for doctors
    private String phone;
    private String dateOfBirth;
    private String email;
    // Doctor-specific fields
    private String qualifications; // only for doctors
    private Integer yearsOfExperience; // only for doctors
    private String profilePhoto; // only for doctors (URL or base64)
    private Double consultationFees; // only for doctors
    private String clinicAddress; // only for doctors
   // private String medicalHistory; // only for patients
}