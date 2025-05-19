package com.rently.rentlybackend.repository;

import com.rently.rentlybackend.model.Property;
import com.rently.rentlybackend.model.Rating;
import com.rently.rentlybackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.projection.EntityProjection;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RatingRepository extends JpaRepository<Rating, UUID> {

    boolean existsRatingByUserAndProperty(User user, Property property);

    @Query("SELECT COALESCE(AVG(r.rate), 0) FROM Rating r WHERE r.property=:property")
    Double countAverageRateByProperty(@Param("property") Property property);

    List<Rating> findRatingsByProperty(Property property);
}
