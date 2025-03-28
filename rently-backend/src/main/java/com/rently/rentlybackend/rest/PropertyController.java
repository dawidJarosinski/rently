package com.rently.rentlybackend.rest;


import com.rently.rentlybackend.dto.request.PropertyRequest;
import com.rently.rentlybackend.dto.response.PropertyResponse;
import com.rently.rentlybackend.service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @PostMapping
    public ResponseEntity<PropertyResponse> save(@Valid @RequestBody PropertyRequest request, Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(propertyService.save(request, principal.getName()));
    }

    @GetMapping("/{propertyId}")
    public ResponseEntity<PropertyResponse> findById(@PathVariable UUID propertyId) {
        return ResponseEntity.ok(propertyService.findById(propertyId));
    }

    @GetMapping()
    public ResponseEntity<List<PropertyResponse>> findAllByOwner(@RequestParam UUID ownerId) {
        return ResponseEntity.ok(propertyService.findAllByOwnerId(ownerId));
    }
}
