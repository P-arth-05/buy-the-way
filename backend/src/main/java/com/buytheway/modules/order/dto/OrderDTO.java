package com.buytheway.modules.order.dto;

public class OrderDTO {

    private Long productId;
    private Long userId;
    private int quantity;

    

    // getters & setters

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}