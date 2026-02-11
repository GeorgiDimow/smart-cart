package com.smartcart.store.application.dto.product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern; // Import this!
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateProductRequest {
    
    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "SKU is required")
    @Pattern(regexp = "^[A-Z]+-[A-Z0-9]+$", message = "SKU must follow format ABBREVIATION-BARCODE (e.g., APP-001)")
    private String sku;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be greater than 0")
    private BigDecimal price;
    
    private String imageUrl;
}