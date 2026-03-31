package com.buytheway.modules.order.service;

import com.buytheway.modules.order.dto.OrderDTO;
import com.buytheway.modules.order.entity.Order;
import com.buytheway.modules.order.repository.OrderRepository;
import org.springframework.stereotype.Service;
import com.buytheway.modules.order.entity.OrderStatus;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order createOrder(OrderDTO dto) {

        // ✅ Validation
        if (dto.getProductId() == null) {
            throw new RuntimeException("Product ID is required");
        }

        if (dto.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }

        if (dto.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        if (dto.getTotalPrice() <= 0) {
            throw new RuntimeException("Total price must be greater than 0");
        }

        // ✅ Mapping DTO → Entity
        Order order = new Order();
        order.setProductId(dto.getProductId());
        order.setUserId(dto.getUserId());
        order.setQuantity(dto.getQuantity());
        order.setTotalPrice(dto.getTotalPrice());

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order with ID " + id + " not found"));
    }

    public Order updateStatus(Long id, String status) {

    OrderStatus newStatus;

    try {
        newStatus = OrderStatus.valueOf(status.toUpperCase());
    } catch (Exception e) {
        throw new RuntimeException("Invalid status value. Allowed: CREATED, SHIPPED, DELIVERED, CANCELLED");
    }

    Order order = getOrderById(id);
    order.setStatus(newStatus);

    return orderRepository.save(order);
}
}