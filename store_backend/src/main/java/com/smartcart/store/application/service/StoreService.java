package com.smartcart.store.application.service;

import com.smartcart.store.application.dto.store.CreateStoreRequest;
import com.smartcart.store.application.dto.store.StoreResponse;
import com.smartcart.store.application.dto.store.UpdateStoreRequest;
import com.smartcart.store.application.mapper.StoreMapper;
import com.smartcart.store.domain.model.Store;
import com.smartcart.store.repository.StoreRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;
    private final StoreMapper storeMapper;

    @Transactional
    public StoreResponse createStore(CreateStoreRequest request) {
        
        if (storeRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("Store with code " + request.getCode() + " already exists.");
        }
        
        Store store = storeMapper.toEntity(request);
        Store savedStore = storeRepository.save(store);
        return storeMapper.toResponse(savedStore);
    }

    @Transactional(readOnly = true)
    public List<StoreResponse> getAllStores() {
        return storeRepository.findAll().stream()
                .map(storeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StoreResponse getStore(String code) { 
        Store store = storeRepository.findByCode(code)
                .orElseThrow(() -> new EntityNotFoundException("Store not found with code: " + code));
        return storeMapper.toResponse(store);
    }

    @Transactional
    public StoreResponse updateStore(String code, UpdateStoreRequest request) { 
        Store store = storeRepository.findByCode(code)
                .orElseThrow(() -> new EntityNotFoundException("Store not found with code: " + code));
        
        storeMapper.updateEntityFromDto(request, store);
        return storeMapper.toResponse(storeRepository.save(store));
    }

    @Transactional
    public void deleteStore(String code) { 
        Store store = storeRepository.findByCode(code)
                .orElseThrow(() -> new EntityNotFoundException("Store not found with code: " + code));
        storeRepository.delete(store);
    }
}