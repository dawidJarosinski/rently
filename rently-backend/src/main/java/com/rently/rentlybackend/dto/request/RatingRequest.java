package com.rently.rentlybackend.dto.request;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Range;

public record RatingRequest(
        @NotNull(message = "Rate cant be null") @Range(min = 1L, max = 5L, message = "Rate must be in range 1-5") Integer rate,
        String comment
) {
}
