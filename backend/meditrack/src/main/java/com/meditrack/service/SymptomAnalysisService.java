
package com.meditrack.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class SymptomAnalysisService {

    @Value("${gemini.api.key}") // 👈 read API key from application.properties
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String analyzeSymptoms(String username, String symptoms) {
        try {
            // Gemini API endpoint
            String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                    + "gemini-2.0-flash:generateContent?key=" + apiKey;

            System.out.println("Gemini api key " + apiKey);

            // Request headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Request body (JSON)
            String requestBody = "{ \"contents\": [ { \"parts\": [ { \"text\": \""
                    + symptoms + "\" } ] } ] }";

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            // Send POST request
            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                // Gemini response JSON → extract text
                Map<String, Object> body = response.getBody();
                var candidates = (java.util.List<Map<String, Object>>) body.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    if (content != null) {
                        var parts = (java.util.List<Map<String, Object>>) content.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            return (String) parts.get(0).get("text");
                        }
                    }
                }
            }

            return "AI could not generate a response. Please try again.";

        } catch (Exception e) {
            e.printStackTrace();
            return "AI is currently experiencing issues. Please try again later.";
        }
    }
}

