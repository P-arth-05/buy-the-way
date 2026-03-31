package com.buytheway.modules.order.controller;

import com.buytheway.common.response.ApiResponse;
import com.buytheway.modules.order.dto.OrderDTO;
import com.buytheway.modules.order.entity.Order;
import com.buytheway.modules.order.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ApiResponse<Order> createOrder(@RequestBody OrderDTO dto) {
        return new ApiResponse<>("Order created successfully", orderService.createOrder(dto));
    }

    @GetMapping
    public ApiResponse<List<Order>> getAllOrders() {
        return new ApiResponse<>("Orders fetched successfully", orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ApiResponse<Order> getOrderById(@PathVariable Long id) {
        return new ApiResponse<>("Order fetched successfully", orderService.getOrderById(id));
    }

    // ✅ NEW API (important)
    @PutMapping("/{id}/status")
    public ApiResponse<Order> updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return new ApiResponse<>("Order status updated successfully",
                orderService.updateStatus(id, status));
    }
}