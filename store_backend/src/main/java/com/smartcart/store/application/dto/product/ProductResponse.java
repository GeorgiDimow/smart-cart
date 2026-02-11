package com.smartcart.store.application.dto.product;

import com.smartcart.store.domain.model.Product;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductResponse {
    private String name;
    private String sku;
    private BigDecimal price;
    private String imageUrl;
}