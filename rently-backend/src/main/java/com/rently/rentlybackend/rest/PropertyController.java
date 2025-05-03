package com.rently.rentlybackend.rest;


import com.rently.rentlybackend.dto.response.PropertyResponse;
import com.rently.rentlybackend.service.GoogleDriveUploaderService;
import com.rently.rentlybackend.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin("*")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @GetMapping("/{propertyId}")
    public ResponseEntity<PropertyResponse> findById(@PathVariable UUID propertyId) {
        return ResponseEntity.ok(propertyService.findById(propertyId));
    }

    @GetMapping()
    public ResponseEntity<List<PropertyResponse>> findAllByOwner(@RequestParam UUID ownerId) {
        return ResponseEntity.ok(propertyService.findAllByOwnerId(ownerId));
    }
}
