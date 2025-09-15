
package com.meditrack.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.meditrack.entity.User;
import com.meditrack.repository.UserRepository;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getUnverifiedDoctors() {
        return userRepository.findAll().stream()
                .filter(user -> "DOCTOR".equalsIgnoreCase(user.getRole()) && !user.isVerified())
                .toList();
    }

    public User verifyDoctor(Long userId) {
        User doctor = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (!"DOCTOR".equalsIgnoreCase(doctor.getRole())) {
            throw new RuntimeException("User is not a doctor");
        }

        doctor.setVerified(true);
        return userRepository.save(doctor);
    }
}
