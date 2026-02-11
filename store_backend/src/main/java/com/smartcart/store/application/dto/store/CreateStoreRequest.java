package com.smartcart.store.application.dto.store;

import com.smartcart.store.domain.model.Store.StoreType; 
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateStoreRequest {

    @NotBlank(message = "Store name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Type is required (RETAIL_STORE or WAREHOUSE)")
    private StoreType type;
}