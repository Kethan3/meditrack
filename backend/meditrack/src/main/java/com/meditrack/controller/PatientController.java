
package com.meditrack.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.meditrack.entity.Appointment;
import com.meditrack.entity.Patient;
import com.meditrack.payload.AppointmentResponse;
import com.meditrack.repository.PatientRepository;
import com.meditrack.service.AppointmentService;
import com.meditrack.service.PatientService;

@RestController
@CrossOrigin({"*"})
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PatientService patientService;

    // Patient Profile
    @GetMapping("/{id}/profile")
    @PreAuthorize("hasRole('PATIENT')")
    public Patient getProfile(@PathVariable Long id) {
        return patientService.getPatientProfile(id);
    }

    // Patient Appointments
    @GetMapping("/{id}/appointments")
    @PreAuthorize("hasRole('PATIENT')")
    public List<AppointmentResponse> getAppointments(@PathVariable Long id) {
        Patient patient = patientService.getPatientProfile(id);
        return appointmentService.getPatientAppointmentsWithDetailsByPatientId(patient.getId());
    }
    
    
    
    
    
}

