package com.vtuconnect.dao;

import com.vtuconnect.model.Advertisement;
import com.vtuconnect.util.DBConnection;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class AdvertisementDAO {

    public List<Advertisement> findActive() throws SQLException {
        List<Advertisement> list = new ArrayList<>();
        String sql = "SELECT id, title, description, image_url, target_url, start_date, end_date, is_active, display_position, impressions, clicks, created_at, updated_at " +
                "FROM advertisements " +
                "WHERE is_active = TRUE AND (start_date <= CURDATE() AND end_date >= CURDATE()) " +
                "ORDER BY id DESC";

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

    public List<Advertisement> findAll() throws SQLException {
        List<Advertisement> list = new ArrayList<>();
        String sql = "SELECT id, title, description, image_url, target_url, start_date, end_date, is_active, display_position, impressions, clicks, created_at, updated_at " +
                "FROM advertisements ORDER BY id DESC";

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

    public Advertisement findById(Long id) throws SQLException {
        String sql = "SELECT id, title, description, image_url, target_url, start_date, end_date, is_active, display_position, impressions, clicks, created_at, updated_at " +
                "FROM advertisements WHERE id = ? LIMIT 1";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                return mapRow(rs);
            }
            return null;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public Advertisement create(Advertisement ad) throws SQLException {
        String sql = "INSERT INTO advertisements (title, description, image_url, target_url, start_date, end_date, is_active, display_position) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1, ad.getTitle().trim());
            stmt.setString(2, ad.getDescription());
            stmt.setString(3, ad.getImageUrl());
            stmt.setString(4, ad.getTargetUrl());
            stmt.setDate(5, ad.getStartDate());
            stmt.setDate(6, ad.getEndDate());
            stmt.setBoolean(7, ad.isActive());
            stmt.setString(8, ad.getDisplayPosition() != null ? ad.getDisplayPosition() : "SIDEBAR");

            stmt.executeUpdate();
            rs = stmt.getGeneratedKeys();
            if (rs.next()) ad.setId(rs.getLong(1));
            return ad;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public boolean update(Advertisement ad) throws SQLException {
        String sql = "UPDATE advertisements SET title = ?, description = ?, image_url = ?, target_url = ?, start_date = ?, end_date = ?, is_active = ?, display_position = ? " +
                "WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, ad.getTitle().trim());
            stmt.setString(2, ad.getDescription());
            stmt.setString(3, ad.getImageUrl());
            stmt.setString(4, ad.getTargetUrl());
            stmt.setDate(5, ad.getStartDate());
            stmt.setDate(6, ad.getEndDate());
            stmt.setBoolean(7, ad.isActive());
            stmt.setString(8, ad.getDisplayPosition());
            stmt.setLong(9, ad.getId());
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public boolean delete(Long id) throws SQLException {
        String sql = "DELETE FROM advertisements WHERE id = ?";
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

    public void incrementClicks(Long id) throws SQLException {
        String sql = "UPDATE advertisements SET clicks = clicks + 1 WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, id);
            stmt.executeUpdate();
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public int countActiveAds() throws SQLException {
        String sql = "SELECT COUNT(*) FROM advertisements WHERE is_active = TRUE";
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

    private Advertisement mapRow(ResultSet rs) throws SQLException {
        Advertisement ad = new Advertisement();
        ad.setId(rs.getLong("id"));
        ad.setTitle(rs.getString("title"));
        ad.setDescription(rs.getString("description"));
        ad.setImageUrl(rs.getString("image_url"));
        ad.setTargetUrl(rs.getString("target_url"));
        ad.setStartDate(rs.getDate("start_date"));
        ad.setEndDate(rs.getDate("end_date"));
        ad.setActive(rs.getBoolean("is_active"));
        ad.setDisplayPosition(rs.getString("display_position"));
        ad.setImpressions(rs.getInt("impressions"));
        ad.setClicks(rs.getInt("clicks"));
        ad.setCreatedAt(rs.getTimestamp("created_at"));
        ad.setUpdatedAt(rs.getTimestamp("updated_at"));
        return ad;
    }
}
