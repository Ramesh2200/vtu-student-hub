package com.vtuconnect.model;

import java.sql.Date;
import java.sql.Timestamp;

public class Placement {
    private Long id;
    private String companyName;
    private String jobRole;
    private String description;
    private String location;
    private String ctc;
    private String eligibility;
    private String requiredSkills;
    private String batch;
    private String applicationLink;
    private Date lastDate;
    private String status; // OPEN, CLOSED, UPCOMING, UNPUBLISHED
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Computed / join fields
    private int applicantCount;
    private boolean hasApplied;
    private String userApplicationStatus;

    public Placement() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCtc() { return ctc; }
    public void setCtc(String ctc) { this.ctc = ctc; }

    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }

    public String getApplicationLink() { return applicationLink; }
    public void setApplicationLink(String applicationLink) { this.applicationLink = applicationLink; }

    public Date getLastDate() { return lastDate; }
    public void setLastDate(Date lastDate) { this.lastDate = lastDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }

    public int getApplicantCount() { return applicantCount; }
    public void setApplicantCount(int applicantCount) { this.applicantCount = applicantCount; }

    public boolean isHasApplied() { return hasApplied; }
    public void setHasApplied(boolean hasApplied) { this.hasApplied = hasApplied; }

    public String getUserApplicationStatus() { return userApplicationStatus; }
    public void setUserApplicationStatus(String userApplicationStatus) { this.userApplicationStatus = userApplicationStatus; }
}
