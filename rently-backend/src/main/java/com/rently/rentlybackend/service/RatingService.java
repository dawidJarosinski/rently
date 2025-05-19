package com.rently.rentlybackend.service;

import com.rently.rentlybackend.dto.request.RatingRequest;
import com.rently.rentlybackend.dto.response.RatingAverageResponse;
import com.rently.rentlybackend.dto.response.RatingResponse;
import com.rently.rentlybackend.exception.BookingException;
import com.rently.rentlybackend.exception.PropertyException;
import com.rently.rentlybackend.exception.RatingException;
import com.rently.rentlybackend.model.Booking;
import com.rently.rentlybackend.model.Property;
import com.rently.rentlybackend.model.Rating;
import com.rently.rentlybackend.model.User;
import com.rently.rentlybackend.repository.BookingRepository;
import com.rently.rentlybackend.repository.PropertyRepository;
import com.rently.rentlybackend.repository.RatingRepository;
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
public class RatingService {
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public RatingResponse save(UUID propertyId, RatingRequest request, String currentUserEmail) {
        User user = userRepository.findUserByEmail(currentUserEmail)
                .orElseThrow(() -> new UsernameNotFoundException("wrong user"));
        Property property = propertyRepository.findPropertyById(propertyId)
                .orElseThrow(() -> new PropertyException("wrong property id"));

        List<Booking> bookings = bookingRepository.findBookingsByUserAndProperty(user, property);
        if (bookings.isEmpty()) {
            throw new BookingException("you didn't book the property");
        }
        if (bookings.stream().filter(booking -> booking.getCheckOut().isBefore(LocalDate.now())).toList().isEmpty()) {
            throw new BookingException("you can't rate property before check out");
        }
        if (ratingRepository.existsRatingByUserAndProperty(user, property)) {
            throw new RatingException("you have rated this property");
        }

        Rating rating = new Rating(request.rate(), request.comment(), property, user);
        ratingRepository.save(rating);

        return new RatingResponse(
                rating.getId().toString(),
                rating.getRate(),
                rating.getComment(),
                rating.getProperty().getId().toString(),
                rating.getUser().getId().toString(),
                user.getFirstName());
    }

    public List<RatingResponse> findRatingsByPropertyId(UUID propertyId) {
        Property property = propertyRepository.findPropertyById(propertyId)
                .orElseThrow(() -> new PropertyException("wrong property id"));
        User user = userRepository.findUserByEmail(property.getUser().getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("wrong user"));

        return ratingRepository.findRatingsByProperty(property)
                .stream()
                .map(rating -> new RatingResponse(
                        rating.getId().toString(),
                        rating.getRate(),
                        rating.getComment(),
                        rating.getProperty().getId().toString(),
                        rating.getUser().getId().toString(),
                        user.getFirstName()))
                .toList();
    }

}
