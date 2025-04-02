package com.rently.rentlybackend.repository;

import com.rently.rentlybackend.model.Property;
import com.rently.rentlybackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PropertyRepository extends JpaRepository<Property, UUID> {
    Optional<Property> findPropertyById(UUID id);
    Optional<Property> findPropertiesByUser_Id(UUID id);
    boolean existsPropertyByIdAndUser(UUID id, User user);
}
