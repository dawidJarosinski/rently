package com.rently.rentlybackend.rest;


import com.google.api.services.drive.model.File;
import com.rently.rentlybackend.dto.response.PropertyResponse;
import com.rently.rentlybackend.service.GoogleDriveUploaderService;
import com.rently.rentlybackend.service.PropertyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/properties")
@CrossOrigin("*")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;
    private final GoogleDriveUploaderService googleDriveUploaderService;

    @GetMapping("/{propertyId}")
    public ResponseEntity<PropertyResponse> findById(@PathVariable UUID propertyId) {
        return ResponseEntity.ok(propertyService.findById(propertyId));
    }

    @GetMapping()
    public ResponseEntity<List<PropertyResponse>> findAllByOwner(@RequestParam UUID ownerId) {
        return ResponseEntity.ok(propertyService.findAllByOwnerId(ownerId));
    }

    @GetMapping("/feed")
    public ResponseEntity<List<PropertyResponse>> findAllApprovedOrderByAvgRatingDesc(@RequestParam(required = false) Integer limit) {
        return ResponseEntity.ok(propertyService.findAllApprovedOrderByAvgRatingDesc(limit));
    }

    @GetMapping("/{propertyId}/images")
    public ResponseEntity<List<String>> getImageLinksForProperty(@PathVariable UUID propertyId) {
        try {
            String folderId = googleDriveUploaderService.findFolderIdByPropertyId(propertyId);
            List<File> files = googleDriveUploaderService.listFilesInFolder(folderId);

            List<String> imageUrls = files.stream()
                    .filter(f -> f.getMimeType().startsWith("image/"))
                    .map(File::getId)
                    .toList();

            return ResponseEntity.ok(imageUrls);
        } catch (Exception e) {
            log.info(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

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
