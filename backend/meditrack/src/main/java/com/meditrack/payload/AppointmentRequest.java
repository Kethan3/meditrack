
package com.meditrack.payload;

public class AppointmentRequest {
    private Long userId;
    private String specialization;
    private String symptoms;
    private String time;

    // Default constructor
    public AppointmentRequest() {}

    // Constructor
    public AppointmentRequest(Long userId, String specialization, String symptoms, String time) {
        this.userId = userId;
        this.specialization = specialization;
        this.symptoms = symptoms;
        this.time = time;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }
}
