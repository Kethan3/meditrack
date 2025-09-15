package com.meditrack.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.meditrack.entity.Appointment;
import com.meditrack.service.DoctorProfileService;



@RestController
@RequestMapping("/doctor")
public class DoctorProfileController {

    @Autowired
    private DoctorProfileService profileService;

    @GetMapping("/{doctorId}/today")
    public List<Appointment> getToday(@PathVariable Long doctorId) {
        return profileService.getTodayAppointments(doctorId);
    }

    @GetMapping("/{doctorId}/previous")
    public List<Appointment> getPrevious(@PathVariable Long doctorId) {
        return profileService.getPreviousAppointments(doctorId);
    }
}
