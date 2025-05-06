package com.rently.rentlybackend.service;

import com.google.api.client.http.FileContent;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.FileList;
import com.rently.rentlybackend.model.User;
import com.rently.rentlybackend.repository.PropertyRepository;
import com.rently.rentlybackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoogleDriveUploaderService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final GoogleDriveService googleDriveService;

    public String uploadFileToDrive(UUID propertyId, java.io.File file, String currentUserUsername) throws Exception {
        User user = userRepository
                .findUserByEmail(currentUserUsername)
                .orElseThrow(() -> new UsernameNotFoundException("wrong user"));
        if (!propertyRepository.existsPropertyByIdAndUser(propertyId, user)) {
            throw new IllegalArgumentException("wrong property id");
        }


        Drive service = googleDriveService.getDriveService();
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

    public List<com.google.api.services.drive.model.File> listFilesInFolder(String folderId) throws IOException, GeneralSecurityException {
        Drive drive = googleDriveService.getDriveService();
        String query = "'" + folderId + "' in parents and trashed = false";

        FileList result = drive.files().list()
                .setQ(query)
                .setFields("files(id, name, mimeType)")
                .execute();

        return result.getFiles();
    }

    public String findFolderIdByPropertyId(UUID propertyId) throws Exception {
        String parentFolderId = "1S5aQ35FUsZeU8brYNAScFc0dCucvOAg1";
        Drive drive = googleDriveService.getDriveService();

        String query = "name = '" + propertyId + "' and mimeType = 'application/vnd.google-apps.folder' and '" + parentFolderId + "' in parents and trashed = false";

        List<File> folders = drive.files().list()
                .setQ(query)
                .setFields("files(id)")
                .execute()
                .getFiles();

        if (folders.isEmpty()) {
            throw new RuntimeException("Folder not found for property: " + propertyId);
        }

        return folders.get(0).getId();
    }

    public ByteArrayOutputStream getByteArrayOutputStream(String fileId) throws GeneralSecurityException, IOException {
        Drive drive = googleDriveService.getDriveService();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        drive.files().get(fileId).executeMediaAndDownloadTo(outputStream);
        return outputStream;
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
