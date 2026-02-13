package com.smartcart.store.application.service;

import com.smartcart.store.application.dto.cart.CartItem;
import com.smartcart.store.application.dto.cart.CartSummary;
import com.smartcart.store.domain.model.Product;
import com.smartcart.store.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ProductRepository productRepository;

    private static final String CART_PREFIX = "cart:";
    private static final long CART_TTL_MINUTES = 60;

    public void addToCart(String sessionId, String sku, Integer quantity) {
        String key = CART_PREFIX + sessionId;

        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + sku));

        Map<String, CartItem> cart = getCartMap(key);

        CartItem item = cart.getOrDefault(sku, new CartItem(sku, product.getName(), 0, product.getPrice()));
        item.setQuantity(item.getQuantity() + quantity);

        if (item.getQuantity() <= 0) {
            cart.remove(sku);
        } else {
            cart.put(sku, item);
        }

        redisTemplate.opsForValue().set(key, cart, CART_TTL_MINUTES, TimeUnit.MINUTES);
    }

    public CartSummary getCart(String sessionId) {
        String key = CART_PREFIX + sessionId;
        Map<String, CartItem> cartMap = getCartMap(key);

        CartSummary summary = new CartSummary();
        summary.setSessionId(sessionId);
        summary.setItems(cartMap.values().stream().collect(Collectors.toList()));
        
        BigDecimal total = summary.getItems().stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        summary.setGrandTotal(total);

        return summary;
    }

    public void clearCart(String sessionId) {
        redisTemplate.delete(CART_PREFIX + sessionId);
    }

    @SuppressWarnings("unchecked")
    private Map<String, CartItem> getCartMap(String key) {
        Object obj = redisTemplate.opsForValue().get(key);
        if (obj instanceof Map) {
            return (Map<String, CartItem>) obj;
        }
        return new java.util.HashMap<>();
    }
}