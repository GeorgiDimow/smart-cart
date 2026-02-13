package com.smartcart.store.repository;

import com.smartcart.store.domain.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByStore_CodeAndProduct_Sku(String storeCode, String productSku);

    List<Inventory> findByProduct_Sku(String sku);

    void deleteByStore_Code(String storeCode);

    void deleteByProduct_Sku(String productSku);
}