package com.rently.rentlybackend.repository;

import com.rently.rentlybackend.model.Booking;
import com.rently.rentlybackend.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {


    @Query("SELECT EXISTS " +
            "(SELECT b FROM Booking b " +
            "WHERE b.checkIn <= :checkOut AND b.checkOut >= :checkIn AND b.property = :property)")
    boolean existsBookingCollisionInDatesAndProperty(
            @Param("checkIn")LocalDate checkIn,
            @Param("checkOut")LocalDate checkOut,
            @Param("property")Property property);
}
