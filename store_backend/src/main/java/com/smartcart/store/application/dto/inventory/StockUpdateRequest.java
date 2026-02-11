package com.smartcart.store.application.dto.inventory;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StockUpdateRequest {
    @NotBlank(message = "Store code is required")
    private String storeCode;

    @NotBlank(message = "Product SKU is required")
    private String productSku;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;
}