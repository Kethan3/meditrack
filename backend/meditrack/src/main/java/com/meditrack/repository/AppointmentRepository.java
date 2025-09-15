package com.meditrack.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.meditrack.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDoctor_Id(Long doctorId);
    List<Appointment> findByPatient_Id(Long patientId);

    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientUserId")
    List<Appointment> findByPatientUserId(@Param("patientUserId") Long patientUserId);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorUserId")
    List<Appointment> findByDoctorUserId(@Param("doctorUserId") Long doctorUserId);

    boolean existsByDoctor_IdAndAppointmentTimeBetween(Long doctorId, LocalDateTime start, LocalDateTime end);

    @Query("""
           SELECT CASE WHEN COUNT(a)>0 THEN true ELSE false END
           FROM Appointment a
           WHERE a.doctor.id = :doctorId
             AND a.status IN ('PENDING','ACCEPTED')
             AND a.appointmentTime < :end
             AND a.appointmentTime >= :start
           """)
    boolean hasOverlap(@Param("doctorId") Long doctorId,
                       @Param("start") LocalDateTime start,
                       @Param("end") LocalDateTime end);
}

