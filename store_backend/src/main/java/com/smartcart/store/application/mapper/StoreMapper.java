package com.smartcart.store.application.mapper;

import com.smartcart.store.application.dto.store.CreateStoreRequest;
import com.smartcart.store.application.dto.store.StoreResponse;
import com.smartcart.store.application.dto.store.UpdateStoreRequest;
import com.smartcart.store.domain.model.Store;
import org.springframework.stereotype.Component;

@Component
public class StoreMapper {

    public StoreResponse toResponse(Store store) {
        if (store == null) return null;

        StoreResponse response = new StoreResponse();
        response.setCode(store.getCode()); 
        response.setName(store.getName());
        response.setAddress(store.getAddress());
        response.setType(store.getType());
        return response;
    }

    public Store toEntity(CreateStoreRequest request) {
        if (request == null) return null;

        return Store.builder()
                .code(request.getCode()) 
                .name(request.getName())
                .address(request.getAddress())
                .type(request.getType())
                .build();
    }

    public void updateEntityFromDto(UpdateStoreRequest request, Store store) {
        if (request == null || store == null) return;

        if (request.getName() != null) store.setName(request.getName());
        if (request.getAddress() != null) store.setAddress(request.getAddress());
        if (request.getType() != null) store.setType(request.getType());
    }
}