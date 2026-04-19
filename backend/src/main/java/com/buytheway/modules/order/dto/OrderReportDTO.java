package com.buytheway.modules.order.dto;

import java.time.LocalDateTime;

import com.buytheway.modules.order.entity.Order;

public class OrderReportDTO {

    private final LocalDateTime createdAt;
    private final double totalPrice;

    public OrderReportDTO(Order order) {
        this.createdAt = order.getCreatedAt();
        this.totalPrice = order.getTotalPrice();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public double getTotalPrice() {
        return totalPrice;
    }
}