package com.meditrack.payload;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateDoctorDetailsRequest {
    private String qualifications;
    private Integer yearsOfExperience;
    private String profilePhoto;
    private Double consultationFees;
    private String clinicAddress;
}