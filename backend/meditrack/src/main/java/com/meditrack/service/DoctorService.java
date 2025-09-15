package com.meditrack.service;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.meditrack.entity.Doctor;
import com.meditrack.repository.AppointmentRepository;
import com.meditrack.repository.DoctorRepository;
import com.meditrack.payload.UpdateDoctorDetailsRequest;

import org.springframework.stereotype.Service;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public Doctor getDoctorProfile(Long doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    public List<?> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctor_Id(doctorId);
    }

    public List<Doctor> findDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationAndUser_VerifiedTrue(specialization);
    }

    public Doctor updateDoctorDetails(Long userId, UpdateDoctorDetailsRequest request) {
        Doctor doctor = doctorRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setQualifications(request.getQualifications());
        doctor.setYearsOfExperience(request.getYearsOfExperience());
        doctor.setProfilePhoto(request.getProfilePhoto());
        doctor.setConsultationFees(request.getConsultationFees());
        doctor.setClinicAddress(request.getClinicAddress());
        return doctorRepository.save(doctor);
    }

    public List<String> getSpecializations() {
        return doctorRepository.findDistinctSpecializations();
    }
}
