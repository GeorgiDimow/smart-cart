package com.smartcart.store.domain.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StoreDeletedEvent {
    private final String storeCode;
}