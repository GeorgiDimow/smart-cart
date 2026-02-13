package com.smartcart.store.web;

import com.smartcart.store.application.dto.inventory.InventoryResponse;
import com.smartcart.store.application.dto.inventory.StockUpdateRequest;
import com.smartcart.store.application.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @PostMapping("/stock")
    public ResponseEntity<InventoryResponse> updateStock(@Valid @RequestBody StockUpdateRequest request) {
        return ResponseEntity.ok(inventoryService.updateStock(request));
    }
}