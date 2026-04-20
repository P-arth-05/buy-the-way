package com.buytheway.modules.cart.controller;

import com.buytheway.modules.cart.entity.CartItem;
import com.buytheway.modules.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8081"})
public class CartController {

    private final CartService cartService;

    // ✅ GET CART
    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(@RequestParam UUID userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    // ✅ ADD TO CART
    @PostMapping
    public ResponseEntity<String> addToCart(
            @RequestParam UUID userId,
            @RequestParam Long productId,
            @RequestParam String productName,
            @RequestParam int quantity
    ) {
        cartService.addToCart(userId, productId, productName, quantity);
        return ResponseEntity.ok("Item added to cart");
    }

    // ✅ UPDATE QUANTITY
    @PutMapping
    public ResponseEntity<String> update(
            @RequestParam UUID userId,
            @RequestParam Long productId,
            @RequestParam int quantity
    ) {
        cartService.updateQuantity(userId, productId, quantity);
        return ResponseEntity.ok("Quantity updated");
    }

    // ✅ REMOVE SINGLE ITEM
    @DeleteMapping
    public ResponseEntity<String> remove(
            @RequestParam UUID userId,
            @RequestParam Long productId
    ) {
        cartService.removeItem(userId, productId);
        return ResponseEntity.ok("Item removed");
    }

    // ✅ CLEAR CART
    @DeleteMapping("/clear")
    public ResponseEntity<String> clear(@RequestParam UUID userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared");
    }
}