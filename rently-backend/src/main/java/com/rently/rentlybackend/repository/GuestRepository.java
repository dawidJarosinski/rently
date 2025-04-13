package com.rently.rentlybackend.repository;

import com.rently.rentlybackend.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface GuestRepository extends JpaRepository<Guest, UUID> {
}
