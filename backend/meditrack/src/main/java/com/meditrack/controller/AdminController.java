
package com.meditrack.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.meditrack.entity.User;
import com.meditrack.service.AdminService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Get all doctors who are waiting for approval
    @GetMapping("/pending-doctors")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<User> getPendingDoctors() {
        return adminService.getUnverifiedDoctors();
    }

    // Approve doctor by userId
    @PutMapping("/verify-doctor/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public User verifyDoctor(@PathVariable Long userId) {
        return adminService.verifyDoctor(userId);
    }
}