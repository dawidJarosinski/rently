package com.rently.rentlybackend.service;

import com.rently.rentlybackend.dto.request.BookingRequest;
import com.rently.rentlybackend.dto.response.BookingResponse;
import com.rently.rentlybackend.exception.BookingException;
import com.rently.rentlybackend.exception.PropertyException;
import com.rently.rentlybackend.mapper.BookingMapper;
import com.rently.rentlybackend.mapper.GuestMapper;
import com.rently.rentlybackend.model.Booking;
import com.rently.rentlybackend.model.Guest;
import com.rently.rentlybackend.model.Property;
import com.rently.rentlybackend.model.User;
import com.rently.rentlybackend.repository.GuestRepository;
import com.rently.rentlybackend.repository.PropertyRepository;
import com.rently.rentlybackend.repository.BookingRepository;
import com.rently.rentlybackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final BookingRepository rentRepository;
    private final BookingMapper bookingMapper;
    private final GuestMapper guestMapper;
    private final BookingRepository bookingRepository;

    @Transactional
    public BookingResponse save(BookingRequest request, UUID propertyId, String currentUserUsername) {
        User user = userRepository.findUserByEmail(currentUserUsername)
                .orElseThrow(() -> new UsernameNotFoundException("wrong user"));

        Property property = propertyRepository.findPropertyById(propertyId)
                .orElseThrow(() -> new PropertyException("wrong property id"));

        if (checkAvailability(property, request.checkIn(), request.checkOut())) {
            throw new BookingException("these dates are not available");
        }

        if (request.guests().size() > property.getMaxNumberOfGuests()) {
            throw new BookingException("too many guests");
        }

        Booking booking = bookingMapper.fromDto(request);
        booking.setProperty(property);
        booking.setUser(user);

        List<Guest> guests = request.guests().stream()
                .map(guestMapper::fromDto)
                .toList();
        guests.forEach(guest -> guest.setBooking(booking));
        booking.setGuests(guests);

        bookingRepository.save(booking);

        return bookingMapper.toDto(booking);
    }

    private boolean checkAvailability(Property property, LocalDate checkIn, LocalDate checkOut) {
        return rentRepository.existsBookingCollisionInDatesAndProperty(checkIn, checkOut, property);
    }
}
