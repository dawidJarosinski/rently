package com.rently.rentlybackend.dto.response;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record BookingResponse(
        String id,
        String propertyId,
        LocalDate checkIn,
        LocalDate checkOut,
        LocalDateTime createdAt,
        BigDecimal finalPrice,
        List<Guest> guests
) {
    public record Guest(
            String firstName,
            String lastName
    ) {}
}
