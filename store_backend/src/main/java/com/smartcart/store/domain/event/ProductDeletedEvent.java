package com.smartcart.store.domain.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProductDeletedEvent {
    private final String sku;
}