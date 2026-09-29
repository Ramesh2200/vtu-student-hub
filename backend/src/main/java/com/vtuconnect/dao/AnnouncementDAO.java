package com.vtuconnect.dao;

import com.vtuconnect.model.Announcement;
import com.vtuconnect.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class AnnouncementDAO {

    public List<Announcement> findActive() throws SQLException {
        List<Announcement> list = new ArrayList<>();
        String sql = "SELECT id, title, content, target_audience, priority, is_active, created_at, updated_at " +
                "FROM announcements WHERE is_active = TRUE ORDER BY id DESC";

        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);

            while (rs.next()) {
                list.add(mapRow(rs));
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public List<Announcement> findAll() throws SQLException {
        List<Announcement> list = new ArrayList<>();
        String sql = "SELECT id, title, content, target_audience, priority, is_active, created_at, updated_at " +
                "FROM announcements ORDER BY id DESC";

        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);

            while (rs.next()) {
                list.add(mapRow(rs));
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public Announcement create(Announcement a) throws SQLException {
        String sql = "INSERT INTO announcements (title, content, target_audience, priority, is_active) VALUES (?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1, a.getTitle().trim());
            stmt.setString(2, a.getContent());
            stmt.setString(3, a.getTargetAudience() != null ? a.getTargetAudience() : "ALL");
            stmt.setString(4, a.getPriority() != null ? a.getPriority() : "NORMAL");
            stmt.setBoolean(5, a.isActive());
            stmt.executeUpdate();
            rs = stmt.getGeneratedKeys();
            if (rs.next()) a.setId(rs.getLong(1));
            return a;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public boolean update(Announcement a) throws SQLException {
        String sql = "UPDATE announcements SET title = ?, content = ?, target_audience = ?, priority = ?, is_active = ? WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, a.getTitle().trim());
            stmt.setString(2, a.getContent());
            stmt.setString(3, a.getTargetAudience());
            stmt.setString(4, a.getPriority());
            stmt.setBoolean(5, a.isActive());
            stmt.setLong(6, a.getId());
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public boolean delete(Long id) throws SQLException {
        String sql = "DELETE FROM announcements WHERE id = ?";
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

    private Announcement mapRow(ResultSet rs) throws SQLException {
        Announcement a = new Announcement();
        a.setId(rs.getLong("id"));
        a.setTitle(rs.getString("title"));
        a.setContent(rs.getString("content"));
        a.setTargetAudience(rs.getString("target_audience"));
        a.setPriority(rs.getString("priority"));
        a.setActive(rs.getBoolean("is_active"));
        a.setCreatedAt(rs.getTimestamp("created_at"));
        a.setUpdatedAt(rs.getTimestamp("updated_at"));
        return a;
    }
}
