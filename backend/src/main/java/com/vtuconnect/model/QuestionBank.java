package com.vtuconnect.model;

import java.sql.Timestamp;

public class QuestionBank {
    private Long id;
    private Long subjectId;
    private int semesterId;
    private int unit;
    private String category; // '2 Marks', '5 Marks', '10 Marks', 'Important', 'Frequently Asked', 'Conceptual', 'Programming'
    private String difficulty; // EASY, MEDIUM, HARD
    private String questionText;
    private String answerText;
    private String fileName;
    private String filePath;
    private String status;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Join fields
    private String subjectCode;
    private String subjectName;
    private int semesterNumber;
    private boolean bookmarked;

    public QuestionBank() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public int getSemesterId() { return semesterId; }
    public void setSemesterId(int semesterId) { this.semesterId = semesterId; }

    public int getUnit() { return unit; }
    public void setUnit(int unit) { this.unit = unit; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getAnswerText() { return answerText; }
    public void setAnswerText(String answerText) { this.answerText = answerText; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

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
