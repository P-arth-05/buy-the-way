package com.buytheway.modules.discount.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buytheway.common.response.ApiResponse;
import com.buytheway.modules.discount.dto.DiscountDTO;
import com.buytheway.modules.discount.service.DiscountService;

@RestController
@RequestMapping("/api/discounts")
public class DiscountController {

    private final DiscountService discountService;

    public DiscountController(DiscountService discountService) {
        this.discountService = discountService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DiscountDTO>>> getAllDiscounts() {
        return ResponseEntity.ok(
                new ApiResponse<>("Discounts fetched successfully", discountService.getAllDiscounts())
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DiscountDTO>> createDiscount(@RequestBody DiscountDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>("Promo code created successfully", discountService.createDiscount(dto))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDiscount(@PathVariable Long id) {
        discountService.deleteDiscount(id);
        return ResponseEntity.ok(new ApiResponse<>("Promo code deleted successfully", null));
    }
}
