package com.smartcart.store.application.dto.store;

import com.smartcart.store.domain.model.Store.StoreType;
import lombok.Data;

@Data
public class StoreResponse {
    private Long id;
    private String name;
    private String address;
    private StoreType type;
}