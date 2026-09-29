package com.vtuconnect.model;

import java.sql.Timestamp;

public class Note {
    private Long id;
    private Long subjectId;
    private int semesterId;
    private int unit;
    private String title;
    private String description;
    private String fileName;
    private String filePath;
    private long fileSize;
    private Long uploadedBy;
    private String uploaderName;
    private String status; // DRAFT, PUBLISHED, UNPUBLISHED
    private int downloadCount;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Join fields
    private String subjectCode;
    private String subjectName;
    private int semesterNumber;
    private boolean bookmarked;

    public Note() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public int getSemesterId() { return semesterId; }
    public void setSemesterId(int semesterId) { this.semesterId = semesterId; }

    public int getUnit() { return unit; }
    public void setUnit(int unit) { this.unit = unit; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public long getFileSize() { return fileSize; }
    public void setFileSize(long fileSize) { this.fileSize = fileSize; }

    public Long getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(Long uploadedBy) { this.uploadedBy = uploadedBy; }

    public String getUploaderName() { return uploaderName; }
    public void setUploaderName(String uploaderName) { this.uploaderName = uploaderName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getDownloadCount() { return downloadCount; }
    public void setDownloadCount(int downloadCount) { this.downloadCount = downloadCount; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public int getSemesterNumber() { return semesterNumber; }
    public void setSemesterNumber(int semesterNumber) { this.semesterNumber = semesterNumber; }

    public boolean isBookmarked() { return bookmarked; }
    public void setBookmarked(boolean bookmarked) { this.bookmarked = bookmarked; }
}
