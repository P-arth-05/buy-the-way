package com.buytheway.modules.cart.service;

import com.buytheway.modules.cart.entity.CartItem;
import com.buytheway.modules.cart.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;

    public List<CartItem> getCart(UUID userId) {
        return cartRepository.findByUserId(userId);
    }

    public void addToCart(UUID userId, Long productId, String productName, int quantity) {
        var existing = cartRepository.findByUserIdAndProductId(userId, productId);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartRepository.save(item);
        } else {
            CartItem item = CartItem.builder()
                    .userId(userId)
                    .productId(productId)
                    .productName(productName)
                    .quantity(quantity)
                    .build();
            cartRepository.save(item);
        }
    }

    public void updateQuantity(UUID userId, Long productId, int quantity) {
        if (quantity <= 0) {
            cartRepository.deleteByUserIdAndProductId(userId, productId);
            return;
        }
        var item = cartRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow();
        item.setQuantity(quantity);
        cartRepository.save(item);
    }

    @Transactional
    public void removeItem(UUID userId, Long productId) {
        CartItem item = cartRepository
        .findByUserIdAndProductId(userId, productId)
        .orElseThrow(() -> new RuntimeException("Item not found"));
        cartRepository.delete(item);
    }

    public void clearCart(UUID userId) {
        var items = cartRepository.findByUserId(userId);
        cartRepository.deleteAll(items);
    }
}