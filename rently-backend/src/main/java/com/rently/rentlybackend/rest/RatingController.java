package com.rently.rentlybackend.rest;

import com.rently.rentlybackend.dto.request.RatingRequest;
import com.rently.rentlybackend.dto.response.RatingAverageResponse;
import com.rently.rentlybackend.dto.response.RatingResponse;
import com.rently.rentlybackend.repository.RatingRepository;
import com.rently.rentlybackend.service.RatingService;
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
public class RatingController {

    private final RatingService ratingService;

    @Operation(summary = "Add a rating to a property", description = "Allows a user to submit a rating and comment for a specific property they have booked and checked out from.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Rating created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = RatingResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or property not eligible for rating", content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @PostMapping("/properties/{id}/ratings")
    public ResponseEntity<RatingResponse> save(
            @PathVariable UUID id,
            @RequestBody RatingRequest request,
            Principal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ratingService.save(id, request, principal.getName()));
    }

    @Operation(summary = "Get ratings for a property", description = "Returns all ratings submitted for a specific property.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ratings found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = RatingResponse.class))),
            @ApiResponse(responseCode = "404", description = "Property not found", content = @Content)
    })
    @GetMapping("/properties/{id}/ratings")
    public ResponseEntity<List<RatingResponse>> findRatingsByProperty(@PathVariable UUID id) {
        return ResponseEntity.ok(ratingService.findRatingsByPropertyId(id));
    }
}
