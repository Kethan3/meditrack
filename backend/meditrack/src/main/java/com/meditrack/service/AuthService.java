package com.meditrack.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.meditrack.entity.Doctor;
import com.meditrack.entity.Patient;
import com.meditrack.entity.User;
import com.meditrack.payload.SignupRequest;
import com.meditrack.repository.DoctorRepository;
import com.meditrack.repository.PatientRepository;
import com.meditrack.repository.UserRepository;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(SignupRequest request) {
        logger.info("Attempting to register user with username: {}", request.getUsername());
        if (userRepository.existsByUsername(request.getUsername())) {
            logger.warn("Username {} already exists", request.getUsername());
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("Email {} already exists", request.getEmail());
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .email(request.getEmail())
                .verified(!"DOCTOR".equalsIgnoreCase(request.getRole())) // doctors need admin approval
                .build();

        User savedUser = userRepository.save(user);

        if ("DOCTOR".equalsIgnoreCase(request.getRole())) {
            Doctor doctor = Doctor.builder()
                    .specialization(request.getSpecialization())
                    .user(savedUser)
                    .qualifications(request.getQualifications())
                    .yearsOfExperience(request.getYearsOfExperience())
                    .profilePhoto(request.getProfilePhoto())
                    .consultationFees(request.getConsultationFees())
                    .clinicAddress(request.getClinicAddress())
                    .build();
            doctorRepository.save(doctor);
        } else if ("PATIENT".equalsIgnoreCase(request.getRole())) {
            Patient patient = Patient.builder()
                    // .medicalHistory(request.getMedicalHistory())
                    .user(savedUser)
                    .build();
            patientRepository.save(patient);
        }

        return savedUser;
    }
}
