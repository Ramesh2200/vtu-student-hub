package com.vtuconnect.dao;

import com.vtuconnect.model.Bookmark;
import com.vtuconnect.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class BookmarkDAO {

    public boolean toggleBookmark(Long userId, String resourceType, Long resourceId) throws SQLException {
        boolean exists = isBookmarked(userId, resourceType, resourceId);
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            if (exists) {
                String sql = "DELETE FROM bookmarks WHERE user_id = ? AND resource_type = ? AND resource_id = ?";
                stmt = conn.prepareStatement(sql);
                stmt.setLong(1, userId);
                stmt.setString(2, resourceType);
                stmt.setLong(3, resourceId);
                stmt.executeUpdate();
                return false; // unbookmarked
            } else {
                String sql = "INSERT INTO bookmarks (user_id, resource_type, resource_id) VALUES (?, ?, ?)";
                stmt = conn.prepareStatement(sql);
                stmt.setLong(1, userId);
                stmt.setString(2, resourceType);
                stmt.setLong(3, resourceId);
                stmt.executeUpdate();
                return true; // bookmarked
            }
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public boolean isBookmarked(Long userId, String resourceType, Long resourceId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM bookmarks WHERE user_id = ? AND resource_type = ? AND resource_id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, userId);
            stmt.setString(2, resourceType);
            stmt.setLong(3, resourceId);
            rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
            return false;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public List<Bookmark> findByUser(Long userId) throws SQLException {
        List<Bookmark> list = new ArrayList<>();
        String sql = "SELECT b.id, b.user_id, b.resource_type, b.resource_id, b.created_at, " +
                "CASE " +
                "  WHEN b.resource_type = 'NOTE' THEN n.title " +
                "  WHEN b.resource_type = 'QUESTION_BANK' THEN qb.question_text " +
                "  WHEN b.resource_type = 'PAPER' THEN pyp.title " +
                "END as title, " +
                "CASE " +
                "  WHEN b.resource_type = 'NOTE' THEN CONCAT('Unit ', n.unit, ' - ', sn.subject_name) " +
                "  WHEN b.resource_type = 'QUESTION_BANK' THEN CONCAT(qb.category, ' - ', sqb.subject_name) " +
                "  WHEN b.resource_type = 'PAPER' THEN CONCAT(pyp.exam_year, ' ', pyp.exam_type) " +
                "END as subtitle, " +
                "CASE " +
                "  WHEN b.resource_type = 'NOTE' THEN sn.subject_code " +
                "  WHEN b.resource_type = 'QUESTION_BANK' THEN sqb.subject_code " +
                "  WHEN b.resource_type = 'PAPER' THEN spyp.subject_code " +
                "END as subject_code, " +
                "CASE " +
                "  WHEN b.resource_type = 'NOTE' THEN n.file_path " +
                "  WHEN b.resource_type = 'QUESTION_BANK' THEN qb.file_path " +
                "  WHEN b.resource_type = 'PAPER' THEN pyp.file_path " +
                "END as file_path " +
                "FROM bookmarks b " +
                "LEFT JOIN notes n ON b.resource_type = 'NOTE' AND b.resource_id = n.id " +
                "LEFT JOIN subjects sn ON n.subject_id = sn.id " +
                "LEFT JOIN question_banks qb ON b.resource_type = 'QUESTION_BANK' AND b.resource_id = qb.id " +
                "LEFT JOIN subjects sqb ON qb.subject_id = sqb.id " +
                "LEFT JOIN previous_year_papers pyp ON b.resource_type = 'PAPER' AND b.resource_id = pyp.id " +
                "LEFT JOIN subjects spyp ON pyp.subject_id = spyp.id " +
                "WHERE b.user_id = ? ORDER BY b.created_at DESC";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, userId);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Bookmark bm = new Bookmark();
                bm.setId(rs.getLong("id"));
                bm.setUserId(rs.getLong("user_id"));
                bm.setResourceType(rs.getString("resource_type"));
                bm.setResourceId(rs.getLong("resource_id"));
                bm.setCreatedAt(rs.getTimestamp("created_at"));
                bm.setTitle(rs.getString("title"));
                bm.setSubtitle(rs.getString("subtitle"));
                bm.setSubjectCode(rs.getString("subject_code"));
                bm.setFilePath(rs.getString("file_path"));
                list.add(bm);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }
}
