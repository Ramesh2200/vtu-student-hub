package com.vtuconnect.dao;

import com.vtuconnect.model.Note;
import com.vtuconnect.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class NotesDAO {

    public List<Note> findFiltered(Integer semesterId, Long subjectId, Integer unit, String searchQuery, String status, Long currentUserId) throws SQLException {
        List<Note> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
                "SELECT n.id, n.subject_id, n.semester_id, n.unit, n.title, n.description, n.file_name, n.file_path, " +
                "n.file_size, n.uploaded_by, n.status, n.download_count, n.created_at, n.updated_at, " +
                "s.subject_code, s.subject_name, sem.semester_number, u.email as uploader_email, p.full_name as uploader_name "
        );

        if (currentUserId != null) {
            sql.append(", (SELECT COUNT(*) > 0 FROM bookmarks b WHERE b.user_id = ? AND b.resource_type = 'NOTE' AND b.resource_id = n.id) as is_bookmarked ");
        } else {
            sql.append(", FALSE as is_bookmarked ");
        }

        sql.append("FROM notes n " +
                "JOIN subjects s ON n.subject_id = s.id " +
                "JOIN semesters sem ON n.semester_id = sem.id " +
                "LEFT JOIN users u ON n.uploaded_by = u.id " +
                "LEFT JOIN profiles p ON u.id = p.user_id " +
                "WHERE 1=1 ");

        List<Object> params = new ArrayList<>();
        if (currentUserId != null) {
            params.add(currentUserId);
        }

        if (semesterId != null && semesterId > 0) {
            sql.append("AND n.semester_id = ? ");
            params.add(semesterId);
        }
        if (subjectId != null && subjectId > 0) {
            sql.append("AND n.subject_id = ? ");
            params.add(subjectId);
        }
        if (unit != null && unit > 0) {
            sql.append("AND n.unit = ? ");
            params.add(unit);
        }
        if (status != null && !status.isBlank()) {
            sql.append("AND n.status = ? ");
            params.add(status);
        } else {
            // Default only published for non-admin queries
            sql.append("AND n.status = 'PUBLISHED' ");
        }
        if (searchQuery != null && !searchQuery.isBlank()) {
            sql.append("AND (LOWER(n.title) LIKE ? OR LOWER(n.description) LIKE ? OR LOWER(s.subject_name) LIKE ? OR LOWER(s.subject_code) LIKE ?) ");
            String q = "%" + searchQuery.trim().toLowerCase() + "%";
            params.add(q);
            params.add(q);
            params.add(q);
            params.add(q);
        }

        sql.append("ORDER BY n.semester_id ASC, n.subject_id ASC, n.unit ASC, n.id DESC");

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql.toString());
            for (int i = 0; i < params.size(); i++) {
                stmt.setObject(i + 1, params.get(i));
            }
            rs = stmt.executeQuery();

            while (rs.next()) {
                Note note = mapRow(rs);
                list.add(note);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public Note findById(Long id, Long currentUserId) throws SQLException {
        StringBuilder sql = new StringBuilder(
                "SELECT n.id, n.subject_id, n.semester_id, n.unit, n.title, n.description, n.file_name, n.file_path, " +
                "n.file_size, n.uploaded_by, n.status, n.download_count, n.created_at, n.updated_at, " +
                "s.subject_code, s.subject_name, sem.semester_number, u.email as uploader_email, p.full_name as uploader_name "
        );

        if (currentUserId != null) {
            sql.append(", (SELECT COUNT(*) > 0 FROM bookmarks b WHERE b.user_id = ? AND b.resource_type = 'NOTE' AND b.resource_id = n.id) as is_bookmarked ");
        } else {
            sql.append(", FALSE as is_bookmarked ");
        }

        sql.append("FROM notes n " +
                "JOIN subjects s ON n.subject_id = s.id " +
                "JOIN semesters sem ON n.semester_id = sem.id " +
                "LEFT JOIN users u ON n.uploaded_by = u.id " +
                "LEFT JOIN profiles p ON u.id = p.user_id " +
                "WHERE n.id = ? LIMIT 1");

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql.toString());
            int idx = 1;
            if (currentUserId != null) {
                stmt.setLong(idx++, currentUserId);
            }
            stmt.setLong(idx, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                return mapRow(rs);
            }
            return null;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public Note create(Note n) throws SQLException {
        String sql = "INSERT INTO notes (subject_id, semester_id, unit, title, description, file_name, file_path, file_size, uploaded_by, status, download_count) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setLong(1, n.getSubjectId());
            stmt.setInt(2, n.getSemesterId());
            stmt.setInt(3, n.getUnit());
            stmt.setString(4, n.getTitle().trim());
            stmt.setString(5, n.getDescription());
            stmt.setString(6, n.getFileName());
            stmt.setString(7, n.getFilePath());
            stmt.setLong(8, n.getFileSize());
            if (n.getUploadedBy() != null) stmt.setLong(9, n.getUploadedBy());
            else stmt.setNull(9, java.sql.Types.BIGINT);
            stmt.setString(10, n.getStatus() != null ? n.getStatus() : "PUBLISHED");
            stmt.setInt(11, n.getDownloadCount());

            stmt.executeUpdate();
            rs = stmt.getGeneratedKeys();
            if (rs.next()) n.setId(rs.getLong(1));
            return n;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public boolean updateMetadata(Note n) throws SQLException {
        String sql = "UPDATE notes SET subject_id = ?, semester_id = ?, unit = ?, title = ?, description = ?, status = ? WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, n.getSubjectId());
            stmt.setInt(2, n.getSemesterId());
            stmt.setInt(3, n.getUnit());
            stmt.setString(4, n.getTitle().trim());
            stmt.setString(5, n.getDescription());
            stmt.setString(6, n.getStatus());
            stmt.setLong(7, n.getId());
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public boolean replaceFile(Long noteId, String fileName, String filePath, long fileSize) throws SQLException {
        String sql = "UPDATE notes SET file_name = ?, file_path = ?, file_size = ? WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, fileName);
            stmt.setString(2, filePath);
            stmt.setLong(3, fileSize);
            stmt.setLong(4, noteId);
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public boolean updateStatus(Long noteId, String status) throws SQLException {
        String sql = "UPDATE notes SET status = ? WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, status);
            stmt.setLong(2, noteId);
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public boolean delete(Long id) throws SQLException {
        String sql = "DELETE FROM notes WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, id);
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public void incrementDownloadCount(Long noteId) throws SQLException {
        String sql = "UPDATE notes SET download_count = download_count + 1 WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, noteId);
            stmt.executeUpdate();
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public int countTotalNotes() throws SQLException {
        String sql = "SELECT COUNT(*) FROM notes WHERE status = 'PUBLISHED'";
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);
            if (rs.next()) return rs.getInt(1);
            return 0;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public int countTotalDownloads() throws SQLException {
        String sql = "SELECT COALESCE(SUM(download_count), 0) FROM notes";
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);
            if (rs.next()) return rs.getInt(1);
            return 0;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    private Note mapRow(ResultSet rs) throws SQLException {
        Note note = new Note();
        note.setId(rs.getLong("id"));
        note.setSubjectId(rs.getLong("subject_id"));
        note.setSemesterId(rs.getInt("semester_id"));
        note.setUnit(rs.getInt("unit"));
        note.setTitle(rs.getString("title"));
        note.setDescription(rs.getString("description"));
        note.setFileName(rs.getString("file_name"));
        note.setFilePath(rs.getString("file_path"));
        note.setFileSize(rs.getLong("file_size"));
        note.setUploadedBy(rs.getLong("uploaded_by"));
        note.setStatus(rs.getString("status"));
        note.setDownloadCount(rs.getInt("download_count"));
        note.setCreatedAt(rs.getTimestamp("created_at"));
        note.setUpdatedAt(rs.getTimestamp("updated_at"));

        note.setSubjectCode(rs.getString("subject_code"));
        note.setSubjectName(rs.getString("subject_name"));
        note.setSemesterNumber(rs.getInt("semester_number"));
        note.setUploaderName(rs.getString("uploader_name"));
        note.setBookmarked(rs.getBoolean("is_bookmarked"));
        return note;
    }
}
