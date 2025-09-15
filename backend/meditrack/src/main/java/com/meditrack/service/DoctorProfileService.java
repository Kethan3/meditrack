package com.meditrack.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.meditrack.entity.Appointment;
import com.meditrack.repository.AppointmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoctorProfileService {

    private final AppointmentRepository appointmentRepository;

    public List<Appointment> getTodayAppointments(Long doctorId) {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);

        return appointmentRepository.findByDoctorUserId(doctorId).stream()
                .filter(a -> a.getAppointmentTime().isAfter(startOfDay) &&
                             a.getAppointmentTime().isBefore(endOfDay))
                .toList();
    }

    public List<Appointment> getPreviousAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorUserId(doctorId).stream()
                .filter(a -> a.getAppointmentTime().isBefore(LocalDateTime.now()) ||
                             "COMPLETED".equalsIgnoreCase(a.getStatus()))
                .toList();
    }
}
