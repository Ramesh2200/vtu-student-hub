package com.vtuconnect.dao;

import com.vtuconnect.model.Profile;
import com.vtuconnect.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class ProfileDAO {

    public Profile findByUserId(Long userId) throws SQLException {
        String sql = "SELECT id, user_id, full_name, phone, usn, college, branch, semester, graduation_year, profile_photo, skills, bio, created_at, updated_at " +
                "FROM profiles WHERE user_id = ? LIMIT 1";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, userId);
            rs = stmt.executeQuery();

            if (rs.next()) {
                Profile p = new Profile();
                p.setId(rs.getLong("id"));
                p.setUserId(rs.getLong("user_id"));
                p.setFullName(rs.getString("full_name"));
                p.setPhone(rs.getString("phone"));
                p.setUsn(rs.getString("usn"));
                p.setCollege(rs.getString("college"));
                p.setBranch(rs.getString("branch"));
                p.setSemester(rs.getInt("semester"));
                p.setGraduationYear(rs.getInt("graduation_year"));
                p.setProfilePhoto(rs.getString("profile_photo"));
                p.setSkills(rs.getString("skills"));
                p.setBio(rs.getString("bio"));
                p.setCreatedAt(rs.getTimestamp("created_at"));
                p.setUpdatedAt(rs.getTimestamp("updated_at"));
                return p;
            }
            return null;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public Profile saveOrUpdate(Profile p) throws SQLException {
        Profile existing = findByUserId(p.getUserId());
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            if (existing == null) {
                String sql = "INSERT INTO profiles (user_id, full_name, phone, usn, college, branch, semester, graduation_year, profile_photo, skills, bio) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                stmt.setLong(1, p.getUserId());
                stmt.setString(2, p.getFullName());
                stmt.setString(3, p.getPhone());
                stmt.setString(4, p.getUsn());
                stmt.setString(5, p.getCollege());
                stmt.setString(6, p.getBranch());
                stmt.setInt(7, p.getSemester() > 0 ? p.getSemester() : 1);
                stmt.setInt(8, p.getGraduationYear() > 0 ? p.getGraduationYear() : 2026);
                stmt.setString(9, p.getProfilePhoto());
                stmt.setString(10, p.getSkills());
                stmt.setString(11, p.getBio());

                stmt.executeUpdate();
                rs = stmt.getGeneratedKeys();
                if (rs.next()) {
                    p.setId(rs.getLong(1));
                }
            } else {
                String sql = "UPDATE profiles SET full_name = ?, phone = ?, usn = ?, college = ?, branch = ?, semester = ?, graduation_year = ?, profile_photo = ?, skills = ?, bio = ? " +
                        "WHERE user_id = ?";
                stmt = conn.prepareStatement(sql);
                stmt.setString(1, p.getFullName());
                stmt.setString(2, p.getPhone());
                stmt.setString(3, p.getUsn());
                stmt.setString(4, p.getCollege());
                stmt.setString(5, p.getBranch());
                stmt.setInt(6, p.getSemester());
                stmt.setInt(7, p.getGraduationYear());
                stmt.setString(8, p.getProfilePhoto());
                stmt.setString(9, p.getSkills());
                stmt.setString(10, p.getBio());
                stmt.setLong(11, p.getUserId());

                stmt.executeUpdate();
                p.setId(existing.getId());
            }
            return p;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }
}
