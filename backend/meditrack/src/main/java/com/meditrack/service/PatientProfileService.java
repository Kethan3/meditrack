
package com.meditrack.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.meditrack.entity.Appointment;
import com.meditrack.repository.AppointmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientProfileService {

    private final AppointmentRepository appointmentRepository;

    public List<Appointment> getUpcomingAppointments(Long patientId) {
        return appointmentRepository.findByPatient_Id(patientId).stream()
                .filter(a -> a.getAppointmentTime().isAfter(LocalDateTime.now()) &&
                             ("PENDING".equalsIgnoreCase(a.getStatus()) ||
                              "ACCEPTED".equalsIgnoreCase(a.getStatus())))
                .toList();
    }

    public List<Appointment> getPastAppointments(Long patientId) {
        return appointmentRepository.findByPatientUserId(patientId).stream()
                .filter(a -> a.getAppointmentTime().isBefore(LocalDateTime.now()) ||
                             "COMPLETED".equalsIgnoreCase(a.getStatus()))
                .toList();
    }
}
