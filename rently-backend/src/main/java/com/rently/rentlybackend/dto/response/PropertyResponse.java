package com.rently.rentlybackend.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record PropertyResponse(
        String id,
        String ownerId,
        String propertyType,
        String name,
        String description,
        Integer maxNumberOfGuests,
        BigDecimal pricePerNight,
        boolean approved,
        Double averageRate,
        Address address,
        List<String> images
) {
    public record Address(
            String country,
            String city,
            String street,
            String houseNumber,
            String apartmentNumber,
            String postalCode
    ) {}
}
