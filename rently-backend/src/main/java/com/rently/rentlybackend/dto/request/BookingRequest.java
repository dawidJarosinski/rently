package com.rently.rentlybackend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record BookingRequest(
        @NotNull(message = "Check in cant be null") LocalDate checkIn,
        @NotNull(message = "Check out cant be null") LocalDate checkOut,
        @NotNull(message = "Guests cant be null") @Valid List<Guest> guests
) {
    public record Guest(
            @NotBlank(message = "First name cant be blank") String firstName,
            @NotBlank(message = "Last name cant be blank")  String lastName
    ) {}
}
