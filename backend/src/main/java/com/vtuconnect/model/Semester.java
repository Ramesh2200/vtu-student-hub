package com.vtuconnect.model;

import java.sql.Timestamp;
import java.util.List;

public class Semester {
    private int id;
    private int semesterNumber;
    private String name;
    private String description;
    private String scheme;
    private boolean active;
    private Timestamp createdAt;
    private int subjectCount;
    private List<Subject> subjects;

    public Semester() {}

    public Semester(int id, int semesterNumber, String name, String description, String scheme, boolean active) {
        this.id = id;
        this.semesterNumber = semesterNumber;
        this.name = name;
        this.description = description;
        this.scheme = scheme;
        this.active = active;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getSemesterNumber() { return semesterNumber; }
    public void setSemesterNumber(int semesterNumber) { this.semesterNumber = semesterNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getScheme() { return scheme; }
    public void setScheme(String scheme) { this.scheme = scheme; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public int getSubjectCount() { return subjectCount; }
    public void setSubjectCount(int subjectCount) { this.subjectCount = subjectCount; }

    public List<Subject> getSubjects() { return subjects; }
    public void setSubjects(List<Subject> subjects) { this.subjects = subjects; }
}
