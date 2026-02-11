package com.smartcart.store.application.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class UpdateProductRequest {
    
    private String name;

    @Min(value = 0, message = "Price must be greater than 0")
    private BigDecimal price;
    
    private String imageUrl;
}