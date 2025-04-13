package com.rently.rentlybackend.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record BookingResponse(
        String id,
        LocalDate checkIn,
        LocalDate checkOut,
        LocalDateTime createdAt,
        List<Guest> guests
) {
    public record Guest(
            String firstName,
            String lastName
    ) {}
}
