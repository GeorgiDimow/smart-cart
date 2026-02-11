package com.smartcart.store.application.service;

import com.smartcart.store.application.dto.inventory.InventoryResponse;
import com.smartcart.store.application.dto.inventory.StockUpdateRequest;
import com.smartcart.store.application.mapper.InventoryMapper;
import com.smartcart.store.domain.event.ProductDeletedEvent;
import com.smartcart.store.domain.event.StoreDeletedEvent;
import com.smartcart.store.domain.model.Inventory;
import com.smartcart.store.domain.model.Product;
import com.smartcart.store.domain.model.Store;
import com.smartcart.store.repository.InventoryRepository;
import com.smartcart.store.repository.ProductRepository;
import com.smartcart.store.repository.StoreRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final InventoryMapper inventoryMapper;

    @Transactional
    public InventoryResponse updateStock(StockUpdateRequest request) {
        // 1. Check if we already have stock for this specific Store + Product combo
        Inventory inventory = inventoryRepository
                .findByStore_CodeAndProduct_Sku(request.getStoreCode(), request.getProductSku())
                .orElse(null);

        if (inventory == null) {
            // 2. If not, we need to create a new link. 
            // Fetch the Store and Product by their Business Keys.
            Store store = storeRepository.findByCode(request.getStoreCode())
                    .orElseThrow(() -> new EntityNotFoundException("Store not found with code: " + request.getStoreCode()));

            Product product = productRepository.findBySku(request.getProductSku())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found with SKU: " + request.getProductSku()));

            inventory = Inventory.builder()
                    .store(store)
                    .product(product)
                    .quantity(0) // Start with 0 before updating
                    .build();
        }

        // 3. Update the quantity (whether new or existing)
        inventory.setQuantity(request.getQuantity());

        // 4. Save and return
        Inventory saved = inventoryRepository.save(inventory);
        return inventoryMapper.toResponse(saved);
    }

    @EventListener
    @Transactional // Join the existing transaction
    public void handleProductDeletion(ProductDeletedEvent event) {
        inventoryRepository.deleteByProduct_Sku(event.getSku());
    }


    @EventListener
    @Transactional
    public void handleStoreDeletion(StoreDeletedEvent event) {
        inventoryRepository.deleteByStore_Code(event.getStoreCode());
    }
}