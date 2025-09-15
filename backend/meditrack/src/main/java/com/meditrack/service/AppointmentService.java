
package com.meditrack.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.meditrack.entity.Appointment;
import com.meditrack.entity.Doctor;
import com.meditrack.entity.Patient;
import com.meditrack.repository.AppointmentRepository;
import com.meditrack.repository.DoctorRepository;
import com.meditrack.repository.PatientRepository;
import com.meditrack.repository.UserRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    // Patient requests appointment by specialization
    public Appointment requestAppointment(Long userId, String specialization, String symptoms, LocalDateTime time) {
        Patient patient = patientRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        List<Doctor> doctors = doctorRepository.findBySpecializationAndUser_VerifiedTrue(specialization);

        if (doctors.isEmpty()) {
            throw new RuntimeException("No verified doctors available in this specialization");
        }

        // Save as pending appointment (doctor will pick)
        Appointment appointment = Appointment.builder()
                .patient(patient)
                .specialization(specialization)
                .symptoms(symptoms)
                .appointmentTime(time)
                .status("PENDING")
                .build();

        return appointmentRepository.save(appointment);
    }

    // Doctor accepts appointment
    public Appointment acceptAppointment(Long userId, Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Doctor doctor = doctorRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Prevent double booking (30 min overlap check)
        LocalDateTime start = appointment.getAppointmentTime();
        LocalDateTime end = start.plusMinutes(30);

        boolean overlap = appointmentRepository.existsByDoctor_IdAndAppointmentTimeBetween(doctor.getId(), start, end);
        if (overlap) {
            throw new RuntimeException("Doctor already has an appointment during this time");
        }

        appointment.setDoctor(doctor);
        appointment.setStatus("ACCEPTED");

        return appointmentRepository.save(appointment);
    }

    // Doctor rejects appointment
    public Appointment rejectAppointment(Long userId, Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Doctor doctor = doctorRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (appointment.getDoctor() != null && appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new RuntimeException("You cannot reject an already accepted appointment");
        }

        // If one doctor rejects, it remains pending until all reject
        appointment.setStatus("PENDING");
        return appointmentRepository.save(appointment);
    }

    // Mark appointment as completed (after consultation)
    public Appointment completeAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!"ACCEPTED".equals(appointment.getStatus())) {
            throw new RuntimeException("Only accepted appointments can be completed");
        }

        appointment.setStatus("COMPLETED");
        return appointmentRepository.save(appointment);
    }

    // Get appointments for patient
    public List<Appointment> getPatientAppointments(Long userId) {
        return appointmentRepository.findAll().stream()
                .filter(a -> a.getPatient().getUser().getId().equals(userId))
                .toList();
    }

    // Get appointments for patient with doctor name and formatted date/time
    public List<com.meditrack.payload.AppointmentResponse> getPatientAppointmentsWithDetails(Long userId) {
        return appointmentRepository.findAll().stream()
                .filter(a -> a.getPatient().getUser().getId().equals(userId))
                .map(a -> com.meditrack.payload.AppointmentResponse.builder()
                        .id(a.getId())
                        .doctorName(a.getDoctor() != null && a.getDoctor().getUser() != null ? a.getDoctor().getUser().getUsername() : "N/A")
                        .dateTime(a.getAppointmentTime() != null ? a.getAppointmentTime().toString() : "N/A")
                        .status(a.getStatus())
                        .symptoms(a.getSymptoms())
                        .build())
                .toList();
    }

    // Get appointments for patient by patient id with doctor name and formatted date/time
    public List<com.meditrack.payload.AppointmentResponse> getPatientAppointmentsWithDetailsByPatientId(Long patientId) {
        return appointmentRepository.findByPatient_Id(patientId).stream()
                .map(a -> com.meditrack.payload.AppointmentResponse.builder()
                        .id(a.getId())
                        .doctorName(a.getDoctor() != null && a.getDoctor().getUser() != null ? a.getDoctor().getUser().getUsername() : a.getSpecialization() != null ? "Requested: " + a.getSpecialization() : "N/A")
                        .dateTime(a.getAppointmentTime() != null ? a.getAppointmentTime().toString() : "N/A")
                        .status(a.getStatus())
                        .symptoms(a.getSymptoms())
                        .build())
                .toList();
    }

    // Get appointments for doctor
    public List<Appointment> getDoctorAppointments(Long userId) {
        Doctor doctor = doctorRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return appointmentRepository.findByDoctor_Id(doctor.getId());
    }
}

