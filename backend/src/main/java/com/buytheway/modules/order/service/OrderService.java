package com.buytheway.modules.order.service;

import com.buytheway.modules.order.dto.OrderDTO;
import com.buytheway.modules.order.dto.OrderResponseDTO;
import com.buytheway.modules.order.entity.Order;
import com.buytheway.modules.order.entity.OrderStatus;
import com.buytheway.modules.order.repository.OrderRepository;
import com.buytheway.modules.product.dto.ProductDTO;
import com.buytheway.modules.product.service.ProductService;
import com.buytheway.common.exception.BadRequestException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;

    public OrderService(OrderRepository orderRepository,
                        ProductService productService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
    }

    /* ------------------ CREATE ORDER ------------------ */
    @Transactional
    public Order createOrder(OrderDTO dto, String userId) {

        if (dto.getProductId() == null)
            throw new BadRequestException("Product ID required");

        if (dto.getQuantity() <= 0)
            throw new BadRequestException("Quantity must be > 0");

        ProductDTO product = productService.getProductById(dto.getProductId())
                .orElseThrow(() -> new BadRequestException("Product not found"));

        if (!product.getStatus().equalsIgnoreCase("approved")) {
            throw new BadRequestException("Product not available");
        }

        if (product.getStock() < dto.getQuantity()) {
            throw new BadRequestException("Insufficient stock");
        }

        double totalPrice = product.getPrice().doubleValue() * dto.getQuantity();

        Order order = new Order();
        order.setProductId(dto.getProductId());
        order.setUserId(userId);
        order.setQuantity(dto.getQuantity());
        order.setTotalPrice(totalPrice);
        order.setEmail(dto.getEmail());
        order.setStatus(OrderStatus.CREATED);

        Order savedOrder = orderRepository.save(order);

        // update stock
        product.setStock(product.getStock() - dto.getQuantity());
        productService.updateProduct(product.getId(), product);

        return savedOrder;
    }

    /* ------------------ GET ORDERS (FIXED) ------------------ */
    public List<OrderResponseDTO> getOrdersByUser(String userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return orders.stream()
                .map(order -> {
                    var product = getProduct(order.getProductId());
                    return new OrderResponseDTO(order, product);
                })
                .toList();
    }

    /* ------------------ GET PRODUCT ------------------ */
    public ProductDTO getProduct(Long productId) {
        return productService.getProductById(productId)
                .orElseThrow(() -> new BadRequestException("Product not found"));
    }

    /* ------------------ GET ORDER ------------------ */
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Order not found"));
    }

    /* ------------------ CANCEL ORDER ------------------ */
    public Order cancelOrder(Long id) {

        Order order = getOrderById(id);

        if (order.getStatus() == OrderStatus.SHIPPED ||
            order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel after shipping");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    /* ------------------ UPDATE STATUS ------------------ */
    public Order updateStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        return orderRepository.save(order);
    }
}