package com.smartcart.store.application.mapper;

import com.smartcart.store.application.dto.inventory.InventoryResponse;
import com.smartcart.store.domain.model.Inventory;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public InventoryResponse toResponse(Inventory inventory) {
        if (inventory == null) return null;

        InventoryResponse response = new InventoryResponse();
        response.setStoreCode(inventory.getStore().getCode());
        response.setStoreName(inventory.getStore().getName());
        response.setProductSku(inventory.getProduct().getSku());
        response.setProductName(inventory.getProduct().getName());
        response.setQuantity(inventory.getQuantity());
        return response;
    }
}