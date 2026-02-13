package com.smartcart.store.web;

import com.smartcart.store.application.dto.cart.CartSummary;
import com.smartcart.store.application.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    @GetMapping("/{sessionId}")
    public ResponseEntity<CartSummary> getCart(@PathVariable String sessionId) {
        return ResponseEntity.ok(cartService.getCart(sessionId));
    }

    @PostMapping("/{sessionId}/add")
    public ResponseEntity<Void> addToCart(
            @PathVariable String sessionId,
            @RequestParam String sku,
            @RequestParam(defaultValue = "1") Integer qty) {
        
        cartService.addToCart(sessionId, sku, qty);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> clearCart(@PathVariable String sessionId) {
        cartService.clearCart(sessionId);
        return ResponseEntity.noContent().build();
    }
}