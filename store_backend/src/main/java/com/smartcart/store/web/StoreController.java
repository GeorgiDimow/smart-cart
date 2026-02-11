package com.smartcart.store.web;

import com.smartcart.store.application.dto.store.CreateStoreRequest;
import com.smartcart.store.application.dto.store.StoreResponse;
import com.smartcart.store.application.dto.store.UpdateStoreRequest;
import com.smartcart.store.application.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StoreController {

    private final StoreService storeService;

    @PostMapping
    public ResponseEntity<StoreResponse> createStore(@Valid @RequestBody CreateStoreRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(storeService.createStore(request));
    }

    @GetMapping
    public ResponseEntity<List<StoreResponse>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @GetMapping("/{code}")
    public ResponseEntity<StoreResponse> getStore(@PathVariable String code) {
        return ResponseEntity.ok(storeService.getStore(code));
    }

    @PutMapping("/{code}")
    public ResponseEntity<StoreResponse> updateStore(
            @PathVariable String code, 
            @Valid @RequestBody UpdateStoreRequest request) {
        return ResponseEntity.ok(storeService.updateStore(code, request));
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteStore(@PathVariable String code) {
        storeService.deleteStore(code);
        return ResponseEntity.noContent().build();
    }
}