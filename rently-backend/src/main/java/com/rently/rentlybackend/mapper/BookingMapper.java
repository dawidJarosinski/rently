package com.rently.rentlybackend.mapper;

import com.rently.rentlybackend.dto.request.BookingRequest;
import com.rently.rentlybackend.dto.response.BookingResponse;
import com.rently.rentlybackend.model.Booking;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class BookingMapper {

    public Booking fromDto(BookingRequest request) {
        return new Booking(request.checkIn(), request.checkOut());
    }

    public BookingResponse toDto(Booking booking, BigDecimal finalPrice) {
        return new BookingResponse(
                booking.getId().toString(),
                booking.getProperty().getId().toString(),
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getCreatedAt(),
                finalPrice,
                booking.getGuests().stream()
                        .map(guest -> new BookingResponse.Guest(guest.getFirstName(), guest.getLastName())).toList()
        );
    }
}
