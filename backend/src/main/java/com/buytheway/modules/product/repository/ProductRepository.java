package com.buytheway.modules.product.repository;

import com.buytheway.modules.product.entity.Product;
import com.buytheway.modules.product.entity.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByStatus(ProductStatus status);

    List<Product> findByCategory(String category);

    List<Product> findByVendor(String vendor);

    @Query("SELECT p FROM Product p WHERE p.status = :status AND LOWER(p.category) = LOWER(:category)")
    List<Product> findByStatusAndCategory(@Param("status") ProductStatus status, @Param("category") String category);

    @Query("SELECT p FROM Product p WHERE p.status = 'APPROVED' ORDER BY p.rating DESC, p.reviews DESC")
    List<Product> findApprovedProductsOrderByRating();

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND p.status = 'APPROVED'")
    List<Product> searchApprovedProductsByName(@Param("keyword") String keyword);
}