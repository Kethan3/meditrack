package com.meditrack.controller;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.meditrack.entity.Appointment;
import com.meditrack.payload.AppointmentRequest;
import com.meditrack.service.AppointmentService;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // Patient requests appointment by specialization
    @PostMapping("/request")
    @PreAuthorize("hasRole('PATIENT')")
    public Appointment requestAppointment(@RequestParam Long userId,
                                          @RequestParam String specialization,
                                          @RequestParam String symptoms,
                                          @RequestParam String time) {
        return appointmentService.requestAppointment(
                userId, specialization, symptoms, LocalDateTime.parse(time));
    }

    // Doctor accepts appointment
    @PutMapping("/{appointmentId}/accept/{userId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public Appointment acceptAppointment(@PathVariable Long appointmentId, @PathVariable Long userId) {
        return appointmentService.acceptAppointment(userId, appointmentId);
    }

    // Doctor rejects appointment
    @PutMapping("/{appointmentId}/reject/{userId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public Appointment rejectAppointment(@PathVariable Long appointmentId, @PathVariable Long userId) {
        return appointmentService.rejectAppointment(userId, appointmentId);
    }

    // Mark appointment completed
    @PutMapping("/{appointmentId}/complete")
    @PreAuthorize("hasRole('DOCTOR')")
    public Appointment completeAppointment(@PathVariable Long appointmentId) {
        return appointmentService.completeAppointment(appointmentId);
    }

    // Patient appointments
    @GetMapping("/patient/{userId}")
    @PreAuthorize("hasRole('PATIENT')")
    public List<Appointment> getPatientAppointments(@PathVariable Long userId) {
        return appointmentService.getPatientAppointments(userId);
    }

    // Doctor appointments
    @GetMapping("/doctor/{userId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public List<Appointment> getDoctorAppointments(@PathVariable Long userId) {
        return appointmentService.getDoctorAppointments(userId);
    }
}