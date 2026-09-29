package com.vtuconnect.model;

import java.sql.Timestamp;

public class Subject {
    private Long id;
    private int semesterId;
    private String subjectCode;
    private String subjectName;
    private String code;
    private String name;
    private String branch;
    private String department;
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

    public String getSubjectCode() { 
        return subjectCode != null ? subjectCode : code; 
    }
    public void setSubjectCode(String subjectCode) { 
        this.subjectCode = subjectCode; 
        this.code = subjectCode;
    }

    public String getCode() { 
        return code != null ? code : subjectCode; 
    }
    public void setCode(String code) { 
        this.code = code; 
        this.subjectCode = code;
    }

    public String getSubjectName() { 
        return subjectName != null ? subjectName : name; 
    }
    public void setSubjectName(String subjectName) { 
        this.subjectName = subjectName; 
        this.name = subjectName;
    }

    public String getName() { 
        return name != null ? name : subjectName; 
    }
    public void setName(String name) { 
        this.name = name; 
        this.subjectName = name;
    }

    public String getBranch() { 
        return branch != null ? branch : department; 
    }
    public void setBranch(String branch) { 
        this.branch = branch; 
        this.department = branch;
    }

    public String getDepartment() { 
        return department != null ? department : branch; 
    }
    public void setDepartment(String department) { 
        this.department = department; 
        this.branch = department;
    }

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
