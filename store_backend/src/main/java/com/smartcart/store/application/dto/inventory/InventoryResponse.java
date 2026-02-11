package com.smartcart.store.application.dto.inventory;

import lombok.Data;

@Data
public class InventoryResponse {
    private String storeCode;
    private String storeName;
    private String productSku;
    private String productName;
    private Integer quantity;
}