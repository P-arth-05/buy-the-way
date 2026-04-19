package com.buytheway.modules.order.service;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buytheway.common.exception.BadRequestException;
import com.buytheway.modules.order.dto.OrderDTO;
import com.buytheway.modules.order.dto.OrderReportDTO;
import com.buytheway.modules.order.dto.OrderResponseDTO;
import com.buytheway.modules.order.entity.Order;
import com.buytheway.modules.order.entity.OrderStatus;
import com.buytheway.modules.order.repository.OrderRepository;
import com.buytheway.modules.product.dto.ProductDTO;
import com.buytheway.modules.product.service.ProductService;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;

    private static final int MAX_QTY = 5;

    public OrderService(OrderRepository orderRepository,
                        ProductService productService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
    }

    @Transactional
    public Order createOrder(OrderDTO dto, String userId) {

        if (dto.getProductId() == null)
            throw new BadRequestException("Product ID required");

        if (dto.getQuantity() <= 0)
            throw new BadRequestException("Quantity must be > 0");

        if (dto.getQuantity() > MAX_QTY)
            throw new BadRequestException("Max " + MAX_QTY + " items allowed");

        if (dto.getEmail() == null || dto.getEmail().isBlank())
            throw new BadRequestException("Email is required");

        ProductDTO product = productService.getProductById(dto.getProductId())
                .orElseThrow(() -> new BadRequestException("Product not found"));

        if (!product.getStatus().equalsIgnoreCase("approved"))
            throw new BadRequestException("Product not available");

        if (product.getStock() < dto.getQuantity())
            throw new BadRequestException("Insufficient stock");

        double totalPrice = product.getPrice().doubleValue() * dto.getQuantity();

        Order order = new Order();
        order.setProductId(dto.getProductId());
        order.setUserId(userId);
        order.setQuantity(dto.getQuantity());
        order.setTotalPrice(totalPrice);
        order.setStatus(OrderStatus.CREATED);

        order.setFullName(dto.getFullName());
        order.setAddress(dto.getAddress());
        order.setCity(dto.getCity());
        order.setPincode(dto.getPincode());
        order.setEmail(dto.getEmail());

        Order savedOrder = orderRepository.save(order);

        product.setStock(product.getStock() - dto.getQuantity());
        productService.updateProduct(product.getId(), product);

        return savedOrder;
    }

    public long getOrderCount() {
        return orderRepository.count();
    }

    public List<OrderResponseDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();

        return orders.stream()
                .map(order -> new OrderResponseDTO(order, getProduct(order.getProductId())))
                .toList();
    }

    public List<OrderReportDTO> getOrderReportData() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(OrderReportDTO::new)
                .toList();
    }

    public List<OrderResponseDTO> getOrdersByUser(String userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return orders.stream()
                .map(order -> new OrderResponseDTO(order, getProduct(order.getProductId())))
                .toList();
    }

    public List<OrderResponseDTO> getOrdersByVendor(String vendorName) {
        if (vendorName == null || vendorName.isBlank()) {
            throw new BadRequestException("Vendor name is required");
        }

        String normalizedVendorName = vendorName.trim().toLowerCase();

        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(order -> {
                    try {
                        ProductDTO product = getProduct(order.getProductId());
                        if (product.getVendor() == null ||
                                !product.getVendor().trim().toLowerCase().equals(normalizedVendorName)) {
                            return null;
                        }
                        return new OrderResponseDTO(order, product);
                    } catch (BadRequestException ex) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .toList();
    }

    public ProductDTO getProduct(Long productId) {
        return productService.getProductById(productId)
                .orElseThrow(() -> new BadRequestException("Product not found"));
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Order not found"));
    }

    public Order cancelOrder(Long id) {
        Order order = getOrderById(id);

        if (order.getStatus() == OrderStatus.SHIPPED ||
            order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel after shipping");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    // ✅ FIXED RETURN LOGIC
    public Order returnOrder(Long id) {
        Order order = getOrderById(id);

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new BadRequestException(
                "Return not allowed. Current status: " + order.getStatus()
            );
        }

        order.setStatus(OrderStatus.RETURNED);
        return orderRepository.save(order);
    }

    public Order updateStatus(Long id, OrderStatus status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}