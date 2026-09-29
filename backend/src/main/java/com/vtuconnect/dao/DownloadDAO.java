package com.vtuconnect.dao;

import com.vtuconnect.model.Download;
import com.vtuconnect.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class DownloadDAO {

    public void recordDownload(Long userId, String resourceType, Long resourceId, String ipAddress) throws SQLException {
        String sql = "INSERT INTO downloads (user_id, resource_type, resource_id, ip_address) VALUES (?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, userId);
            stmt.setString(2, resourceType);
            stmt.setLong(3, resourceId);
            stmt.setString(4, ipAddress);
            stmt.executeUpdate();
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public List<Download> findByUser(Long userId) throws SQLException {
        List<Download> list = new ArrayList<>();
        String sql = "SELECT d.id, d.user_id, d.resource_type, d.resource_id, d.ip_address, d.downloaded_at, " +
                "CASE " +
                "  WHEN d.resource_type = 'NOTE' THEN n.title " +
                "  WHEN d.resource_type = 'PAPER' THEN pyp.title " +
                "  ELSE 'Academic Resource' " +
                "END as title, " +
                "CASE " +
                "  WHEN d.resource_type = 'NOTE' THEN n.file_name " +
                "  WHEN d.resource_type = 'PAPER' THEN pyp.file_name " +
                "  ELSE 'document.pdf' " +
                "END as file_name, " +
                "CASE " +
                "  WHEN d.resource_type = 'NOTE' THEN n.file_size " +
                "  WHEN d.resource_type = 'PAPER' THEN pyp.file_size " +
                "  ELSE 0 " +
                "END as file_size, " +
                "CASE " +
                "  WHEN d.resource_type = 'NOTE' THEN sn.subject_code " +
                "  WHEN d.resource_type = 'PAPER' THEN spyp.subject_code " +
                "  ELSE 'VTU' " +
                "END as subject_code " +
                "FROM downloads d " +
                "LEFT JOIN notes n ON d.resource_type = 'NOTE' AND d.resource_id = n.id " +
                "LEFT JOIN subjects sn ON n.subject_id = sn.id " +
                "LEFT JOIN previous_year_papers pyp ON d.resource_type = 'PAPER' AND d.resource_id = pyp.id " +
                "LEFT JOIN subjects spyp ON pyp.subject_id = spyp.id " +
                "WHERE d.user_id = ? ORDER BY d.downloaded_at DESC LIMIT 50";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, userId);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Download dl = new Download();
                dl.setId(rs.getLong("id"));
                dl.setUserId(rs.getLong("user_id"));
                dl.setResourceType(rs.getString("resource_type"));
                dl.setResourceId(rs.getLong("resource_id"));
                dl.setIpAddress(rs.getString("ip_address"));
                dl.setDownloadedAt(rs.getTimestamp("downloaded_at"));
                dl.setTitle(rs.getString("title"));
                dl.setFileName(rs.getString("file_name"));
                dl.setFileSize(rs.getLong("file_size"));
                dl.setSubjectCode(rs.getString("subject_code"));
                list.add(dl);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }
}
