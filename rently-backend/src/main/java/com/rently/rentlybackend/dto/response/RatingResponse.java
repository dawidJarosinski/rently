package com.rently.rentlybackend.dto.response;

public record RatingResponse(
        String id,
        Integer rate,
        String comment,
        String propertyId,
        String userId
) {
}
