package com.smartcart.store.web;

import com.smartcart.store.application.service.OrderService;
import com.smartcart.store.domain.model.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout/{sessionId}")
    public ResponseEntity<Order> checkout(@PathVariable String sessionId) {
        return ResponseEntity.ok(orderService.checkout(sessionId));
    }
}