package com.smartcart.store.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
public class TestController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/")
    public String home() {
        return "Java Store Backend is running!";
    }

    @GetMapping("/test-ai")
    public Map<String, Object> testAi() {
        // "ai-service" matches the service name we will define in docker-compose
        String aiUrl = "http://ai-service:5000/predict";
        
        // Call the Python AI Service
        // We use Map.class to quickly parse the JSON without creating a dedicated class yet
        Map response = restTemplate.getForObject(aiUrl, Map.class);
        
        return Map.of(
            "backend_message", "Java talked to Python AI!",
            "ai_data", response
        );
    }
}