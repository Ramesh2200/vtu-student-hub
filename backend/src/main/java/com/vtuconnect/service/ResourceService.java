package com.vtuconnect.service;

import com.vtuconnect.dao.BookmarkDAO;
import com.vtuconnect.dao.DownloadDAO;
import com.vtuconnect.dao.NotesDAO;
import com.vtuconnect.dao.PreviousPaperDAO;
import com.vtuconnect.dao.QuestionBankDAO;
import com.vtuconnect.dao.SemesterDAO;
import com.vtuconnect.dao.SubjectDAO;
import com.vtuconnect.model.Bookmark;
import com.vtuconnect.model.Download;
import com.vtuconnect.model.Note;
import com.vtuconnect.model.PreviousYearPaper;
import com.vtuconnect.model.QuestionBank;
import com.vtuconnect.model.Semester;
import com.vtuconnect.model.Subject;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ResourceService {

    private final SemesterDAO semesterDAO = new SemesterDAO();
    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final NotesDAO notesDAO = new NotesDAO();
    private final QuestionBankDAO questionBankDAO = new QuestionBankDAO();
    private final PreviousPaperDAO previousPaperDAO = new PreviousPaperDAO();
    private final BookmarkDAO bookmarkDAO = new BookmarkDAO();
    private final DownloadDAO downloadDAO = new DownloadDAO();

    // Semesters
    public List<Semester> getAllSemesters() throws SQLException {
        return semesterDAO.findAll();
    }

    public Semester getSemesterById(int id) throws SQLException {
        return semesterDAO.findById(id);
    }

    public Semester getSemesterByNumber(int num) throws SQLException {
        return semesterDAO.findByNumber(num);
    }

    // Subjects
    public List<Subject> getSubjectsBySemester(int semesterId) throws SQLException {
        return subjectDAO.findBySemesterId(semesterId);
    }

    public List<Subject> getAllSubjects() throws SQLException {
        return subjectDAO.findAll();
    }

    public Subject getSubjectById(Long id) throws SQLException {
        return subjectDAO.findById(id);
    }

    // Notes
    public List<Note> getNotes(Integer semesterId, Long subjectId, Integer unit, String query, String status, Long currentUserId) throws SQLException {
        return notesDAO.findFiltered(semesterId, subjectId, unit, query, status, currentUserId);
    }

    public Note getNoteById(Long id, Long currentUserId) throws SQLException {
        return notesDAO.findById(id, currentUserId);
    }

    public void recordNoteDownload(Long noteId, Long userId, String ipAddress) throws SQLException {
        notesDAO.incrementDownloadCount(noteId);
        if (userId != null) {
            downloadDAO.recordDownload(userId, "NOTE", noteId, ipAddress);
        }
    }

    // Question Banks
    public List<QuestionBank> getQuestionBanks(Integer semesterId, Long subjectId, Integer unit, String category, String difficulty, String query, String status, Long currentUserId) throws SQLException {
        return questionBankDAO.findFiltered(semesterId, subjectId, unit, category, difficulty, query, status, currentUserId);
    }

    public QuestionBank getQuestionBankById(Long id, Long currentUserId) throws SQLException {
        return questionBankDAO.findById(id, currentUserId);
    }

    // Previous Papers
    public List<PreviousYearPaper> getPreviousPapers(Integer semesterId, Long subjectId, Integer year, String examType, String query, String status, Long currentUserId) throws SQLException {
        return previousPaperDAO.findFiltered(semesterId, subjectId, year, examType, query, status, currentUserId);
    }

    public PreviousYearPaper getPreviousPaperById(Long id, Long currentUserId) throws SQLException {
        return previousPaperDAO.findById(id, currentUserId);
    }

    public void recordPaperDownload(Long paperId, Long userId, String ipAddress) throws SQLException {
        previousPaperDAO.incrementDownloadCount(paperId);
        if (userId != null) {
            downloadDAO.recordDownload(userId, "PAPER", paperId, ipAddress);
        }
    }

    // Bookmarks
    public boolean toggleBookmark(Long userId, String resourceType, Long resourceId) throws SQLException {
        return bookmarkDAO.toggleBookmark(userId, resourceType, resourceId);
    }

    public List<Bookmark> getUserBookmarks(Long userId) throws SQLException {
        return bookmarkDAO.findByUser(userId);
    }

    // Downloads
    public List<Download> getUserDownloads(Long userId) throws SQLException {
        return downloadDAO.findByUser(userId);
    }

    // Global Search across Notes, Question Banks, and Previous Papers
    public Map<String, Object> globalSearch(String query, Long currentUserId) throws SQLException {
        Map<String, Object> results = new HashMap<>();
        results.put("notes", notesDAO.findFiltered(null, null, null, query, "PUBLISHED", currentUserId));
        results.put("questionBanks", questionBankDAO.findFiltered(null, null, null, null, null, query, "PUBLISHED", currentUserId));
        results.put("previousPapers", previousPaperDAO.findFiltered(null, null, null, null, query, "PUBLISHED", currentUserId));
        return results;
    }
}
