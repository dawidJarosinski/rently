package com.rently.rentlybackend.mapper;

import com.rently.rentlybackend.dto.request.BookingRequest;
import com.rently.rentlybackend.model.Guest;
import org.springframework.stereotype.Component;

@Component
public class GuestMapper {

    public Guest fromDto(BookingRequest.Guest guestRequest) {
        return new Guest(
                guestRequest.firstName(),
                guestRequest.lastName()
        );
    }
}
