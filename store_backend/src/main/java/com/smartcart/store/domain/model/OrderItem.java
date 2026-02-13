package com.smartcart.store.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "order_items")
@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "order")          
@EqualsAndHashCode(exclude = "order")   
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    private String productSku;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
}