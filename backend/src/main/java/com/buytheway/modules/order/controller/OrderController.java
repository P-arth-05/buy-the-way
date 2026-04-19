package com.buytheway.modules.order.controller;

import java.util.Base64;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.buytheway.common.response.ApiResponse;
import com.buytheway.modules.notification.EmailService;
import com.buytheway.modules.order.dto.OrderDTO;
import com.buytheway.modules.order.dto.OrderReportDTO;
import com.buytheway.modules.order.dto.OrderResponseDTO;
import com.buytheway.modules.order.entity.Order;
import com.buytheway.modules.order.entity.OrderStatus;
import com.buytheway.modules.order.service.OrderService;

import jakarta.validation.Valid;

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

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<List<OrderReportDTO>>> getOrderReportData() {
        return ResponseEntity.ok(
                new ApiResponse<>("Order report data fetched successfully", orderService.getOrderReportData())
        );
    }

    @GetMapping("/user")
    public ResponseEntity<List<OrderResponseDTO>> getMyOrders(
            @RequestHeader("Authorization") String authHeader
    ) {
        String userId = extractUserId(authHeader);
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

        @GetMapping("/vendor/{vendorName}")
        public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getOrdersByVendor(
            @PathVariable String vendorName
        ) {
        return ResponseEntity.ok(
            new ApiResponse<>("Vendor orders fetched successfully", orderService.getOrdersByVendor(vendorName))
        );
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