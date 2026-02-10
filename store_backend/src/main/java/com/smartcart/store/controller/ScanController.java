package com.smartcart.store.controller;

import com.smartcart.store.dto.ScanRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ScanController {

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/scan")
    public Map<String, Object> scanItem(@RequestBody ScanRequest request) {
        String aiUrl = "http://localhost:5000/predict";
        
        return restTemplate.postForObject(aiUrl, request, Map.class);
    }
}