package com.vtuconnect.dao;

import com.vtuconnect.model.Notification;
import com.vtuconnect.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class NotificationDAO {

    public List<Notification> findByUser(Long userId) throws SQLException {
        List<Notification> list = new ArrayList<>();
        String sql = "SELECT id, user_id, title, message, type, is_read, link, created_at " +
                "FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 50";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, userId);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Notification n = new Notification();
                n.setId(rs.getLong("id"));
                n.setUserId(rs.getLong("user_id"));
                n.setTitle(rs.getString("title"));
                n.setMessage(rs.getString("message"));
                n.setType(rs.getString("type"));
                n.setRead(rs.getBoolean("is_read"));
                n.setLink(rs.getString("link"));
                n.setCreatedAt(rs.getTimestamp("created_at"));
                list.add(n);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public boolean markAsRead(Long notificationId, Long userId) throws SQLException {
        String sql = "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, notificationId);
            stmt.setLong(2, userId);
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public boolean markAllAsRead(Long userId) throws SQLException {
        String sql = "UPDATE notifications SET is_read = TRUE WHERE user_id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, userId);
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public Notification create(Notification n) throws SQLException {
        String sql = "INSERT INTO notifications (user_id, title, message, type, is_read, link) VALUES (?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setLong(1, n.getUserId());
            stmt.setString(2, n.getTitle().trim());
            stmt.setString(3, n.getMessage());
            stmt.setString(4, n.getType() != null ? n.getType() : "INFO");
            stmt.setBoolean(5, n.isRead());
            stmt.setString(6, n.getLink());
            stmt.executeUpdate();
            rs = stmt.getGeneratedKeys();
            if (rs.next()) n.setId(rs.getLong(1));
            return n;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }
}
