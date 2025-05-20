package com.rently.rentlybackend.event;

import java.math.BigDecimal;

public record BookingEvent(String email, String firstName, BigDecimal finalPrice, String bookingId) {
}
