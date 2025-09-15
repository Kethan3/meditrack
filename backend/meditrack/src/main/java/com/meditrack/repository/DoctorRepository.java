
package com.meditrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.meditrack.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecializationAndUser_VerifiedTrue(String specialization);
    Optional<Doctor> findByUser_Id(Long userId);

    @Query("SELECT DISTINCT d.specialization FROM Doctor d")
    List<String> findDistinctSpecializations();
}
