package com.meditrack.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.meditrack.entity.Appointment;
import com.meditrack.service.PatientProfileService;

@RestController
@RequestMapping("/patient")
public class PatientProfileController {

    @Autowired
    private PatientProfileService profileService;

    @GetMapping("/{patientId}/upcoming")
    public List<Appointment> getUpcoming(@PathVariable Long patientId) {
        return profileService.getUpcomingAppointments(patientId);
    }

    @GetMapping("/{patientId}/past")
    public List<Appointment> getPast(@PathVariable Long patientId) {
        return profileService.getPastAppointments(patientId);
    }
}