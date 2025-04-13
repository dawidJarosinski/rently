package com.rently.rentlybackend.rest;

import com.rently.rentlybackend.dto.request.PropertyRequest;
import com.rently.rentlybackend.dto.response.PropertyResponse;
import com.rently.rentlybackend.service.GoogleDriveUploaderService;
import com.rently.rentlybackend.service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/api/host/properties")
@CrossOrigin("*")
@RequiredArgsConstructor
public class HostPropertyController {
    private final PropertyService propertyService;
    private final GoogleDriveUploaderService googleDriveUploaderService;

    @PostMapping
    public ResponseEntity<PropertyResponse> save(@Valid @RequestBody PropertyRequest request, Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(propertyService.save(request, principal.getName()));
    }

    @PostMapping("{propertyId}/upload")
    public ResponseEntity<String> uploadFile(
            @PathVariable UUID propertyId,
            @RequestParam("file") MultipartFile file,
            Principal principal) {
        try {
            File convFile = convertMultipartFileToFile(file);
            String fileId = googleDriveUploaderService.uploadFileToDrive(propertyId, convFile, principal.getName());
            convFile.delete();

            return ResponseEntity.ok("file has been saved in google drive with id: " + fileId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error: " + e.getMessage());
        }
    }

    private File convertMultipartFileToFile(MultipartFile file) throws Exception {
        File convFile = Files.createTempFile("upload_", file.getOriginalFilename()).toFile();
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }

}
