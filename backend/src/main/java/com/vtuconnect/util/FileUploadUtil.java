package com.vtuconnect.util;

import jakarta.servlet.http.Part;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * File upload validation and storage utility for PDF notes and documents.
 * Ensures security: only PDF files, checks file size, sanitizes file names,
 * and prevents directory traversal vulnerabilities.
 */
public class FileUploadUtil {

    private static final long MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB max
    private static final String UPLOAD_ROOT = System.getProperty("user.dir") + File.separator + "uploads";

    static {
        File dir = new File(UPLOAD_ROOT);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        new File(UPLOAD_ROOT + File.separator + "notes").mkdirs();
        new File(UPLOAD_ROOT + File.separator + "papers").mkdirs();
        new File(UPLOAD_ROOT + File.separator + "resumes").mkdirs();
    }

    public static class UploadResult {
        private final String originalFileName;
        private final String storedFileName;
        private final String relativeFilePath;
        private final long fileSize;

        public UploadResult(String originalFileName, String storedFileName, String relativeFilePath, long fileSize) {
            this.originalFileName = originalFileName;
            this.storedFileName = storedFileName;
            this.relativeFilePath = relativeFilePath;
            this.fileSize = fileSize;
        }

        public String getOriginalFileName() { return originalFileName; }
        public String getStoredFileName() { return storedFileName; }
        public String getRelativeFilePath() { return relativeFilePath; }
        public long getFileSize() { return fileSize; }
    }

    /**
     * Validates and saves an uploaded PDF Part to the specified subfolder.
     */
    public static UploadResult savePdf(Part filePart, String subFolder) throws IOException, IllegalArgumentException {
        if (filePart == null || filePart.getSize() == 0) {
            throw new IllegalArgumentException("No file provided for upload");
        }

        if (filePart.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 25 MB limit");
        }

        String submittedFileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
        if (submittedFileName == null || !submittedFileName.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF (.pdf) documents are accepted");
        }

        // Clean file name
        String safeName = submittedFileName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String uniqueFileName = UUID.randomUUID().toString().substring(0, 8) + "_" + safeName;

        Path targetDir = Paths.get(UPLOAD_ROOT, subFolder);
        if (!Files.exists(targetDir)) {
            Files.createDirectories(targetDir);
        }

        Path targetPath = targetDir.resolve(uniqueFileName).normalize();
        // Prevent path traversal
        if (!targetPath.startsWith(targetDir)) {
            throw new SecurityException("Directory traversal attempt detected in filename");
        }

        try (InputStream inputStream = filePart.getInputStream()) {
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }

        String relativePath = "/uploads/" + subFolder + "/" + uniqueFileName;
        return new UploadResult(submittedFileName, uniqueFileName, relativePath, filePart.getSize());
    }

    public static String getUploadRoot() {
        return UPLOAD_ROOT;
    }
}
