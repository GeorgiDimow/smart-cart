package com.smartcart.store.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; 

    @Column(nullable = false)
    private String address;
    
    @Enumerated(EnumType.STRING)
    private StoreType type; 

    public enum StoreType {
        RETAIL_STORE,
        WAREHOUSE
    }
}