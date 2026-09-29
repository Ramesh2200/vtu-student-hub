package com.vtuconnect.model;

import java.sql.Timestamp;

public class Subject {
    private Long id;
    private int semesterId;
    private String subjectCode;
    private String subjectName;
    private String branch;
    private String scheme;
    private int credits;
    private String description;
    private boolean active;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private int notesCount;
    private int questionBankCount;
    private int papersCount;

    public Subject() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getSemesterId() { return semesterId; }
    public void setSemesterId(int semesterId) { this.semesterId = semesterId; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getScheme() { return scheme; }
    public void setScheme(String scheme) { this.scheme = scheme; }

    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }

    public int getNotesCount() { return notesCount; }
    public void setNotesCount(int notesCount) { this.notesCount = notesCount; }

    public int getQuestionBankCount() { return questionBankCount; }
    public void setQuestionBankCount(int questionBankCount) { this.questionBankCount = questionBankCount; }

    public int getPapersCount() { return papersCount; }
    public void setPapersCount(int papersCount) { this.papersCount = papersCount; }
}
