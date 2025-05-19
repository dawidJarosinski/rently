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

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping("/properties/{id}/ratings")
    public ResponseEntity<RatingResponse> save(
            @PathVariable UUID id,
            @RequestBody RatingRequest request,
            Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ratingService.save(id, request, principal.getName()));
    }

    @GetMapping("/properties/{id}/ratings")
    public ResponseEntity<List<RatingResponse>> findRatingsByProperty(
            @PathVariable UUID id) {
        return ResponseEntity.ok(ratingService.findRatingsByPropertyId(id));
    }
}
