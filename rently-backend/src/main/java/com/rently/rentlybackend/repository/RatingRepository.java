package com.rently.rentlybackend.repository;

import com.rently.rentlybackend.model.Property;
import com.rently.rentlybackend.model.Rating;
import com.rently.rentlybackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.projection.EntityProjection;

import java.util.Optional;
import java.util.UUID;

public interface RatingRepository extends JpaRepository<Rating, UUID> {

    boolean existsRatingByUserAndProperty(User user, Property property);
}
