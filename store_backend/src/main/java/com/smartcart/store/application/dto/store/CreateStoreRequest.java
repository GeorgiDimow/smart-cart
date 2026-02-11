package com.smartcart.store.application.dto.store;

import com.smartcart.store.domain.model.Store.StoreType; 
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern; // Import this!
import lombok.Data;

@Data
public class CreateStoreRequest {

    @NotBlank(message = "Store code is required")
    @Pattern(regexp = "^[A-Z]+-[A-Za-z0-9]+-[A-Z0-9]+$", message = "Code must follow format CITY-NAME-CODE (e.g., NYC-WAREHOUSE-01)")
    private String code;

    @NotBlank(message = "Store name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Type is required (RETAIL_STORE or WAREHOUSE)")
    private StoreType type;
}