package com.buytheway.modules.order.service;

import com.buytheway.modules.order.dto.OrderDTO;
import com.buytheway.modules.order.entity.Order;
import com.buytheway.modules.order.entity.OrderStatus;
import com.buytheway.modules.order.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order createOrder(OrderDTO dto) {

        if (dto.getProductId() == null)
            throw new RuntimeException("Product ID is required");

        if (dto.getUserId() == null)
            throw new RuntimeException("User ID is required");

        if (dto.getQuantity() <= 0)
            throw new RuntimeException("Quantity must be > 0");

        // ⚠️ TEMPORARY LOGIC (until Product module is ready)
        double dummyPrice = 500;  // replace later

        double totalPrice = dummyPrice * dto.getQuantity();

        Order order = new Order();
        order.setProductId(dto.getProductId());
        order.setUserId(dto.getUserId());
        order.setQuantity(dto.getQuantity());
        order.setTotalPrice(totalPrice);

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    public Order updateStatus(Long id, String status) {

        OrderStatus newStatus;

        try {
            newStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Invalid status");
        }

        Order order = getOrderById(id);
        order.setStatus(newStatus);

        return orderRepository.save(order);
    }

    public Order cancelOrder(Long id) {

        Order order = getOrderById(id);

        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot cancel delivered order");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }
}