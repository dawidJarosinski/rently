package com.rently.rentlybackend.repository;

import com.rently.rentlybackend.dto.response.BookingResponse;
import com.rently.rentlybackend.model.Booking;
import com.rently.rentlybackend.model.Property;
import com.rently.rentlybackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    @Query("SELECT EXISTS " +
            "(SELECT b FROM Booking b " +
            "WHERE b.checkIn <= :checkOut AND b.checkOut >= :checkIn AND b.property = :property)")
    boolean existsBookingCollisionInDatesAndProperty(
            @Param("checkIn")LocalDate checkIn,
            @Param("checkOut")LocalDate checkOut,
            @Param("property")Property property);

    List<Booking> findAllByUser(User user);

    List<Booking> findAllByProperty_User(User user);

    Optional<Booking> findBookingById(UUID id);
}
