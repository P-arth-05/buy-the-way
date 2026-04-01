package com.buytheway.modules.product.controller;

import com.buytheway.modules.product.dto.ProductDTO;
import com.buytheway.modules.product.entity.Product;
import com.buytheway.modules.product.service.ProductService;
import com.buytheway.common.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * Get all products
     * GET /api/products
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(
                new ApiResponse<>("Products retrieved successfully", products)
        );
    }

    /**
     * Get all approved products
     * GET /api/products/approved
     */
    @GetMapping("/approved")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getApprovedProducts() {
        List<ProductDTO> products = productService.getApprovedProducts();
        return ResponseEntity.ok(
                new ApiResponse<>("Approved products retrieved successfully", products)
        );
    }

    /**
     * Get product by ID
     * GET /api/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductById(@PathVariable Long id) {
        Optional<ProductDTO> product = productService.getProductById(id);
        if (product.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>("Product not found", null)
            );
        }
        return ResponseEntity.ok(
                new ApiResponse<>("Product retrieved successfully", product.get())
        );
    }

    /**
     * Get products by category
     * GET /api/products/category/{category}
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getProductsByCategory(@PathVariable String category) {
        List<ProductDTO> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(
                new ApiResponse<>("Products by category retrieved successfully", products)
        );
    }

    /**
     * Get products by vendor
     * GET /api/products/vendor/{vendor}
     */
    @GetMapping("/vendor/{vendor}")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getProductsByVendor(@PathVariable String vendor) {
        List<ProductDTO> products = productService.getProductsByVendor(vendor);
        return ResponseEntity.ok(
                new ApiResponse<>("Products by vendor retrieved successfully", products)
        );
    }

    /**
     * Search products by keyword
     * GET /api/products/search?keyword={keyword}
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> searchProducts(@RequestParam String keyword) {
        List<ProductDTO> products = productService.searchProducts(keyword);
        return ResponseEntity.ok(
                new ApiResponse<>("Search results retrieved successfully", products)
        );
    }

    /**
     * Create a new product
     * POST /api/products
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        Product createdProduct = productService.createProduct(productDTO);
        ProductDTO responseDTO = new ProductDTO();
        responseDTO.setId(createdProduct.getId());
        responseDTO.setName(createdProduct.getName());
        responseDTO.setPrice(createdProduct.getPrice());
        responseDTO.setImage(createdProduct.getImage());
        responseDTO.setCategory(createdProduct.getCategory());
        responseDTO.setDescription(createdProduct.getDescription());
        responseDTO.setStock(createdProduct.getStock());
        responseDTO.setStatus(createdProduct.getStatus().name().toLowerCase());
        responseDTO.setVendor(createdProduct.getVendor());
        responseDTO.setRating(createdProduct.getRating());
        responseDTO.setReviews(createdProduct.getReviews());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>("Product created successfully", responseDTO)
        );
    }

    /**
     * Update an existing product
     * PUT /api/products/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO productDTO) {
        Product updatedProduct = productService.updateProduct(id, productDTO);
        ProductDTO responseDTO = new ProductDTO();
        responseDTO.setId(updatedProduct.getId());
        responseDTO.setName(updatedProduct.getName());
        responseDTO.setPrice(updatedProduct.getPrice());
        responseDTO.setImage(updatedProduct.getImage());
        responseDTO.setCategory(updatedProduct.getCategory());
        responseDTO.setDescription(updatedProduct.getDescription());
        responseDTO.setStock(updatedProduct.getStock());
        responseDTO.setStatus(updatedProduct.getStatus().name().toLowerCase());
        responseDTO.setVendor(updatedProduct.getVendor());
        responseDTO.setRating(updatedProduct.getRating());
        responseDTO.setReviews(updatedProduct.getReviews());
        
        return ResponseEntity.ok(
                new ApiResponse<>("Product updated successfully", responseDTO)
        );
    }

    /**
     * Delete a product
     * DELETE /api/products/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(
                new ApiResponse<>("Product deleted successfully", null)
        );
    }

    /**
     * Approve a product (change status to approved)
     * PATCH /api/products/{id}/approve
     */
    @PatchMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<ProductDTO>> approveProduct(@PathVariable Long id) {
        Product approvedProduct = productService.approveProduct(id);
        ProductDTO responseDTO = new ProductDTO();
        responseDTO.setId(approvedProduct.getId());
        responseDTO.setName(approvedProduct.getName());
        responseDTO.setPrice(approvedProduct.getPrice());
        responseDTO.setImage(approvedProduct.getImage());
        responseDTO.setCategory(approvedProduct.getCategory());
        responseDTO.setDescription(approvedProduct.getDescription());
        responseDTO.setStock(approvedProduct.getStock());
        responseDTO.setStatus(approvedProduct.getStatus().name().toLowerCase());
        responseDTO.setVendor(approvedProduct.getVendor());
        responseDTO.setRating(approvedProduct.getRating());
        responseDTO.setReviews(approvedProduct.getReviews());
        
        return ResponseEntity.ok(
                new ApiResponse<>("Product approved successfully", responseDTO)
        );
    }

    /**
     * Reject a product (change status to rejected)
     * PATCH /api/products/{id}/reject
     */
    @PatchMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<ProductDTO>> rejectProduct(@PathVariable Long id) {
        Product rejectedProduct = productService.rejectProduct(id);
        ProductDTO responseDTO = new ProductDTO();
        responseDTO.setId(rejectedProduct.getId());
        responseDTO.setName(rejectedProduct.getName());
        responseDTO.setPrice(rejectedProduct.getPrice());
        responseDTO.setImage(rejectedProduct.getImage());
        responseDTO.setCategory(rejectedProduct.getCategory());
        responseDTO.setDescription(rejectedProduct.getDescription());
        responseDTO.setStock(rejectedProduct.getStock());
        responseDTO.setStatus(rejectedProduct.getStatus().name().toLowerCase());
        responseDTO.setVendor(rejectedProduct.getVendor());
        responseDTO.setRating(rejectedProduct.getRating());
        responseDTO.setReviews(rejectedProduct.getReviews());
        
        return ResponseEntity.ok(
                new ApiResponse<>("Product rejected successfully", responseDTO)
        );
    }
}
