package com.buytheway.modules.order.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Base64;

import com.buytheway.modules.order.service.OrderService;
import com.buytheway.modules.notification.EmailService;
import com.buytheway.modules.order.dto.OrderDTO;
import com.buytheway.modules.order.dto.OrderResponseDTO;
import com.buytheway.modules.order.entity.Order;
import com.buytheway.modules.order.entity.OrderStatus;
import com.buytheway.common.response.ApiResponse;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:8081")
public class OrderController {

    private final OrderService orderService;
    private final EmailService emailService;

    public OrderController(OrderService orderService, EmailService emailService) {
        this.orderService = orderService;
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(
            @Valid @RequestBody OrderDTO dto,
            @RequestHeader("Authorization") String authHeader
    ) {
        String userId = extractUserId(authHeader);

        Order order = orderService.createOrder(dto, userId);
        var product = orderService.getProduct(order.getProductId());

        try {
            emailService.sendOrderConfirmation(
                    order.getEmail(),
                    order.getId(),
                    product.getName(),
                    order.getTotalPrice()
            );
        } catch (Exception e) {
            System.out.println("Email failed: " + e.getMessage());
        }

        return ResponseEntity.ok(new OrderResponseDTO(order, product));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getAllOrders() {
        return ResponseEntity.ok(
                new ApiResponse<>("Orders fetched successfully", orderService.getAllOrders())
        );
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> getOrderCount() {
        return ResponseEntity.ok(
                new ApiResponse<>("Order count fetched successfully", orderService.getOrderCount())
        );
    }

    @GetMapping("/user")
    public ResponseEntity<List<OrderResponseDTO>> getMyOrders(
            @RequestHeader("Authorization") String authHeader
    ) {
        String userId = extractUserId(authHeader);
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        var product = orderService.getProduct(order.getProductId());
        return ResponseEntity.ok(new OrderResponseDTO(order, product));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderResponseDTO> cancelOrder(@PathVariable Long id) {
        Order order = orderService.cancelOrder(id);
        var product = orderService.getProduct(order.getProductId());

        try {
            emailService.sendOrderStatusUpdate(
                    order.getEmail(),
                    order.getId(),
                    order.getStatus().name()
            );
        } catch (Exception e) {
            System.out.println("Email failed: " + e.getMessage());
        }

        return ResponseEntity.ok(new OrderResponseDTO(order, product));
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<OrderResponseDTO> returnOrder(@PathVariable Long id) {
        Order order = orderService.returnOrder(id);
        var product = orderService.getProduct(order.getProductId());

        try {
            emailService.sendOrderStatusUpdate(
                    order.getEmail(),
                    order.getId(),
                    order.getStatus().name()
            );
        } catch (Exception e) {
            System.out.println("Email failed: " + e.getMessage());
        }

        return ResponseEntity.ok(new OrderResponseDTO(order, product));
    }

    // ✅ FIXED (this was broken earlier)
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) {
        Order order = orderService.updateStatus(id, status);
        var product = orderService.getProduct(order.getProductId());

        return ResponseEntity.ok(new OrderResponseDTO(order, product));
    }

    private String extractUserId(String authHeader) {
        String token = authHeader.substring(7);
        String[] chunks = token.split("\\.");
        String payload = new String(Base64.getDecoder().decode(chunks[1]));
        return payload.split("\"sub\":\"")[1].split("\"")[0];
    }
}