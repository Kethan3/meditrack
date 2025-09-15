
package com.meditrack.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.meditrack.entity.Patient;
import com.meditrack.repository.AppointmentRepository;
import com.meditrack.repository.PatientRepository;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public Patient getPatientProfile(Long patientId) {
        return patientRepository.findByUser_Id(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public List<?> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatient_Id(patientId);
    }
}
