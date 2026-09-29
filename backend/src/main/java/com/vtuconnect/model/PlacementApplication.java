package com.vtuconnect.model;

import java.sql.Timestamp;

public class PlacementApplication {
    private Long id;
    private Long placementId;
    private Long userId;
    private String status; // APPLIED, SHORTLISTED, INTERVIEW_ROUND, OFFERED, REJECTED
    private Timestamp appliedAt;
    private String resumeLink;
    private String notes;
    private Timestamp updatedAt;

    // Join fields
    private String companyName;
    private String jobRole;
    private String location;
    private String ctc;
    private String studentName;
    private String studentEmail;
    private String studentUsn;
    private String studentCollege;
    private String studentBranch;

    public PlacementApplication() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPlacementId() { return placementId; }
    public void setPlacementId(Long placementId) { this.placementId = placementId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getAppliedAt() { return appliedAt; }
    public void setAppliedAt(Timestamp appliedAt) { this.appliedAt = appliedAt; }

    public String getResumeLink() { return resumeLink; }
    public void setResumeLink(String resumeLink) { this.resumeLink = resumeLink; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCtc() { return ctc; }
    public void setCtc(String ctc) { this.ctc = ctc; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentUsn() { return studentUsn; }
    public void setStudentUsn(String studentUsn) { this.studentUsn = studentUsn; }

    public String getStudentCollege() { return studentCollege; }
    public void setStudentCollege(String studentCollege) { this.studentCollege = studentCollege; }

    public String getStudentBranch() { return studentBranch; }
    public void setStudentBranch(String studentBranch) { this.studentBranch = studentBranch; }
}
