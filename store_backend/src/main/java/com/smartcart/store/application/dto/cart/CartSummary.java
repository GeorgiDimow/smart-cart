package com.smartcart.store.application.dto.cart;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class CartSummary implements Serializable {

    private static final long serialVersionUID = 1L;

    private String sessionId;

    private List<CartItem> items = new ArrayList<>();

    private BigDecimal grandTotal = BigDecimal.ZERO;
}