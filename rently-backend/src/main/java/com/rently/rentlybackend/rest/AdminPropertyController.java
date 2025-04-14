package com.rently.rentlybackend.rest;

import com.rently.rentlybackend.dto.response.PropertyResponse;
import com.rently.rentlybackend.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminPropertyController {

    private final PropertyService propertyService;


    @GetMapping("/properties")
    public ResponseEntity<List<PropertyResponse>> findPropertiesByApprove(@RequestParam boolean approve) {
        return ResponseEntity.ok(propertyService.findPropertiesByApprove(approve));
    }

    @PatchMapping("/properties/{id}/approve")
    public ResponseEntity<PropertyResponse> approve(@PathVariable UUID id) {
        return ResponseEntity.ok(propertyService.approve(id));
    }

    @DeleteMapping("/propreties/{id}/decline")
    public void decline(@PathVariable UUID id) {
        propertyService.decline(id);
    }
}
