package com.buytheway.modules.discount.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.buytheway.modules.discount.entity.Discount;

public interface DiscountRepository extends JpaRepository<Discount, Long> {

    boolean existsByCodeIgnoreCase(String code);

    Optional<Discount> findByCodeIgnoreCase(String code);
}
