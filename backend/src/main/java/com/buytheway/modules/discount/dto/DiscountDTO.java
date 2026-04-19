package com.buytheway.modules.discount.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.buytheway.modules.discount.entity.Discount;

public class DiscountDTO {

    private Long id;
    private String code;
    private BigDecimal percentage;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;

    public DiscountDTO() {
    }

    public DiscountDTO(Discount discount) {
        this.id = discount.getId();
        this.code = discount.getCode();
        this.percentage = discount.getPercentage();
        this.startDate = discount.getStartDate();
        this.endDate = discount.getEndDate();
        this.createdAt = discount.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    public void setPercentage(BigDecimal percentage) {
        this.percentage = percentage;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
