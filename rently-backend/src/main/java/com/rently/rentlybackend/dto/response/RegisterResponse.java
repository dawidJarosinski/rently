package com.rently.rentlybackend.dto.response;

public record RegisterResponse(
        String id,
        String email,
        String firstName,
        String lastName,
        String role
) {
}
