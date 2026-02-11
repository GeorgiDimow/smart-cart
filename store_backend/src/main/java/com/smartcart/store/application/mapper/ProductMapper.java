package com.smartcart.store.application.mapper;

import com.smartcart.store.application.dto.product.CreateProductRequest;
import com.smartcart.store.application.dto.product.ProductResponse;
import com.smartcart.store.application.dto.product.UpdateProductRequest;
import com.smartcart.store.domain.model.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
        if (product == null) {
            return null;
        }
        
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setSku(product.getSku());
        response.setPrice(product.getPrice());
        response.setImageUrl(product.getImageUrl());
        return response;
    }

    public Product toEntity(CreateProductRequest request) {
        if (request == null) {
            return null;
        }

        return Product.builder()
                .name(request.getName())
                .sku(request.getSku())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .build();
    }

    public void updateEntityFromDto(UpdateProductRequest request, Product product) {
        if (request == null || product == null) {
            return;
        }
        
        if (request.getName() != null) {
            product.setName(request.getName());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }
    }
}