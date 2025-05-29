package com.rently.rentlybackend.exchange;

import java.math.BigDecimal;

public record BookingExchange(String email, String firstName, BigDecimal finalPrice, String bookingId) {
}
