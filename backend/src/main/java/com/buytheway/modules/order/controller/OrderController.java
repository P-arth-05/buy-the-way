package com.buytheway.modules.order.controller;

import com.buytheway.common.response.ApiResponse;
import com.buytheway.modules.order.dto.OrderDTO;
import com.buytheway.modules.order.entity.Order;
import com.buytheway.modules.order.entity.OrderStatus;
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
        return new ApiResponse<>("Order created successfully",
                orderService.createOrder(dto));
    }

    @GetMapping
    public ApiResponse<List<Order>> getAllOrders() {
        return new ApiResponse<>("All orders",
                orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ApiResponse<Order> getOrder(@PathVariable Long id) {
        return new ApiResponse<>("Order fetched",
                orderService.getOrderById(id));
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<Order>> getUserOrders(@PathVariable Long userId) {
        return new ApiResponse<>("User orders",
                orderService.getOrdersByUser(userId));
    }

    @GetMapping("/status/{status}")
    public ApiResponse<List<Order>> getByStatus(@PathVariable String status) {
        return new ApiResponse<>("Orders by status",
                orderService.getOrdersByStatus(
                        OrderStatus.valueOf(status.toUpperCase())));
    }

    @PutMapping("/{id}/status")
    public ApiResponse<Order> updateStatus(@PathVariable Long id,
                                           @RequestParam String status) {
        return new ApiResponse<>("Status updated",
                orderService.updateStatus(id, status));
    }

    @PutMapping("/{id}/cancel")
    public ApiResponse<Order> cancelOrder(@PathVariable Long id) {
        return new ApiResponse<>("Order cancelled",
                orderService.cancelOrder(id));
    }
}