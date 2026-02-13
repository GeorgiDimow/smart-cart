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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final InventoryMapper inventoryMapper;

    @Transactional(readOnly = true)
    public List<InventoryResponse> getAllInventory() {
        return inventoryRepository.findAll().stream()
                .map(inventoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void reduceStock(String sku, Integer quantityRequired) {
        List<Inventory> inventories = inventoryRepository.findByProduct_Sku(sku);
        int remainingToDeduct = quantityRequired;

        for (Inventory inv : inventories) {
            if (remainingToDeduct <= 0) break;

            int available = inv.getQuantity();
            if (available > 0) {
                int toTake = Math.min(available, remainingToDeduct);
                inv.setQuantity(available - toTake);
                inventoryRepository.save(inv);
                remainingToDeduct -= toTake;
            }
        }

        if (remainingToDeduct > 0) {
            throw new IllegalStateException("Insufficient stock for Product: " + sku);
        }
    }

    @Transactional
    public InventoryResponse updateStock(StockUpdateRequest request) {
        Inventory inventory = inventoryRepository
                .findByStore_CodeAndProduct_Sku(request.getStoreCode(), request.getProductSku())
                .orElse(null);

        if (inventory == null) {
            Store store = storeRepository.findByCode(request.getStoreCode())
                    .orElseThrow(() -> new EntityNotFoundException("Store not found: " + request.getStoreCode()));

            Product product = productRepository.findBySku(request.getProductSku())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found: " + request.getProductSku()));

            inventory = Inventory.builder()
                    .store(store)
                    .product(product)
                    .quantity(0)
                    .build();
        }

        inventory.setQuantity(request.getQuantity());
        Inventory saved = inventoryRepository.save(inventory);
        return inventoryMapper.toResponse(saved);
    }

    @EventListener
    @Transactional
    public void handleProductDeletion(ProductDeletedEvent event) {
        inventoryRepository.deleteByProduct_Sku(event.getSku());
    }

    @EventListener
    @Transactional
    public void handleStoreDeletion(StoreDeletedEvent event) {
        inventoryRepository.deleteByStore_Code(event.getStoreCode());
    }
}