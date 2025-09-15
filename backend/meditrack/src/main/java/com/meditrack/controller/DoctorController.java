
package com.meditrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.meditrack.entity.Doctor;
import com.meditrack.payload.UpdateDoctorDetailsRequest;
import com.meditrack.service.DoctorService;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // Doctor Profile
    @GetMapping("/{id}/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public Doctor getProfile(@PathVariable Long id) {
        return doctorService.getDoctorProfile(id);
    }

    // Doctor Appointments
    @GetMapping("/{id}/appointments")
    @PreAuthorize("hasRole('DOCTOR')")
    public List<?> getAppointments(@PathVariable Long id) {
        return doctorService.getDoctorAppointments(id);
    }

    // Search doctors by specialization
    @GetMapping("/search")
    public List<Doctor> searchDoctorsBySpecialization(@RequestParam String specialization) {
        return doctorService.findDoctorsBySpecialization(specialization);
    }

    // Get all specializations
    @GetMapping("/specializations")
    public List<String> getSpecializations() {
        return doctorService.getSpecializations();
    }

    // Update doctor details
    @PutMapping("/{userId}/details")
    public Doctor updateDoctorDetails(@PathVariable Long userId, @RequestBody UpdateDoctorDetailsRequest request) {
        return doctorService.updateDoctorDetails(userId, request);
    }
}

