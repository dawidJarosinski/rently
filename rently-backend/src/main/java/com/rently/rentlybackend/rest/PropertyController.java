package com.rently.rentlybackend.rest;


import com.rently.rentlybackend.dto.response.PropertyResponse;
import com.rently.rentlybackend.service.GoogleDriveUploaderService;
import com.rently.rentlybackend.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;



import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin("*")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;
    private final GoogleDriveUploaderService googleDriveUploaderService;

    @Operation(summary = "Search properties", description = "Search properties by location, date range, and guest count")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Properties found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PropertyResponse.class)))
    })
    @GetMapping("/search")
    public ResponseEntity<List<PropertyResponse>> findAll(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(required = false) Integer guestCount
    ) {
        return ResponseEntity.ok(propertyService.findAll(location, checkIn, checkOut, guestCount));
    }

    @Operation(summary = "Get property details", description = "Get full information about a property by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Property found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PropertyResponse.class))),
            @ApiResponse(responseCode = "404", description = "Property not found", content = @Content)
    })
    @GetMapping("/{propertyId}")
    public ResponseEntity<PropertyResponse> findById(@PathVariable UUID propertyId) {
        return ResponseEntity.ok(propertyService.findById(propertyId));
    }

    @Operation(summary = "Get properties by owner", description = "Returns all properties owned by a specific user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Properties found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PropertyResponse.class)))
    })
    @GetMapping()
    public ResponseEntity<List<PropertyResponse>> findAllByOwner(@RequestParam UUID ownerId) {
        return ResponseEntity.ok(propertyService.findAllByOwnerId(ownerId));
    }

    @Operation(summary = "Get top-rated properties", description = "Returns top approved properties ordered by average rating")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Top properties retrieved",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PropertyResponse.class)))
    })
    @GetMapping("/feed")
    public ResponseEntity<List<PropertyResponse>> findAllApprovedOrderByAvgRatingDesc(@RequestParam(required = false) Integer limit) {
        return ResponseEntity.ok(propertyService.findAllApprovedOrderByAvgRatingDesc(limit));
    }

    @Operation(summary = "Get property image", description = "Returns an image by file ID from Google Drive")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Image found",
                    content = @Content(mediaType = "image/jpeg")),
            @ApiResponse(responseCode = "404", description = "Image not found", content = @Content)
    })
    @GetMapping("/images/{fileId}")
    public ResponseEntity<byte[]> getImage(@PathVariable String fileId) {
        try {
            ByteArrayOutputStream outputStream = googleDriveUploaderService.getByteArrayOutputStream(fileId);

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(outputStream.toByteArray());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}

