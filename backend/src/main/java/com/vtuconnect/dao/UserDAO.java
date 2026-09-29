package com.vtuconnect.dao;

import com.vtuconnect.model.Profile;
import com.vtuconnect.model.User;
import com.vtuconnect.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class UserDAO {

    public User findByEmail(String email) throws SQLException {
        String sql = "SELECT u.id, u.email, u.password_hash, u.role, u.status, u.created_at, u.updated_at, " +
                "p.id as pid, p.full_name, p.phone, p.usn, p.college, p.branch, p.semester, p.graduation_year, p.profile_photo, p.skills, p.bio " +
                "FROM users u " +
                "LEFT JOIN profiles p ON u.id = p.user_id " +
                "WHERE LOWER(u.email) = LOWER(?) LIMIT 1";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, email.trim());
            rs = stmt.executeQuery();

            if (rs.next()) {
                User user = new User();
                user.setId(rs.getLong("id"));
                user.setEmail(rs.getString("email"));
                user.setPasswordHash(rs.getString("password_hash"));
                user.setRole(rs.getString("role"));
                user.setStatus(rs.getString("status"));
                user.setCreatedAt(rs.getTimestamp("created_at"));
                user.setUpdatedAt(rs.getTimestamp("updated_at"));

                long profileId = rs.getLong("pid");
                if (!rs.wasNull()) {
                    Profile profile = new Profile();
                    profile.setId(profileId);
                    profile.setUserId(user.getId());
                    profile.setFullName(rs.getString("full_name"));
                    profile.setPhone(rs.getString("phone"));
                    profile.setUsn(rs.getString("usn"));
                    profile.setCollege(rs.getString("college"));
                    profile.setBranch(rs.getString("branch"));
                    profile.setSemester(rs.getInt("semester"));
                    profile.setGraduationYear(rs.getInt("graduation_year"));
                    profile.setProfilePhoto(rs.getString("profile_photo"));
                    profile.setSkills(rs.getString("skills"));
                    profile.setBio(rs.getString("bio"));
                    user.setProfile(profile);
                }
                return user;
            }
            return null;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public User findById(Long id) throws SQLException {
        String sql = "SELECT u.id, u.email, u.password_hash, u.role, u.status, u.created_at, u.updated_at, " +
                "p.id as pid, p.full_name, p.phone, p.usn, p.college, p.branch, p.semester, p.graduation_year, p.profile_photo, p.skills, p.bio " +
                "FROM users u " +
                "LEFT JOIN profiles p ON u.id = p.user_id " +
                "WHERE u.id = ? LIMIT 1";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                User user = new User();
                user.setId(rs.getLong("id"));
                user.setEmail(rs.getString("email"));
                user.setPasswordHash(rs.getString("password_hash"));
                user.setRole(rs.getString("role"));
                user.setStatus(rs.getString("status"));
                user.setCreatedAt(rs.getTimestamp("created_at"));
                user.setUpdatedAt(rs.getTimestamp("updated_at"));

                long profileId = rs.getLong("pid");
                if (!rs.wasNull()) {
                    Profile profile = new Profile();
                    profile.setId(profileId);
                    profile.setUserId(user.getId());
                    profile.setFullName(rs.getString("full_name"));
                    profile.setPhone(rs.getString("phone"));
                    profile.setUsn(rs.getString("usn"));
                    profile.setCollege(rs.getString("college"));
                    profile.setBranch(rs.getString("branch"));
                    profile.setSemester(rs.getInt("semester"));
                    profile.setGraduationYear(rs.getInt("graduation_year"));
                    profile.setProfilePhoto(rs.getString("profile_photo"));
                    profile.setSkills(rs.getString("skills"));
                    profile.setBio(rs.getString("bio"));
                    user.setProfile(profile);
                }
                return user;
            }
            return null;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public User create(User user) throws SQLException {
        String sql = "INSERT INTO users (email, password_hash, role, status) VALUES (?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1, user.getEmail().trim().toLowerCase());
            stmt.setString(2, user.getPasswordHash());
            stmt.setString(3, user.getRole() != null ? user.getRole() : "STUDENT");
            stmt.setString(4, user.getStatus() != null ? user.getStatus() : "ACTIVE");

            stmt.executeUpdate();
            rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                user.setId(rs.getLong(1));
            }
            return user;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public List<User> findAll() throws SQLException {
        List<User> list = new ArrayList<>();
        String sql = "SELECT u.id, u.email, u.role, u.status, u.created_at, u.updated_at, " +
                "p.id as pid, p.full_name, p.phone, p.usn, p.college, p.branch, p.semester, p.graduation_year " +
                "FROM users u LEFT JOIN profiles p ON u.id = p.user_id ORDER BY u.id DESC";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();

            while (rs.next()) {
                User user = new User();
                user.setId(rs.getLong("id"));
                user.setEmail(rs.getString("email"));
                user.setRole(rs.getString("role"));
                user.setStatus(rs.getString("status"));
                user.setCreatedAt(rs.getTimestamp("created_at"));
                user.setUpdatedAt(rs.getTimestamp("updated_at"));

                long profileId = rs.getLong("pid");
                if (!rs.wasNull()) {
                    Profile profile = new Profile();
                    profile.setId(profileId);
                    profile.setUserId(user.getId());
                    profile.setFullName(rs.getString("full_name"));
                    profile.setPhone(rs.getString("phone"));
                    profile.setUsn(rs.getString("usn"));
                    profile.setCollege(rs.getString("college"));
                    profile.setBranch(rs.getString("branch"));
                    profile.setSemester(rs.getInt("semester"));
                    profile.setGraduationYear(rs.getInt("graduation_year"));
                    user.setProfile(profile);
                }
                list.add(user);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public boolean updateStatus(Long userId, String status) throws SQLException {
        String sql = "UPDATE users SET status = ? WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, status);
            stmt.setLong(2, userId);
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public boolean updatePassword(Long userId, String newHash) throws SQLException {
        String sql = "UPDATE users SET password_hash = ? WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, newHash);
            stmt.setLong(2, userId);
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public int countTotalStudents() throws SQLException {
        String sql = "SELECT COUNT(*) FROM users WHERE role = 'STUDENT'";
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
