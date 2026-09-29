package com.vtuconnect.dao;

import com.vtuconnect.model.Subject;
import com.vtuconnect.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class SubjectDAO {

    public List<Subject> findBySemesterId(int semesterId) throws SQLException {
        List<Subject> list = new ArrayList<>();
        String sql = "SELECT s.id, s.semester_id, s.subject_code, s.subject_name, s.branch, s.scheme, s.credits, s.description, s.is_active, s.created_at, s.updated_at, " +
                "(SELECT COUNT(*) FROM notes n WHERE n.subject_id = s.id AND n.status = 'PUBLISHED') as notes_count, " +
                "(SELECT COUNT(*) FROM question_banks qb WHERE qb.subject_id = s.id AND qb.status = 'PUBLISHED') as qb_count, " +
                "(SELECT COUNT(*) FROM previous_year_papers pyp WHERE pyp.subject_id = s.id AND pyp.status = 'PUBLISHED') as papers_count " +
                "FROM subjects s WHERE s.semester_id = ? AND s.is_active = TRUE ORDER BY s.subject_code ASC";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, semesterId);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Subject sub = new Subject();
                sub.setId(rs.getLong("id"));
                sub.setSemesterId(rs.getInt("semester_id"));
                sub.setSubjectCode(rs.getString("subject_code"));
                sub.setSubjectName(rs.getString("subject_name"));
                sub.setBranch(rs.getString("branch"));
                sub.setScheme(rs.getString("scheme"));
                sub.setCredits(rs.getInt("credits"));
                sub.setDescription(rs.getString("description"));
                sub.setActive(rs.getBoolean("is_active"));
                sub.setCreatedAt(rs.getTimestamp("created_at"));
                sub.setUpdatedAt(rs.getTimestamp("updated_at"));
                sub.setNotesCount(rs.getInt("notes_count"));
                sub.setQuestionBankCount(rs.getInt("qb_count"));
                sub.setPapersCount(rs.getInt("papers_count"));
                list.add(sub);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public List<Subject> findAll() throws SQLException {
        List<Subject> list = new ArrayList<>();
        String sql = "SELECT s.id, s.semester_id, s.subject_code, s.subject_name, s.branch, s.scheme, s.credits, s.description, s.is_active, s.created_at, s.updated_at, " +
                "(SELECT COUNT(*) FROM notes n WHERE n.subject_id = s.id) as notes_count, " +
                "(SELECT COUNT(*) FROM question_banks qb WHERE qb.subject_id = s.id) as qb_count, " +
                "(SELECT COUNT(*) FROM previous_year_papers pyp WHERE pyp.subject_id = s.id) as papers_count " +
                "FROM subjects s ORDER BY s.semester_id ASC, s.subject_code ASC";

        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);

            while (rs.next()) {
                Subject sub = new Subject();
                sub.setId(rs.getLong("id"));
                sub.setSemesterId(rs.getInt("semester_id"));
                sub.setSubjectCode(rs.getString("subject_code"));
                sub.setSubjectName(rs.getString("subject_name"));
                sub.setBranch(rs.getString("branch"));
                sub.setScheme(rs.getString("scheme"));
                sub.setCredits(rs.getInt("credits"));
                sub.setDescription(rs.getString("description"));
                sub.setActive(rs.getBoolean("is_active"));
                sub.setCreatedAt(rs.getTimestamp("created_at"));
                sub.setUpdatedAt(rs.getTimestamp("updated_at"));
                sub.setNotesCount(rs.getInt("notes_count"));
                sub.setQuestionBankCount(rs.getInt("qb_count"));
                sub.setPapersCount(rs.getInt("papers_count"));
                list.add(sub);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public Subject findById(Long id) throws SQLException {
        String sql = "SELECT s.id, s.semester_id, s.subject_code, s.subject_name, s.branch, s.scheme, s.credits, s.description, s.is_active, s.created_at, s.updated_at, " +
                "(SELECT COUNT(*) FROM notes n WHERE n.subject_id = s.id AND n.status = 'PUBLISHED') as notes_count, " +
                "(SELECT COUNT(*) FROM question_banks qb WHERE qb.subject_id = s.id AND qb.status = 'PUBLISHED') as qb_count, " +
                "(SELECT COUNT(*) FROM previous_year_papers pyp WHERE pyp.subject_id = s.id AND pyp.status = 'PUBLISHED') as papers_count " +
                "FROM subjects s WHERE s.id = ? LIMIT 1";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                Subject sub = new Subject();
                sub.setId(rs.getLong("id"));
                sub.setSemesterId(rs.getInt("semester_id"));
                sub.setSubjectCode(rs.getString("subject_code"));
                sub.setSubjectName(rs.getString("subject_name"));
                sub.setBranch(rs.getString("branch"));
                sub.setScheme(rs.getString("scheme"));
                sub.setCredits(rs.getInt("credits"));
                sub.setDescription(rs.getString("description"));
                sub.setActive(rs.getBoolean("is_active"));
                sub.setCreatedAt(rs.getTimestamp("created_at"));
                sub.setUpdatedAt(rs.getTimestamp("updated_at"));
                sub.setNotesCount(rs.getInt("notes_count"));
                sub.setQuestionBankCount(rs.getInt("qb_count"));
                sub.setPapersCount(rs.getInt("papers_count"));
                return sub;
            }
            return null;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public Subject create(Subject s) throws SQLException {
        String sql = "INSERT INTO subjects (semester_id, subject_code, subject_name, branch, scheme, credits, description, is_active) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setInt(1, s.getSemesterId());
            stmt.setString(2, s.getSubjectCode().trim().toUpperCase());
            stmt.setString(3, s.getSubjectName().trim());
            stmt.setString(4, s.getBranch());
            stmt.setString(5, s.getScheme() != null ? s.getScheme() : "2022 Scheme CBCS");
            stmt.setInt(6, s.getCredits());
            stmt.setString(7, s.getDescription());
            stmt.setBoolean(8, s.isActive());
            stmt.executeUpdate();
            rs = stmt.getGeneratedKeys();
            if (rs.next()) s.setId(rs.getLong(1));
            return s;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public boolean update(Subject s) throws SQLException {
        String sql = "UPDATE subjects SET semester_id = ?, subject_code = ?, subject_name = ?, branch = ?, scheme = ?, credits = ?, description = ?, is_active = ? " +
                "WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, s.getSemesterId());
            stmt.setString(2, s.getSubjectCode().trim().toUpperCase());
            stmt.setString(3, s.getSubjectName().trim());
            stmt.setString(4, s.getBranch());
            stmt.setString(5, s.getScheme());
            stmt.setInt(6, s.getCredits());
            stmt.setString(7, s.getDescription());
            stmt.setBoolean(8, s.isActive());
            stmt.setLong(9, s.getId());
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public boolean delete(Long id) throws SQLException {
        String sql = "DELETE FROM subjects WHERE id = ?";
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
}
