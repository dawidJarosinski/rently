package com.rently.rentlybackend.rest;


import com.rently.rentlybackend.dto.response.BookingResponse;
import com.rently.rentlybackend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

@RestController
@RequestMapping("/api/host")
@CrossOrigin("*")
@RequiredArgsConstructor
public class HostBookingController {

    private final BookingService bookingService;

    @Operation(
            summary = "Get bookings for host's properties",
            description = "Returns a list of bookings for all properties owned by the host. "
                    + "If propertyId is provided, filters bookings by property."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of bookings retrieved",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = BookingResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> findAll(
            @RequestParam(required = false) UUID propertyId,
            Principal principal
    ) {
        return ResponseEntity.ok(bookingService.findAllByHost(principal.getName(), propertyId));
    }

    @Operation(
            summary = "Delete a booking (host only)",
            description = "Allows a host to delete a booking by ID, if it belongs to one of their properties."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Booking deleted successfully", content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content),
            @ApiResponse(responseCode = "404", description = "Booking not found or not owned by host", content = @Content)
    })
    @DeleteMapping("/bookings/{id}")
    public void delete(Principal principal, @PathVariable UUID id) {
        bookingService.deleteByHost(principal.getName(), id);
    }
}

