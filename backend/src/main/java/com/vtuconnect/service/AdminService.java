package com.vtuconnect.service;

import com.vtuconnect.dao.AdvertisementDAO;
import com.vtuconnect.dao.AnnouncementDAO;
import com.vtuconnect.dao.AuditLogDAO;
import com.vtuconnect.dao.ChatDAO;
import com.vtuconnect.dao.NotesDAO;
import com.vtuconnect.dao.PlacementDAO;
import com.vtuconnect.dao.PreviousPaperDAO;
import com.vtuconnect.dao.QuestionBankDAO;
import com.vtuconnect.dao.SemesterDAO;
import com.vtuconnect.dao.SubjectDAO;
import com.vtuconnect.dao.UserDAO;
import com.vtuconnect.model.Advertisement;
import com.vtuconnect.model.Announcement;
import com.vtuconnect.model.AuditLog;
import com.vtuconnect.model.Note;
import com.vtuconnect.model.Placement;
import com.vtuconnect.model.PreviousYearPaper;
import com.vtuconnect.model.QuestionBank;
import com.vtuconnect.model.Semester;
import com.vtuconnect.model.Subject;
import com.vtuconnect.model.User;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AdminService {

    private final UserDAO userDAO = new UserDAO();
    private final NotesDAO notesDAO = new NotesDAO();
    private final QuestionBankDAO questionBankDAO = new QuestionBankDAO();
    private final PreviousPaperDAO previousPaperDAO = new PreviousPaperDAO();
    private final PlacementDAO placementDAO = new PlacementDAO();
    private final ChatDAO chatDAO = new ChatDAO();
    private final AdvertisementDAO advertisementDAO = new AdvertisementDAO();
    private final AnnouncementDAO announcementDAO = new AnnouncementDAO();
    private final AuditLogDAO auditLogDAO = new AuditLogDAO();
    private final SemesterDAO semesterDAO = new SemesterDAO();
    private final SubjectDAO subjectDAO = new SubjectDAO();

    public Map<String, Object> getDashboardStats() throws SQLException {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", userDAO.countTotalStudents());
        stats.put("totalNotes", notesDAO.countTotalNotes());
        stats.put("totalQuestionBanks", questionBankDAO.countTotalQuestionBanks());
        stats.put("totalPreviousPapers", previousPaperDAO.countTotalPapers());
        stats.put("totalPlacements", placementDAO.countTotalPlacements());
        stats.put("totalDownloads", notesDAO.countTotalDownloads());
        stats.put("totalChatMessages", chatDAO.countTotalMessages());
        stats.put("activeAdvertisements", advertisementDAO.countActiveAds());
        return stats;
    }

    // Notes
    public Note createNote(Note note, Long adminId, String ip) throws SQLException {
        Note created = notesDAO.create(note);
        auditLogDAO.log(adminId, "NOTE_UPLOAD", "NOTE", created.getId(), "Uploaded note: " + created.getTitle(), ip);
        return created;
    }

    public boolean updateNote(Note note, Long adminId, String ip) throws SQLException {
        boolean ok = notesDAO.updateMetadata(note);
        auditLogDAO.log(adminId, "NOTE_UPDATE", "NOTE", note.getId(), "Updated metadata for note: " + note.getTitle(), ip);
        return ok;
    }

    public boolean replaceNoteFile(Long noteId, String fileName, String filePath, long fileSize, Long adminId, String ip) throws SQLException {
        boolean ok = notesDAO.replaceFile(noteId, fileName, filePath, fileSize);
        auditLogDAO.log(adminId, "NOTE_FILE_REPLACE", "NOTE", noteId, "Replaced PDF file: " + fileName, ip);
        return ok;
    }

    public boolean replacePaperFile(Long paperId, String fileName, String filePath, long fileSize, Long adminId, String ip) throws SQLException {
        boolean ok = previousPaperDAO.replaceFile(paperId, fileName, filePath, fileSize);
        auditLogDAO.log(adminId, "PAPER_FILE_REPLACE", "PAPER", paperId, "Replaced PDF file: " + fileName, ip);
        return ok;
    }

    public boolean deleteNote(Long noteId, Long adminId, String ip) throws SQLException {
        boolean ok = notesDAO.delete(noteId);
        auditLogDAO.log(adminId, "NOTE_DELETE", "NOTE", noteId, "Deleted note ID: " + noteId, ip);
        return ok;
    }

    public boolean toggleNoteStatus(Long noteId, String status, Long adminId, String ip) throws SQLException {
        boolean ok = notesDAO.updateStatus(noteId, status);
        auditLogDAO.log(adminId, "NOTE_STATUS_CHANGE", "NOTE", noteId, "Status changed to: " + status, ip);
        return ok;
    }

    // Question Banks
    public QuestionBank createQuestionBank(QuestionBank qb, Long adminId, String ip) throws SQLException {
        QuestionBank created = questionBankDAO.create(qb);
        auditLogDAO.log(adminId, "QUESTION_BANK_CREATE", "QUESTION_BANK", created.getId(), "Created QB item", ip);
        return created;
    }

    public boolean updateQuestionBank(QuestionBank qb, Long adminId, String ip) throws SQLException {
        boolean ok = questionBankDAO.update(qb);
        auditLogDAO.log(adminId, "QUESTION_BANK_UPDATE", "QUESTION_BANK", qb.getId(), "Updated QB ID: " + qb.getId(), ip);
        return ok;
    }

    public boolean deleteQuestionBank(Long id, Long adminId, String ip) throws SQLException {
        boolean ok = questionBankDAO.delete(id);
        auditLogDAO.log(adminId, "QUESTION_BANK_DELETE", "QUESTION_BANK", id, "Deleted QB ID: " + id, ip);
        return ok;
    }

    // Previous Papers
    public PreviousYearPaper createPaper(PreviousYearPaper p, Long adminId, String ip) throws SQLException {
        PreviousYearPaper created = previousPaperDAO.create(p);
        auditLogDAO.log(adminId, "PAPER_UPLOAD", "PAPER", created.getId(), "Uploaded paper: " + created.getTitle(), ip);
        return created;
    }

    public boolean updatePaper(PreviousYearPaper p, Long adminId, String ip) throws SQLException {
        boolean ok = previousPaperDAO.update(p);
        auditLogDAO.log(adminId, "PAPER_UPDATE", "PAPER", p.getId(), "Updated paper ID: " + p.getId(), ip);
        return ok;
    }

    public boolean deletePaper(Long id, Long adminId, String ip) throws SQLException {
        boolean ok = previousPaperDAO.delete(id);
        auditLogDAO.log(adminId, "PAPER_DELETE", "PAPER", id, "Deleted paper ID: " + id, ip);
        return ok;
    }

    // Placements
    public Placement createPlacement(Placement p, Long adminId, String ip) throws SQLException {
        Placement created = placementDAO.create(p);
        auditLogDAO.log(adminId, "PLACEMENT_CREATE", "PLACEMENT", created.getId(), "Created drive: " + created.getCompanyName(), ip);
        return created;
    }

    public boolean updatePlacement(Placement p, Long adminId, String ip) throws SQLException {
        boolean ok = placementDAO.update(p);
        auditLogDAO.log(adminId, "PLACEMENT_UPDATE", "PLACEMENT", p.getId(), "Updated drive: " + p.getCompanyName(), ip);
        return ok;
    }

    public boolean deletePlacement(Long id, Long adminId, String ip) throws SQLException {
        boolean ok = placementDAO.delete(id);
        auditLogDAO.log(adminId, "PLACEMENT_DELETE", "PLACEMENT", id, "Deleted placement ID: " + id, ip);
        return ok;
    }

    // Advertisements
    public Advertisement createAd(Advertisement ad, Long adminId, String ip) throws SQLException {
        Advertisement created = advertisementDAO.create(ad);
        auditLogDAO.log(adminId, "ADVERTISEMENT_CREATE", "ADVERTISEMENT", created.getId(), "Created ad: " + created.getTitle(), ip);
        return created;
    }

    public boolean updateAd(Advertisement ad, Long adminId, String ip) throws SQLException {
        boolean ok = advertisementDAO.update(ad);
        auditLogDAO.log(adminId, "ADVERTISEMENT_UPDATE", "ADVERTISEMENT", ad.getId(), "Updated ad: " + ad.getTitle(), ip);
        return ok;
    }

    public boolean deleteAd(Long id, Long adminId, String ip) throws SQLException {
        boolean ok = advertisementDAO.delete(id);
        auditLogDAO.log(adminId, "ADVERTISEMENT_DELETE", "ADVERTISEMENT", id, "Deleted ad ID: " + id, ip);
        return ok;
    }

    // Announcements
    public Announcement createAnnouncement(Announcement a, Long adminId, String ip) throws SQLException {
        Announcement created = announcementDAO.create(a);
        auditLogDAO.log(adminId, "ANNOUNCEMENT_CREATE", "ANNOUNCEMENT", created.getId(), "Created announcement: " + created.getTitle(), ip);
        return created;
    }

    public boolean updateAnnouncement(Announcement a, Long adminId, String ip) throws SQLException {
        boolean ok = announcementDAO.update(a);
        auditLogDAO.log(adminId, "ANNOUNCEMENT_UPDATE", "ANNOUNCEMENT", a.getId(), "Updated announcement ID: " + a.getId(), ip);
        return ok;
    }

    public boolean deleteAnnouncement(Long id, Long adminId, String ip) throws SQLException {
        boolean ok = announcementDAO.delete(id);
        auditLogDAO.log(adminId, "ANNOUNCEMENT_DELETE", "ANNOUNCEMENT", id, "Deleted announcement ID: " + id, ip);
        return ok;
    }

    // Users
    public List<User> getAllUsers() throws SQLException {
        return userDAO.findAll();
    }

    public boolean updateUserStatus(Long userId, String status, Long adminId, String ip) throws SQLException {
        boolean ok = userDAO.updateStatus(userId, status);
        auditLogDAO.log(adminId, "USER_STATUS_UPDATE", "USER", userId, "Changed user status to: " + status, ip);
        return ok;
    }

    // Audit logs
    public List<AuditLog> getAuditLogs(int limit) throws SQLException {
        return auditLogDAO.findAll(limit);
    }

    // Semesters & Subjects management
    public List<Semester> getAllSemestersAdmin() throws SQLException {
        return semesterDAO.findAllAdmin();
    }

    public Semester createSemester(Semester s, Long adminId, String ip) throws SQLException {
        Semester created = semesterDAO.create(s);
        auditLogDAO.log(adminId, "SEMESTER_CREATE", "SEMESTER", (long) created.getId(), "Created semester: " + created.getName(), ip);
        return created;
    }

    public boolean updateSemester(Semester s, Long adminId, String ip) throws SQLException {
        boolean ok = semesterDAO.update(s);
        auditLogDAO.log(adminId, "SEMESTER_UPDATE", "SEMESTER", (long) s.getId(), "Updated semester: " + s.getName(), ip);
        return ok;
    }

    public boolean toggleSemesterActive(int id, boolean active, Long adminId, String ip) throws SQLException {
        boolean ok = semesterDAO.toggleActive(id, active);
        auditLogDAO.log(adminId, "SEMESTER_STATUS_CHANGE", "SEMESTER", (long) id, "Changed status to: " + (active ? "ACTIVE" : "INACTIVE"), ip);
        return ok;
    }

    public boolean deleteSemester(int id, Long adminId, String ip) throws SQLException {
        boolean ok = semesterDAO.delete(id);
        auditLogDAO.log(adminId, "SEMESTER_DELETE", "SEMESTER", (long) id, "Deleted semester ID: " + id, ip);
        return ok;
    }

    public Subject createSubject(Subject s, Long adminId, String ip) throws SQLException {
        Subject created = subjectDAO.create(s);
        auditLogDAO.log(adminId, "SUBJECT_CREATE", "SUBJECT", created.getId(), "Created subject: " + created.getSubjectCode(), ip);
        return created;
    }

    public boolean updateSubject(Subject s, Long adminId, String ip) throws SQLException {
        boolean ok = subjectDAO.update(s);
        auditLogDAO.log(adminId, "SUBJECT_UPDATE", "SUBJECT", s.getId(), "Updated subject: " + s.getSubjectCode(), ip);
        return ok;
    }

    public boolean deleteSubject(Long id, Long adminId, String ip) throws SQLException {
        boolean ok = subjectDAO.delete(id);
        auditLogDAO.log(adminId, "SUBJECT_DELETE", "SUBJECT", id, "Deleted subject ID: " + id, ip);
        return ok;
    }
}
