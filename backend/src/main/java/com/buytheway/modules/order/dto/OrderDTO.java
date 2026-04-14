package com.buytheway.modules.order.dto;

public class OrderDTO {

    private Long productId;
    private int quantity;
    

    // ✅ NEW FIELD
    private String email;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    // ✅ NEW GETTER/SETTER
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}