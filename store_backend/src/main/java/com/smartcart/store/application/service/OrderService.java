package com.smartcart.store.application.service;

import com.smartcart.store.application.dto.cart.CartSummary;
import com.smartcart.store.application.dto.cart.CartItem;
import com.smartcart.store.domain.model.*;
import com.smartcart.store.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CartService cartService; 
    private final InventoryService inventoryService;
    private final OrderRepository orderRepository;

    @Transactional
    public Order checkout(String sessionId) {
        
        CartSummary cart = cartService.getCart(sessionId);
        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot checkout an empty cart");
        }

        Order order = Order.builder()
                .sessionId(sessionId)
                .totalAmount(cart.getGrandTotal())
                .status(OrderStatus.PENDING)
                .build();

        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productSku(cartItem.getSku())
                    .productName(cartItem.getProductName())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getUnitPrice())
                    .build();
            
            order.getItems().add(orderItem);

            inventoryService.reduceStock(cartItem.getSku(), cartItem.getQuantity());
        }

        order.setStatus(OrderStatus.COMPLETED);
        Order savedOrder = orderRepository.save(order);

        cartService.clearCart(sessionId);

        return savedOrder;
    }
}