
package com.meditrack.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class SymptomAdvisorService {

    private static final Map<String, String> symptomToSpecialization = new HashMap<>();

    static {
        // Basic symptom → specialization rules
        symptomToSpecialization.put("fever", "General Medicine");
        symptomToSpecialization.put("cough", "Pulmonology");
        symptomToSpecialization.put("chest pain", "Cardiology");
        symptomToSpecialization.put("skin rash", "Dermatology");
        symptomToSpecialization.put("stomach pain", "Gastroenterology");
        symptomToSpecialization.put("joint pain", "Orthopedics");
        symptomToSpecialization.put("headache", "Neurology");
    }

    public String suggestSpecialization(String symptoms) {
        // Simple rule-based matching (expandable)
        for (Map.Entry<String, String> entry : symptomToSpecialization.entrySet()) {
            if (symptoms.toLowerCase().contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        return "General Medicine"; // default fallback
    }
}

