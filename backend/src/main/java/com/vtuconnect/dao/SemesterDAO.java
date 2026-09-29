package com.vtuconnect.dao;

import com.vtuconnect.model.Semester;
import com.vtuconnect.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class SemesterDAO {

    public List<Semester> findAll() throws SQLException {
        List<Semester> list = new ArrayList<>();
        String sql = "SELECT s.id, s.semester_number, s.name, s.description, s.scheme, s.is_active, s.created_at, " +
                "(SELECT COUNT(*) FROM subjects sub WHERE sub.semester_id = s.id AND sub.is_active = TRUE) as subject_count " +
                "FROM semesters s WHERE s.is_active = TRUE ORDER BY s.semester_number ASC";

        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);

            while (rs.next()) {
                Semester sem = new Semester();
                sem.setId(rs.getInt("id"));
                sem.setSemesterNumber(rs.getInt("semester_number"));
                sem.setName(rs.getString("name"));
                sem.setDescription(rs.getString("description"));
                sem.setScheme(rs.getString("scheme"));
                sem.setActive(rs.getBoolean("is_active"));
                sem.setCreatedAt(rs.getTimestamp("created_at"));
                sem.setSubjectCount(rs.getInt("subject_count"));
                list.add(sem);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public Semester findById(int id) throws SQLException {
        String sql = "SELECT s.id, s.semester_number, s.name, s.description, s.scheme, s.is_active, s.created_at, " +
                "(SELECT COUNT(*) FROM subjects sub WHERE sub.semester_id = s.id AND sub.is_active = TRUE) as subject_count " +
                "FROM semesters s WHERE s.id = ? LIMIT 1";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                Semester sem = new Semester();
                sem.setId(rs.getInt("id"));
                sem.setSemesterNumber(rs.getInt("semester_number"));
                sem.setName(rs.getString("name"));
                sem.setDescription(rs.getString("description"));
                sem.setScheme(rs.getString("scheme"));
                sem.setActive(rs.getBoolean("is_active"));
                sem.setCreatedAt(rs.getTimestamp("created_at"));
                sem.setSubjectCount(rs.getInt("subject_count"));
                return sem;
            }
            return null;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public Semester findByNumber(int semesterNumber) throws SQLException {
        String sql = "SELECT s.id, s.semester_number, s.name, s.description, s.scheme, s.is_active, s.created_at, " +
                "(SELECT COUNT(*) FROM subjects sub WHERE sub.semester_id = s.id AND sub.is_active = TRUE) as subject_count " +
                "FROM semesters s WHERE s.semester_number = ? LIMIT 1";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, semesterNumber);
            rs = stmt.executeQuery();

            if (rs.next()) {
                Semester sem = new Semester();
                sem.setId(rs.getInt("id"));
                sem.setSemesterNumber(rs.getInt("semester_number"));
                sem.setName(rs.getString("name"));
                sem.setDescription(rs.getString("description"));
                sem.setScheme(rs.getString("scheme"));
                sem.setActive(rs.getBoolean("is_active"));
                sem.setCreatedAt(rs.getTimestamp("created_at"));
                sem.setSubjectCount(rs.getInt("subject_count"));
                return sem;
            }
            return null;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public Semester create(Semester sem) throws SQLException {
        String sql = "INSERT INTO semesters (semester_number, name, description, scheme, is_active) VALUES (?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setInt(1, sem.getSemesterNumber());
            stmt.setString(2, sem.getName());
            stmt.setString(3, sem.getDescription());
            stmt.setString(4, sem.getScheme() != null ? sem.getScheme() : "2022 Scheme CBCS");
            stmt.setBoolean(5, sem.isActive());
            stmt.executeUpdate();
            rs = stmt.getGeneratedKeys();
            if (rs.next()) sem.setId(rs.getInt(1));
            return sem;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public List<Semester> findAllAdmin() throws SQLException {
        List<Semester> list = new ArrayList<>();
        String sql = "SELECT s.id, s.semester_number, s.name, s.description, s.scheme, s.is_active, s.created_at, " +
                "(SELECT COUNT(*) FROM subjects sub WHERE sub.semester_id = s.id) as subject_count " +
                "FROM semesters s ORDER BY s.semester_number ASC";

        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);

            while (rs.next()) {
                Semester sem = new Semester();
                sem.setId(rs.getInt("id"));
                sem.setSemesterNumber(rs.getInt("semester_number"));
                sem.setName(rs.getString("name"));
                sem.setDescription(rs.getString("description"));
                sem.setScheme(rs.getString("scheme"));
                sem.setActive(rs.getBoolean("is_active"));
                sem.setCreatedAt(rs.getTimestamp("created_at"));
                sem.setSubjectCount(rs.getInt("subject_count"));
                list.add(sem);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public boolean update(Semester sem) throws SQLException {
        String sql = "UPDATE semesters SET name = ?, description = ?, scheme = ?, is_active = ? WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, sem.getName());
            stmt.setString(2, sem.getDescription());
            stmt.setString(3, sem.getScheme());
            stmt.setBoolean(4, sem.isActive());
            stmt.setInt(5, sem.getId());
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public boolean toggleActive(int id, boolean active) throws SQLException {
        String sql = "UPDATE semesters SET is_active = ? WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setBoolean(1, active);
            stmt.setInt(2, id);
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public boolean delete(int id) throws SQLException {
        String sql = "DELETE FROM semesters WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }
}
