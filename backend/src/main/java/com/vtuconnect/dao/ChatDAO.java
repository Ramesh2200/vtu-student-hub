package com.vtuconnect.dao;

import com.vtuconnect.model.ChatMessage;
import com.vtuconnect.model.ChatRoom;
import com.vtuconnect.model.MessageReport;
import com.vtuconnect.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class ChatDAO {

    public List<ChatRoom> findAllRooms() throws SQLException {
        List<ChatRoom> list = new ArrayList<>();
        String sql = "SELECT cr.id, cr.name, cr.slug, cr.description, cr.icon, cr.is_active, cr.created_at, " +
                "(SELECT COUNT(*) FROM chat_messages cm WHERE cm.room_id = cr.id AND cm.is_deleted = FALSE) as message_count " +
                "FROM chat_rooms cr WHERE cr.is_active = TRUE ORDER BY cr.id ASC";

        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);

            while (rs.next()) {
                ChatRoom room = new ChatRoom();
                room.setId(rs.getLong("id"));
                room.setName(rs.getString("name"));
                room.setSlug(rs.getString("slug"));
                room.setDescription(rs.getString("description"));
                room.setIcon(rs.getString("icon"));
                room.setActive(rs.getBoolean("is_active"));
                room.setCreatedAt(rs.getTimestamp("created_at"));
                room.setMessageCount(rs.getInt("message_count"));
                list.add(room);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public List<ChatMessage> findMessagesByRoom(Long roomId, int limit, Long beforeId) throws SQLException {
        List<ChatMessage> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
                "SELECT cm.id, cm.room_id, cm.user_id, cm.message, cm.is_question, cm.reply_to_id, cm.is_moderated, cm.is_deleted, cm.created_at, " +
                "u.role as user_role, p.full_name as user_name, p.profile_photo as user_avatar, " +
                "parent.message as reply_message, parent_p.full_name as reply_user_name " +
                "FROM chat_messages cm " +
                "JOIN users u ON cm.user_id = u.id " +
                "LEFT JOIN profiles p ON u.id = p.user_id " +
                "LEFT JOIN chat_messages parent ON cm.reply_to_id = parent.id " +
                "LEFT JOIN profiles parent_p ON parent.user_id = parent_p.user_id " +
                "WHERE cm.room_id = ? AND cm.is_deleted = FALSE "
        );

        if (beforeId != null && beforeId > 0) {
            sql.append("AND cm.id < ? ");
        }

        sql.append("ORDER BY cm.id ASC LIMIT ?");

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql.toString());
            int idx = 1;
            stmt.setLong(idx++, roomId);
            if (beforeId != null && beforeId > 0) {
                stmt.setLong(idx++, beforeId);
            }
            stmt.setInt(idx, limit > 0 ? limit : 50);
            rs = stmt.executeQuery();

            while (rs.next()) {
                ChatMessage m = new ChatMessage();
                m.setId(rs.getLong("id"));
                m.setRoomId(rs.getLong("room_id"));
                m.setUserId(rs.getLong("user_id"));
                m.setMessage(rs.getString("message"));
                m.setQuestion(rs.getBoolean("is_question"));
                m.setReplyToId((Long) rs.getObject("reply_to_id"));
                m.setModerated(rs.getBoolean("is_moderated"));
                m.setDeleted(rs.getBoolean("is_deleted"));
                m.setCreatedAt(rs.getTimestamp("created_at"));
                m.setUserRole(rs.getString("user_role"));
                m.setUserName(rs.getString("user_name") != null ? rs.getString("user_name") : "Student");
                m.setUserAvatar(rs.getString("user_avatar"));
                m.setReplyMessage(rs.getString("reply_message"));
                m.setReplyUserName(rs.getString("reply_user_name"));
                list.add(m);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public ChatMessage createMessage(ChatMessage msg) throws SQLException {
        String sql = "INSERT INTO chat_messages (room_id, user_id, message, is_question, reply_to_id) VALUES (?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setLong(1, msg.getRoomId());
            stmt.setLong(2, msg.getUserId());
            stmt.setString(3, msg.getMessage().trim());
            stmt.setBoolean(4, msg.isQuestion());
            if (msg.getReplyToId() != null) stmt.setLong(5, msg.getReplyToId());
            else stmt.setNull(5, java.sql.Types.BIGINT);

            stmt.executeUpdate();
            rs = stmt.getGeneratedKeys();
            if (rs.next()) msg.setId(rs.getLong(1));
            return msg;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public boolean reportMessage(Long messageId, Long reportedBy, String reason) throws SQLException {
        String sql = "INSERT INTO message_reports (message_id, reported_by, reason) VALUES (?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, messageId);
            stmt.setLong(2, reportedBy);
            stmt.setString(3, reason);
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public List<MessageReport> findAllReports(String status) throws SQLException {
        List<MessageReport> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
                "SELECT mr.id, mr.message_id, mr.reported_by, mr.reason, mr.status, mr.admin_notes, mr.created_at, mr.updated_at, " +
                "cm.message as message_content, reporter_u.email as reporter_email, reporter_p.full_name as reporter_name, " +
                "author_p.full_name as reported_user_name " +
                "FROM message_reports mr " +
                "JOIN chat_messages cm ON mr.message_id = cm.id " +
                "JOIN users reporter_u ON mr.reported_by = reporter_u.id " +
                "LEFT JOIN profiles reporter_p ON reporter_u.id = reporter_p.user_id " +
                "LEFT JOIN profiles author_p ON cm.user_id = author_p.user_id "
        );

        if (status != null && !status.isBlank()) {
            sql.append("WHERE mr.status = ? ");
        }
        sql.append("ORDER BY mr.id DESC");

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql.toString());
            if (status != null && !status.isBlank()) {
                stmt.setString(1, status);
            }
            rs = stmt.executeQuery();

            while (rs.next()) {
                MessageReport rep = new MessageReport();
                rep.setId(rs.getLong("id"));
                rep.setMessageId(rs.getLong("message_id"));
                rep.setReportedBy(rs.getLong("reported_by"));
                rep.setReason(rs.getString("reason"));
                rep.setStatus(rs.getString("status"));
                rep.setAdminNotes(rs.getString("admin_notes"));
                rep.setCreatedAt(rs.getTimestamp("created_at"));
                rep.setUpdatedAt(rs.getTimestamp("updated_at"));
                rep.setMessageContent(rs.getString("message_content"));
                rep.setReporterEmail(rs.getString("reporter_email"));
                rep.setReporterName(rs.getString("reporter_name"));
                rep.setReportedUserName(rs.getString("reported_user_name"));
                list.add(rep);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public boolean updateReportStatus(Long reportId, String status, String adminNotes, boolean deleteMessage) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        PreparedStatement stmtMsg = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            String sql = "UPDATE message_reports SET status = ?, admin_notes = ? WHERE id = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, status);
            stmt.setString(2, adminNotes);
            stmt.setLong(3, reportId);
            stmt.executeUpdate();

            if (deleteMessage) {
                String delSql = "UPDATE chat_messages cm JOIN message_reports mr ON cm.id = mr.message_id " +
                        "SET cm.is_deleted = TRUE, cm.is_moderated = TRUE WHERE mr.id = ?";
                stmtMsg = conn.prepareStatement(delSql);
                stmtMsg.setLong(1, reportId);
                stmtMsg.executeUpdate();
            }

            conn.commit();
            return true;
        } catch (SQLException e) {
            if (conn != null) conn.rollback();
            throw e;
        } finally {
            if (stmtMsg != null) try { stmtMsg.close(); } catch (SQLException ignored) {}
            DBConnection.close(conn, stmt);
        }
    }

    public int countTotalMessages() throws SQLException {
        String sql = "SELECT COUNT(*) FROM chat_messages WHERE is_deleted = FALSE";
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
}
