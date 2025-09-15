package com.meditrack.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.meditrack.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {

	Optional<Patient> findByUser_Id(Long userId); 
}
