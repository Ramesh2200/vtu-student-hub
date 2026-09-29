package com.vtuconnect.model;

import java.sql.Date;
import java.sql.Timestamp;

public class Advertisement {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String targetUrl;
    private Date startDate;
    private Date endDate;
    private boolean active;
    private String displayPosition;
    private int impressions;
    private int clicks;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    public Advertisement() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getTargetUrl() { return targetUrl; }
    public void setTargetUrl(String targetUrl) { this.targetUrl = targetUrl; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public String getDisplayPosition() { return displayPosition; }
    public void setDisplayPosition(String displayPosition) { this.displayPosition = displayPosition; }

    public int getImpressions() { return impressions; }
    public void setImpressions(int impressions) { this.impressions = impressions; }

    public int getClicks() { return clicks; }
    public void setClicks(int clicks) { this.clicks = clicks; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }
}
