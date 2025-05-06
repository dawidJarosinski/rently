package com.rently.rentlybackend.repository;

import com.rently.rentlybackend.model.Property;
import com.rently.rentlybackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PropertyRepository extends JpaRepository<Property, UUID> {
    Optional<Property> findPropertyById(UUID id);
    List<Property> findPropertiesByUser_Id(UUID id);
    boolean existsPropertyByIdAndUser(UUID id, User user);

    @Query("""
      SELECT p FROM Property p
      LEFT JOIN p.ratings r
      WHERE p.approved = true
      GROUP BY p
      ORDER BY AVG(r.rate) DESC
    """)
    List<Property> findAllApprovedOrderByAvgRatingDesc();
}
