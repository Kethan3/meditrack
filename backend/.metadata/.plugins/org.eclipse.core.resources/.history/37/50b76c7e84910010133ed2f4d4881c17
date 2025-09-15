package com.meditrack.entity;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter  
@Setter
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
@Table(name="appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String symptoms;
    private String status; // PENDING, ACCEPTED, REJECTED, COMPLETED
    private String specialization; // added field

    private LocalDateTime appointmentTime; // consistent naming
     
    @ManyToOne
    private Doctor doctor;

    @ManyToOne
    private Patient patient;
}
