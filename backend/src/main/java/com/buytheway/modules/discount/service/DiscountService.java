package com.buytheway.modules.discount.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buytheway.common.exception.BadRequestException;
import com.buytheway.modules.discount.dto.DiscountDTO;
import com.buytheway.modules.discount.entity.Discount;
import com.buytheway.modules.discount.repository.DiscountRepository;

@Service
public class DiscountService {

    private final DiscountRepository discountRepository;

    public DiscountService(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    @Transactional(readOnly = true)
    public List<DiscountDTO> getAllDiscounts() {
        return discountRepository.findAll().stream()
                .sorted((left, right) -> right.getCreatedAt().compareTo(left.getCreatedAt()))
                .map(DiscountDTO::new)
                .toList();
    }

    @Transactional
    public DiscountDTO createDiscount(DiscountDTO dto) {
        String normalizedCode = normalizeCode(dto.getCode());
        validateDates(dto);
        validatePercentage(dto.getPercentage());

        if (discountRepository.existsByCodeIgnoreCase(normalizedCode)) {
            throw new BadRequestException("Promo code already exists");
        }

        Discount discount = new Discount();
        discount.setCode(normalizedCode);
        discount.setPercentage(dto.getPercentage());
        discount.setStartDate(dto.getStartDate());
        discount.setEndDate(dto.getEndDate());

        return new DiscountDTO(discountRepository.save(discount));
    }

    @Transactional
    public void deleteDiscount(Long id) {
        if (!discountRepository.existsById(id)) {
            throw new BadRequestException("Promo code not found");
        }
        discountRepository.deleteById(id);
    }

    private String normalizeCode(String code) {
        if (code == null || code.isBlank()) {
            throw new BadRequestException("Promo code is required");
        }
        return code.trim().toUpperCase();
    }

    private void validateDates(DiscountDTO dto) {
        if (dto.getStartDate() == null || dto.getEndDate() == null) {
            throw new BadRequestException("Start date and end date are required");
        }

        LocalDate today = LocalDate.now();
        if (dto.getStartDate().isBefore(today)) {
            throw new BadRequestException("Start date cannot be before today");
        }

        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }
    }

    private void validatePercentage(BigDecimal percentage) {
        if (percentage == null) {
            throw new BadRequestException("Discount percentage is required");
        }

        if (percentage.compareTo(BigDecimal.ZERO) <= 0 || percentage.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new BadRequestException("Discount percentage must be between 0 and 100");
        }
    }
}
