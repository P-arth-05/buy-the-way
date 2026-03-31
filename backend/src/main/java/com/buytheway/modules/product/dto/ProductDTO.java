package com.buytheway.modules.product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private Long id;

    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 100, message = "Product name must be between 2 and 100 characters")
    private String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Price must have at most 10 integer digits and 2 decimal places")
    private BigDecimal price;

    @NotBlank(message = "Image URL is required")
    @Pattern(regexp = "^https?://.*", message = "Image must be a valid URL")
    private String image;

    @NotBlank(message = "Category is required")
    private String category;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(pending|approved|rejected)$", message = "Status must be one of: pending, approved, rejected")
    private String status;

    @NotBlank(message = "Vendor is required")
    private String vendor;

    @DecimalMin(value = "0.0", message = "Rating must be 0 or higher")
    @DecimalMax(value = "5.0", message = "Rating must be 5 or lower")
    private Double rating;

    @Min(value = 0, message = "Reviews count cannot be negative")
    private Integer reviews;
}
