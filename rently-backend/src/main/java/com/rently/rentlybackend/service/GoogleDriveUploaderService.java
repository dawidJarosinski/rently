package com.rently.rentlybackend.service;

import com.google.api.client.http.FileContent;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.Drive;
import com.rently.rentlybackend.model.User;
import com.rently.rentlybackend.repository.PropertyRepository;
import com.rently.rentlybackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoogleDriveUploaderService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public String uploadFileToDrive(UUID propertyId, java.io.File file, String currentUserUsername) throws Exception {
        User user = userRepository
                .findUserByEmail(currentUserUsername)
                .orElseThrow(() -> new UsernameNotFoundException("wrong user"));
        if (!propertyRepository.existsPropertyByIdAndUser(propertyId, user)) {
            throw new IllegalArgumentException("wrong property id");
        }


        Drive service = GoogleDriveService.getDriveService();
        String parentFolderId = "1S5aQ35FUsZeU8brYNAScFc0dCucvOAg1";
        String folderId = getOrCreateFolder(service, propertyId.toString(), parentFolderId);

        File fileMetadata = new File();
        fileMetadata.setName(file.getName());
        fileMetadata.setParents(Collections.singletonList(folderId));

        FileContent mediaContent = new FileContent(Files.probeContentType(file.toPath()), file);

        File uploadedFile = service.files().create(fileMetadata, mediaContent)
                .setFields("id")
                .execute();

        return uploadedFile.getId();
    }

    private String getOrCreateFolder(Drive service, String propertyId, String parentFolderId) throws IOException {
        List<File> folders = service.files().list()
                .setQ("name = '" + propertyId + "' and mimeType = 'application/vnd.google-apps.folder' and '" + parentFolderId + "' in parents")
                .setFields("files(id)")
                .execute()
                .getFiles();

        if (!folders.isEmpty()) {
            return folders.get(0).getId();
        }

        File fileMetadata = new File();
        fileMetadata.setName(propertyId);
        fileMetadata.setMimeType("application/vnd.google-apps.folder");
        fileMetadata.setParents(Collections.singletonList(parentFolderId));

        File folder = service.files().create(fileMetadata)
                .setFields("id")
                .execute();

        return folder.getId();
    }
}
