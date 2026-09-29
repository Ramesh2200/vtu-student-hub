package com.vtuconnect.model;

import java.sql.Timestamp;

public class Download {
    private Long id;
    private Long userId;
    private String resourceType; // NOTE, QUESTION_BANK, PAPER
    private Long resourceId;
    private String ipAddress;
    private Timestamp downloadedAt;

    // Join fields
    private String title;
    private String fileName;
    private long fileSize;
    private String subjectCode;

    public Download() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public Long getResourceId() { return resourceId; }
    public void setResourceId(Long resourceId) { this.resourceId = resourceId; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public Timestamp getDownloadedAt() { return downloadedAt; }
    public void setDownloadedAt(Timestamp downloadedAt) { this.downloadedAt = downloadedAt; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public long getFileSize() { return fileSize; }
    public void setFileSize(long fileSize) { this.fileSize = fileSize; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
}
