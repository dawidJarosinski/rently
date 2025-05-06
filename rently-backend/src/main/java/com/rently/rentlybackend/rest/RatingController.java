package com.rently.rentlybackend.rest;

import com.rently.rentlybackend.dto.request.RatingRequest;
import com.rently.rentlybackend.dto.response.RatingResponse;
import com.rently.rentlybackend.service.RatingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping("/properties/{id}/ratings")
    public ResponseEntity<RatingResponse> save(
            @PathVariable UUID id,
            @RequestBody RatingRequest request,
            Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ratingService.save(id, request, principal.getName()));
    }
}
