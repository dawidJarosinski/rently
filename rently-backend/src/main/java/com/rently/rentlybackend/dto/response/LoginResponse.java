package com.rently.rentlybackend.dto.response;

public record LoginResponse(String token, RegisterResponse user) {
}
