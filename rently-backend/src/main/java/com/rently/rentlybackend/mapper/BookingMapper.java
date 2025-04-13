package com.rently.rentlybackend.mapper;

import com.rently.rentlybackend.dto.request.BookingRequest;
import com.rently.rentlybackend.dto.response.BookingResponse;
import com.rently.rentlybackend.model.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public Booking fromDto(BookingRequest request) {
        return new Booking(request.checkIn(), request.checkOut());
    }

    public BookingResponse toDto(Booking booking) {
        return new BookingResponse(
                booking.getId().toString(),
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getCreatedAt(),
                booking.getGuests().stream()
                        .map(guest -> new BookingResponse.Guest(guest.getFirstName(), guest.getLastName())).toList()
        );
    }
}
