package com.vtuconnect.dao;

import com.vtuconnect.model.AuditLog;
import com.vtuconnect.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class AuditLogDAO {

    public void log(Long adminId, String action, String resourceType, Long resourceId, String details, String ipAddress) {
        String sql = "INSERT INTO audit_logs (admin_id, action, resource_type, resource_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            if (adminId != null) stmt.setLong(1, adminId);
            else stmt.setNull(1, java.sql.Types.BIGINT);
            stmt.setString(2, action);
            stmt.setString(3, resourceType);
            if (resourceId != null) stmt.setLong(4, resourceId);
            else stmt.setNull(4, java.sql.Types.BIGINT);
            stmt.setString(5, details);
            stmt.setString(6, ipAddress);
            stmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Failed to write audit log: " + e.getMessage());
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public List<AuditLog> findAll(int limit) throws SQLException {
        List<AuditLog> list = new ArrayList<>();
        String sql = "SELECT al.id, al.admin_id, al.action, al.resource_type, al.resource_id, al.details, al.ip_address, al.created_at, " +
                "u.email as admin_email, p.full_name as admin_name " +
                "FROM audit_logs al " +
                "LEFT JOIN users u ON al.admin_id = u.id " +
                "LEFT JOIN profiles p ON u.id = p.user_id " +
                "ORDER BY al.id DESC LIMIT ?";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, limit > 0 ? limit : 100);
            rs = stmt.executeQuery();

            while (rs.next()) {
                AuditLog log = new AuditLog();
                log.setId(rs.getLong("id"));
                log.setAdminId((Long) rs.getObject("admin_id"));
                log.setAction(rs.getString("action"));
                log.setResourceType(rs.getString("resource_type"));
                log.setResourceId((Long) rs.getObject("resource_id"));
                log.setDetails(rs.getString("details"));
                log.setIpAddress(rs.getString("ip_address"));
                log.setCreatedAt(rs.getTimestamp("created_at"));
                log.setAdminEmail(rs.getString("admin_email"));
                log.setAdminName(rs.getString("admin_name"));
                list.add(log);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }
}
