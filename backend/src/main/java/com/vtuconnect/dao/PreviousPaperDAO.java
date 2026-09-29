package com.vtuconnect.dao;

import com.vtuconnect.model.PreviousYearPaper;
import com.vtuconnect.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class PreviousPaperDAO {

    public List<PreviousYearPaper> findFiltered(Integer semesterId, Long subjectId, Integer year, String examType, String searchQuery, String status, Long currentUserId) throws SQLException {
        List<PreviousYearPaper> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
                "SELECT pyp.id, pyp.subject_id, pyp.semester_id, pyp.exam_year, pyp.exam_type, pyp.title, " +
                "pyp.file_name, pyp.file_path, pyp.file_size, pyp.download_count, pyp.status, pyp.created_at, pyp.updated_at, " +
                "s.subject_code, s.subject_name, sem.semester_number "
        );

        if (currentUserId != null) {
            sql.append(", (SELECT COUNT(*) > 0 FROM bookmarks b WHERE b.user_id = ? AND b.resource_type = 'PAPER' AND b.resource_id = pyp.id) as is_bookmarked ");
        } else {
            sql.append(", FALSE as is_bookmarked ");
        }

        sql.append("FROM previous_year_papers pyp " +
                "JOIN subjects s ON pyp.subject_id = s.id " +
                "JOIN semesters sem ON pyp.semester_id = sem.id " +
                "WHERE 1=1 ");

        List<Object> params = new ArrayList<>();
        if (currentUserId != null) {
            params.add(currentUserId);
        }

        if (semesterId != null && semesterId > 0) {
            sql.append("AND pyp.semester_id = ? ");
            params.add(semesterId);
        }
        if (subjectId != null && subjectId > 0) {
            sql.append("AND pyp.subject_id = ? ");
            params.add(subjectId);
        }
        if (year != null && year > 0) {
            sql.append("AND pyp.exam_year = ? ");
            params.add(year);
        }
        if (examType != null && !examType.isBlank()) {
            sql.append("AND pyp.exam_type = ? ");
            params.add(examType);
        }
        if (status != null && !status.isBlank()) {
            sql.append("AND pyp.status = ? ");
            params.add(status);
        } else {
            sql.append("AND pyp.status = 'PUBLISHED' ");
        }
        if (searchQuery != null && !searchQuery.isBlank()) {
            sql.append("AND (LOWER(pyp.title) LIKE ? OR LOWER(s.subject_name) LIKE ? OR LOWER(s.subject_code) LIKE ?) ");
            String q = "%" + searchQuery.trim().toLowerCase() + "%";
            params.add(q);
            params.add(q);
            params.add(q);
        }

        sql.append("ORDER BY pyp.exam_year DESC, pyp.semester_id ASC, pyp.id DESC");

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
                PreviousYearPaper paper = mapRow(rs);
                list.add(paper);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public PreviousYearPaper findById(Long id, Long currentUserId) throws SQLException {
        StringBuilder sql = new StringBuilder(
                "SELECT pyp.id, pyp.subject_id, pyp.semester_id, pyp.exam_year, pyp.exam_type, pyp.title, " +
                "pyp.file_name, pyp.file_path, pyp.file_size, pyp.download_count, pyp.status, pyp.created_at, pyp.updated_at, " +
                "s.subject_code, s.subject_name, sem.semester_number "
        );

        if (currentUserId != null) {
            sql.append(", (SELECT COUNT(*) > 0 FROM bookmarks b WHERE b.user_id = ? AND b.resource_type = 'PAPER' AND b.resource_id = pyp.id) as is_bookmarked ");
        } else {
            sql.append(", FALSE as is_bookmarked ");
        }

        sql.append("FROM previous_year_papers pyp " +
                "JOIN subjects s ON pyp.subject_id = s.id " +
                "JOIN semesters sem ON pyp.semester_id = sem.id " +
                "WHERE pyp.id = ? LIMIT 1");

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

    public PreviousYearPaper create(PreviousYearPaper p) throws SQLException {
        String sql = "INSERT INTO previous_year_papers (subject_id, semester_id, exam_year, exam_type, title, file_name, file_path, file_size, download_count, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setLong(1, p.getSubjectId());
            stmt.setInt(2, p.getSemesterId());
            stmt.setInt(3, p.getExamYear());
            stmt.setString(4, p.getExamType());
            stmt.setString(5, p.getTitle().trim());
            stmt.setString(6, p.getFileName());
            stmt.setString(7, p.getFilePath());
            stmt.setLong(8, p.getFileSize());
            stmt.setInt(9, p.getDownloadCount());
            stmt.setString(10, p.getStatus() != null ? p.getStatus() : "PUBLISHED");

            stmt.executeUpdate();
            rs = stmt.getGeneratedKeys();
            if (rs.next()) p.setId(rs.getLong(1));
            return p;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public boolean update(PreviousYearPaper p) throws SQLException {
        String sql = "UPDATE previous_year_papers SET subject_id = ?, semester_id = ?, exam_year = ?, exam_type = ?, title = ?, status = ? " +
                "WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, p.getSubjectId());
            stmt.setInt(2, p.getSemesterId());
            stmt.setInt(3, p.getExamYear());
            stmt.setString(4, p.getExamType());
            stmt.setString(5, p.getTitle().trim());
            stmt.setString(6, p.getStatus());
            stmt.setLong(7, p.getId());
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public boolean replaceFile(Long paperId, String fileName, String filePath, long fileSize) throws SQLException {
        String sql = "UPDATE previous_year_papers SET file_name = ?, file_path = ?, file_size = ? WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, fileName);
            stmt.setString(2, filePath);
            stmt.setLong(3, fileSize);
            stmt.setLong(4, paperId);
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public boolean delete(Long id) throws SQLException {
        String sql = "DELETE FROM previous_year_papers WHERE id = ?";
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

    public void incrementDownloadCount(Long paperId) throws SQLException {
        String sql = "UPDATE previous_year_papers SET download_count = download_count + 1 WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, paperId);
            stmt.executeUpdate();
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public int countTotalPapers() throws SQLException {
        String sql = "SELECT COUNT(*) FROM previous_year_papers WHERE status = 'PUBLISHED'";
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

    private PreviousYearPaper mapRow(ResultSet rs) throws SQLException {
        PreviousYearPaper paper = new PreviousYearPaper();
        paper.setId(rs.getLong("id"));
        paper.setSubjectId(rs.getLong("subject_id"));
        paper.setSemesterId(rs.getInt("semester_id"));
        paper.setExamYear(rs.getInt("exam_year"));
        paper.setExamType(rs.getString("exam_type"));
        paper.setTitle(rs.getString("title"));
        paper.setFileName(rs.getString("file_name"));
        paper.setFilePath(rs.getString("file_path"));
        paper.setFileSize(rs.getLong("file_size"));
        paper.setDownloadCount(rs.getInt("download_count"));
        paper.setStatus(rs.getString("status"));
        paper.setCreatedAt(rs.getTimestamp("created_at"));
        paper.setUpdatedAt(rs.getTimestamp("updated_at"));

        paper.setSubjectCode(rs.getString("subject_code"));
        paper.setSubjectName(rs.getString("subject_name"));
        paper.setSemesterNumber(rs.getInt("semester_number"));
        paper.setBookmarked(rs.getBoolean("is_bookmarked"));
        return paper;
    }
}
