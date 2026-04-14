package com.buytheway.modules.product.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buytheway.modules.product.dto.ProductDTO;
import com.buytheway.modules.product.entity.Product;
import com.buytheway.modules.product.entity.ProductStatus;
import com.buytheway.modules.product.repository.ProductRepository;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(ProductDTO dto) {
        // Validation
        validateProductDTO(dto);

        // Mapping DTO → Entity
        Product product = mapDTOToEntity(dto);
        product.setId(null); // Ensure new product creation

        return productRepository.save(product);
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapEntityToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getProductCount() {
        return productRepository.count();
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getApprovedProducts() {
        return productRepository.findByStatus(ProductStatus.APPROVED).stream()
                .map(this::mapEntityToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByCategory(String category) {
        return productRepository.findByStatusAndCategory(ProductStatus.APPROVED, category).stream()
                .map(this::mapEntityToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByVendor(String vendor) {
        return productRepository.findByVendor(vendor).stream()
                .map(this::mapEntityToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ProductDTO> getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::mapEntityToDTO);
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> searchProducts(String keyword) {
        return productRepository.searchApprovedProductsByName(keyword).stream()
                .map(this::mapEntityToDTO)
                .collect(Collectors.toList());
    }

    public Product updateProduct(Long id, ProductDTO dto) {
        // Validation
        validateProductDTO(dto);

        Optional<Product> existingProductOpt = productRepository.findById(id);
        if (existingProductOpt.isEmpty()) {
            throw new RuntimeException("Product not found with id: " + id);
        }

        Product existingProduct = existingProductOpt.get();

        // Update fields
        existingProduct.setName(dto.getName());
        existingProduct.setPrice(dto.getPrice());
        existingProduct.setImage(dto.getImage());
        existingProduct.setCategory(dto.getCategory());
        existingProduct.setDescription(dto.getDescription());
        existingProduct.setStock(dto.getStock());
        existingProduct.setStatus(ProductStatus.valueOf(dto.getStatus().toUpperCase()));
        existingProduct.setVendor(dto.getVendor());
        existingProduct.setRating(dto.getRating());
        existingProduct.setReviews(dto.getReviews());

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public Product approveProduct(Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found with id: " + id);
        }

        Product product = productOpt.get();
        product.setStatus(ProductStatus.APPROVED);
        return productRepository.save(product);
    }

    public Product rejectProduct(Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found with id: " + id);
        }

        Product product = productOpt.get();
        product.setStatus(ProductStatus.REJECTED);
        return productRepository.save(product);
    }

    private void validateProductDTO(ProductDTO dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new RuntimeException("Product name is required");
        }
        if (dto.getName().length() < 2 || dto.getName().length() > 100) {
            throw new RuntimeException("Product name must be between 2 and 100 characters");
        }
        if (dto.getPrice() == null || dto.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Price must be greater than 0");
        }
        if (dto.getImage() == null || dto.getImage().trim().isEmpty()) {
            throw new RuntimeException("Image URL is required");
        }
        if (!dto.getImage().matches("^https?://.*")) {
            throw new RuntimeException("Image must be a valid URL");
        }
        if (dto.getCategory() == null || dto.getCategory().trim().isEmpty()) {
            throw new RuntimeException("Category is required");
        }
        if (dto.getDescription() != null && dto.getDescription().length() > 500) {
            throw new RuntimeException("Description must not exceed 500 characters");
        }
        if (dto.getStock() == null || dto.getStock() < 0) {
            throw new RuntimeException("Stock cannot be negative");
        }
        if (dto.getStatus() == null || dto.getStatus().trim().isEmpty()) {
            throw new RuntimeException("Status is required");
        }
        if (!dto.getStatus().matches("^(pending|approved|rejected)$")) {
            throw new RuntimeException("Status must be one of: pending, approved, rejected");
        }
        if (dto.getVendor() == null || dto.getVendor().trim().isEmpty()) {
            throw new RuntimeException("Vendor is required");
        }
        if (dto.getRating() != null &&
                (dto.getRating().compareTo(BigDecimal.ZERO) < 0 ||
                 dto.getRating().compareTo(BigDecimal.valueOf(5)) > 0)) {
            throw new RuntimeException("Rating must be between 0 and 5");
        }
        if (dto.getReviews() != null && dto.getReviews() < 0) {
            throw new RuntimeException("Reviews count cannot be negative");
        }
    }

    private Product mapDTOToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setImage(dto.getImage());
        product.setCategory(dto.getCategory());
        product.setDescription(dto.getDescription());
        product.setStock(dto.getStock());
        product.setStatus(ProductStatus.valueOf(dto.getStatus().toUpperCase()));
        product.setVendor(dto.getVendor());
        product.setRating(dto.getRating());
        product.setReviews(dto.getReviews());
        return product;
    }

    private ProductDTO mapEntityToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setImage(product.getImage());
        dto.setCategory(product.getCategory());
        dto.setDescription(product.getDescription());
        dto.setStock(product.getStock());
        dto.setStatus(product.getStatus().name().toLowerCase());
        dto.setVendor(product.getVendor());
        dto.setRating(product.getRating());
        dto.setReviews(product.getReviews());
        return dto;
    }
}
