package com.rently.rentlybackend.service;

import com.rently.rentlybackend.dto.request.BookingRequest;
import com.rently.rentlybackend.dto.response.BookingResponse;
import com.rently.rentlybackend.event.BookingEvent;
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
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
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
    private final KafkaTemplate<String, BookingEvent> kafkaTemplate;

    @Transactional
    public BookingResponse save(BookingRequest request, UUID propertyId, String currentUserEmail) {
        User user = userRepository.findUserByEmail(currentUserEmail)
                .orElseThrow(() -> new UsernameNotFoundException("wrong user"));

        Property property = propertyRepository.findPropertyById(propertyId)
                .orElseThrow(() -> new PropertyException("wrong property id"));

        if (!property.isApproved()) {
            throw new BookingException("this property is not approved");
        }

        if (request.checkIn().isBefore(LocalDate.now()) || request.checkIn().isAfter(request.checkOut())) {
            throw new BookingException("wrong check in or check out date");
        }

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

        BigDecimal finalPrice = countFinalPrice(booking);

        kafkaTemplate.send("booking",
                new BookingEvent(
                        user.getEmail(),
                        user.getFirstName(),
                        finalPrice,
                        booking.getId().toString()));

        return bookingMapper.toDto(booking, finalPrice);
    }

    public List<BookingResponse> findAllByUser(String currentUserEmail) {
        User user = userRepository.findUserByEmail(currentUserEmail)
                .orElseThrow(() -> new UsernameNotFoundException("wrong user"));

        return bookingRepository.findAllByUser(user)
                .stream()
                .map(booking -> bookingMapper.toDto(booking, countFinalPrice(booking)))
                .toList();
    }

    public List<BookingResponse> findAllByHost(String currentUserEmail, UUID propertyId) {
        User user = userRepository.findUserByEmail(currentUserEmail)
                .orElseThrow(() -> new UsernameNotFoundException("wrong user"));

        List<Booking> bookings = bookingRepository.findAllByProperty_User(user);

        if (propertyId != null) {
            bookings = bookings
                    .stream()
                    .filter(booking -> booking.getProperty().getId().equals(propertyId))
                    .toList();
        }
        return bookings.stream()
                .map(booking -> bookingMapper.toDto(booking, countFinalPrice(booking)))
                .toList();
    }


    @Transactional
    public void delete(String currentUserEmail, UUID bookingId) {
        User user = userRepository.findUserByEmail(currentUserEmail)
                .orElseThrow(() -> new UsernameNotFoundException("wrong user"));

        Booking booking = bookingRepository.findBookingById(bookingId)
                .orElseThrow(() -> new BookingException("wrong booking id"));

        if(!booking.getUser().equals(user)) {
            throw new BookingException("you are not able to manage other users bookings");
        }

        bookingRepository.delete(booking);
    }

    @Transactional
    public void deleteByHost(String currentUserEmail, UUID bookingId) {
        User user = userRepository.findUserByEmail(currentUserEmail)
                .orElseThrow(() -> new UsernameNotFoundException("wrong user"));

        Booking booking = bookingRepository.findBookingById(bookingId)
                .orElseThrow(() -> new BookingException("wrong booking id"));

        if (booking.getProperty().getUser() != user) {
            throw new BookingException("you are not able to manage other hosts bookings");
        }

        bookingRepository.delete(booking);
    }

    private BigDecimal countFinalPrice(Booking booking) {
        return booking.getProperty().getPricePerNight().multiply(new BigDecimal(ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut())));
    }

    private boolean checkAvailability(Property property, LocalDate checkIn, LocalDate checkOut) {
        return rentRepository.existsBookingCollisionInDatesAndProperty(checkIn, checkOut, property);
    }
}
