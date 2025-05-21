package com.rently.rentlybackend.rest;

import com.rently.rentlybackend.dto.request.BookingRequest;
import com.rently.rentlybackend.dto.response.BookingResponse;
import com.rently.rentlybackend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @Operation(summary = "Create a booking", description = "Create a booking for a specific property")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Booking created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = BookingResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid booking data", content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content),
            @ApiResponse(responseCode = "404", description = "Property not found", content = @Content)
    })
    @PostMapping("/properties/{id}/bookings")
    public ResponseEntity<BookingResponse> save(
            @RequestBody BookingRequest request,
            Principal principal,
            @PathVariable("id") UUID propertyId
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.save(request, propertyId, principal.getName()));
    }

    @Operation(summary = "Get all bookings for the logged-in user",
            description = "Returns a list of all bookings made by the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of bookings returned",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = BookingResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> findAllByUserId(
            Principal principal
    ) {
        return ResponseEntity.ok(bookingService.findAllByUser(principal.getName()));
    }

    @Operation(summary = "Delete a booking", description = "Deletes a booking by ID for the current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Booking deleted successfully", content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content),
            @ApiResponse(responseCode = "404", description = "Booking not found", content = @Content)
    })
    @DeleteMapping("/bookings/{id}")
    public void delete(@PathVariable UUID id, Principal principal) {
        bookingService.delete(principal.getName(), id);
    }
}
