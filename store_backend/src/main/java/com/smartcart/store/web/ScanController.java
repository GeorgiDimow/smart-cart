package com.smartcart.store.web;

import com.smartcart.store.application.dto.ScanRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class ScanController {

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/scan")
    public Map<String, Object> scanItem(@RequestBody ScanRequest request) {
        String aiUrl = "http://ai-service:5000/predict";

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            aiUrl,
            HttpMethod.POST,
            new HttpEntity<>(request),
            new ParameterizedTypeReference<Map<String, Object>>() {} 
        );
        
        return response.getBody();
    }
}