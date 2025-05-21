package com.rently.rentlybackend.rest;

import com.rently.rentlybackend.dto.response.PropertyResponse;
import com.rently.rentlybackend.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
@RequestMapping("/api/admin")
public class AdminPropertyController {

    private final PropertyService propertyService;

    @Operation(summary = "Get properties by approval status",
            description = "Returns all properties filtered by their approval status (approved or not)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PropertyResponse.class))),
            @ApiResponse(responseCode = "403", description = "Access denied", content = @Content)
    })
    @GetMapping("/properties")
    public ResponseEntity<List<PropertyResponse>> findPropertiesByApprove(@RequestParam boolean approve) {
        return ResponseEntity.ok(propertyService.findPropertiesByApprove(approve));
    }

    @Operation(summary = "Approve property",
            description = "Marks a property as approved by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Property approved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PropertyResponse.class))),
            @ApiResponse(responseCode = "404", description = "Property not found", content = @Content),
            @ApiResponse(responseCode = "403", description = "Access denied", content = @Content)
    })
    @PatchMapping("/properties/{id}/approve")
    public ResponseEntity<PropertyResponse> approve(@PathVariable UUID id) {
        return ResponseEntity.ok(propertyService.approve(id));
    }

    @Operation(summary = "Decline (delete) property",
            description = "Deletes a property by its ID (used to decline submission)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Property declined and deleted successfully", content = @Content),
            @ApiResponse(responseCode = "404", description = "Property not found", content = @Content),
            @ApiResponse(responseCode = "403", description = "Access denied", content = @Content)
    })
    @DeleteMapping("/properties/{id}/decline")
    public void decline(@PathVariable UUID id) {
        propertyService.decline(id);
    }
}

