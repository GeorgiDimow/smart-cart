package com.smartcart.store.application.service;

import com.smartcart.store.application.dto.product.*;
import com.smartcart.store.application.mapper.ProductMapper;
import com.smartcart.store.domain.event.ProductDeletedEvent; // Import Event
import com.smartcart.store.domain.model.Product;
import com.smartcart.store.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher; // Import Publisher
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void deleteProduct(String sku) {
        if (!productRepository.existsBySku(sku)) {
            throw new EntityNotFoundException("Product not found with SKU: " + sku);
        }

        eventPublisher.publishEvent(new ProductDeletedEvent(sku));

        productRepository.deleteBySku(sku);
    }

    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {

        if (productRepository.existsBySku(request.getSku())) {
            throw new IllegalArgumentException("Product with SKU " + request.getSku() + " already exists.");
        }

        Product product = productMapper.toEntity(request);

        Product savedProduct = productRepository.save(product);

        return productMapper.toResponse(savedProduct);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                    .map(productMapper::toResponse)
                    .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with SKU: " + sku));
        return productMapper.toResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(String sku, UpdateProductRequest request) {
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with SKU: " + sku));
        productMapper.updateEntityFromDto(request, product);
        return productMapper.toResponse(productRepository.save(product));
    }
}