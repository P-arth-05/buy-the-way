package com.buytheway.modules.order.dto;

import com.buytheway.modules.order.entity.Order;
import com.buytheway.modules.order.entity.OrderStatus;
import com.buytheway.modules.product.dto.ProductDTO;

import java.time.LocalDateTime;

public class OrderResponseDTO {

    private Long id;
    private Long productId;
    private String userId;

    private int quantity;
    private double totalPrice;
    private OrderStatus status;
    private LocalDateTime createdAt;

   
    private String productName;
    private String productDescription;
    private String productImage;

    public OrderResponseDTO(Order order, ProductDTO product) {
        this.id = order.getId();
        this.productId = order.getProductId();
        this.userId = order.getUserId();
        this.quantity = order.getQuantity();
        this.totalPrice = order.getTotalPrice();
        this.status = order.getStatus();
        this.createdAt = order.getCreatedAt();

        
        this.productName = product.getName();
        this.productDescription = product.getDescription();
        this.productImage = product.getImage();
    }

    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public String getUserId() { return userId; }
    public int getQuantity() { return quantity; }
    public double getTotalPrice() { return totalPrice; }
    public OrderStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public String getProductName() { return productName; }
    public String getProductDescription() { return productDescription; }
    public String getProductImage() { return productImage; }
}