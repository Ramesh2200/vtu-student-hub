package com.vtuconnect.dao;

import com.vtuconnect.model.Placement;
import com.vtuconnect.model.PlacementApplication;
import com.vtuconnect.util.DBConnection;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class PlacementDAO {

    public List<Placement> findFiltered(String status, String batch, String searchQuery, Long currentUserId) throws SQLException {
        List<Placement> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
                "SELECT p.id, p.company_name, p.job_role, p.description, p.location, p.ctc, p.eligibility, " +
                "p.required_skills, p.batch, p.application_link, p.last_date, p.status, p.created_at, p.updated_at, " +
                "(SELECT COUNT(*) FROM placement_applications pa WHERE pa.placement_id = p.id) as applicant_count "
        );

        if (currentUserId != null) {
            sql.append(", (SELECT pa.status FROM placement_applications pa WHERE pa.placement_id = p.id AND pa.user_id = ? LIMIT 1) as user_app_status ");
        } else {
            sql.append(", NULL as user_app_status ");
        }

        sql.append("FROM placements p WHERE 1=1 ");

        List<Object> params = new ArrayList<>();
        if (currentUserId != null) {
            params.add(currentUserId);
        }

        if (status != null && !status.isBlank()) {
            sql.append("AND p.status = ? ");
            params.add(status);
        } else {
            sql.append("AND p.status IN ('OPEN', 'UPCOMING') ");
        }

        if (batch != null && !batch.isBlank()) {
            sql.append("AND LOWER(p.batch) LIKE ? ");
            params.add("%" + batch.trim().toLowerCase() + "%");
        }

        if (searchQuery != null && !searchQuery.isBlank()) {
            sql.append("AND (LOWER(p.company_name) LIKE ? OR LOWER(p.job_role) LIKE ? OR LOWER(p.location) LIKE ? OR LOWER(p.required_skills) LIKE ?) ");
            String q = "%" + searchQuery.trim().toLowerCase() + "%";
            params.add(q);
            params.add(q);
            params.add(q);
            params.add(q);
        }

        sql.append("ORDER BY p.last_date ASC, p.id DESC");

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql.toString());
            for (int i = 0; i < params.size(); i++) {
                stmt.setObject(i + 1, params.get(i));
            }
            rs = stmt.executeQuery();

            while (rs.next()) {
                Placement item = mapRow(rs);
                list.add(item);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public Placement findById(Long id, Long currentUserId) throws SQLException {
        StringBuilder sql = new StringBuilder(
                "SELECT p.id, p.company_name, p.job_role, p.description, p.location, p.ctc, p.eligibility, " +
                "p.required_skills, p.batch, p.application_link, p.last_date, p.status, p.created_at, p.updated_at, " +
                "(SELECT COUNT(*) FROM placement_applications pa WHERE pa.placement_id = p.id) as applicant_count "
        );

        if (currentUserId != null) {
            sql.append(", (SELECT pa.status FROM placement_applications pa WHERE pa.placement_id = p.id AND pa.user_id = ? LIMIT 1) as user_app_status ");
        } else {
            sql.append(", NULL as user_app_status ");
        }

        sql.append("FROM placements p WHERE p.id = ? LIMIT 1");

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql.toString());
            int idx = 1;
            if (currentUserId != null) {
                stmt.setLong(idx++, currentUserId);
            }
            stmt.setLong(idx, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                return mapRow(rs);
            }
            return null;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public Placement create(Placement p) throws SQLException {
        String sql = "INSERT INTO placements (company_name, job_role, description, location, ctc, eligibility, required_skills, batch, application_link, last_date, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1, p.getCompanyName().trim());
            stmt.setString(2, p.getJobRole().trim());
            stmt.setString(3, p.getDescription());
            stmt.setString(4, p.getLocation().trim());
            stmt.setString(5, p.getCtc().trim());
            stmt.setString(6, p.getEligibility().trim());
            stmt.setString(7, p.getRequiredSkills());
            stmt.setString(8, p.getBatch().trim());
            stmt.setString(9, p.getApplicationLink());
            stmt.setDate(10, p.getLastDate());
            stmt.setString(11, p.getStatus() != null ? p.getStatus() : "OPEN");

            stmt.executeUpdate();
            rs = stmt.getGeneratedKeys();
            if (rs.next()) p.setId(rs.getLong(1));
            return p;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public boolean update(Placement p) throws SQLException {
        String sql = "UPDATE placements SET company_name = ?, job_role = ?, description = ?, location = ?, ctc = ?, eligibility = ?, required_skills = ?, batch = ?, application_link = ?, last_date = ?, status = ? " +
                "WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, p.getCompanyName().trim());
            stmt.setString(2, p.getJobRole().trim());
            stmt.setString(3, p.getDescription());
            stmt.setString(4, p.getLocation().trim());
            stmt.setString(5, p.getCtc().trim());
            stmt.setString(6, p.getEligibility().trim());
            stmt.setString(7, p.getRequiredSkills());
            stmt.setString(8, p.getBatch().trim());
            stmt.setString(9, p.getApplicationLink());
            stmt.setDate(10, p.getLastDate());
            stmt.setString(11, p.getStatus());
            stmt.setLong(12, p.getId());
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public boolean delete(Long id) throws SQLException {
        String sql = "DELETE FROM placements WHERE id = ?";
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

    // Application methods
    public boolean apply(Long placementId, Long userId, String resumeLink, String notes) throws SQLException {
        String sql = "INSERT INTO placement_applications (placement_id, user_id, status, resume_link, notes) " +
                "VALUES (?, ?, 'APPLIED', ?, ?) " +
                "ON DUPLICATE KEY UPDATE resume_link = VALUES(resume_link), notes = VALUES(notes), updated_at = CURRENT_TIMESTAMP";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, placementId);
            stmt.setLong(2, userId);
            stmt.setString(3, resumeLink);
            stmt.setString(4, notes);
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public List<PlacementApplication> findApplicationsByUser(Long userId) throws SQLException {
        List<PlacementApplication> list = new ArrayList<>();
        String sql = "SELECT pa.id, pa.placement_id, pa.user_id, pa.status, pa.applied_at, pa.resume_link, pa.notes, pa.updated_at, " +
                "p.company_name, p.job_role, p.location, p.ctc " +
                "FROM placement_applications pa " +
                "JOIN placements p ON pa.placement_id = p.id " +
                "WHERE pa.user_id = ? ORDER BY pa.applied_at DESC";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, userId);
            rs = stmt.executeQuery();

            while (rs.next()) {
                PlacementApplication app = new PlacementApplication();
                app.setId(rs.getLong("id"));
                app.setPlacementId(rs.getLong("placement_id"));
                app.setUserId(rs.getLong("user_id"));
                app.setStatus(rs.getString("status"));
                app.setAppliedAt(rs.getTimestamp("applied_at"));
                app.setResumeLink(rs.getString("resume_link"));
                app.setNotes(rs.getString("notes"));
                app.setUpdatedAt(rs.getTimestamp("updated_at"));
                app.setCompanyName(rs.getString("company_name"));
                app.setJobRole(rs.getString("job_role"));
                app.setLocation(rs.getString("location"));
                app.setCtc(rs.getString("ctc"));
                list.add(app);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public String getLatestResumeByUser(Long userId) throws SQLException {
        String sql = "SELECT resume_link FROM placement_applications WHERE user_id = ? AND resume_link IS NOT NULL AND resume_link != '' ORDER BY applied_at DESC LIMIT 1";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, userId);
            rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getString("resume_link");
            }
            return null;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public List<PlacementApplication> findApplicationsByPlacement(Long placementId) throws SQLException {
        List<PlacementApplication> list = new ArrayList<>();
        String sql = "SELECT pa.id, pa.placement_id, pa.user_id, pa.status, pa.applied_at, pa.resume_link, pa.notes, pa.updated_at, " +
                "p.company_name, p.job_role, u.email as student_email, pr.full_name as student_name, pr.usn as student_usn, " +
                "pr.college as student_college, pr.branch as student_branch " +
                "FROM placement_applications pa " +
                "JOIN placements p ON pa.placement_id = p.id " +
                "JOIN users u ON pa.user_id = u.id " +
                "LEFT JOIN profiles pr ON u.id = pr.user_id " +
                "WHERE pa.placement_id = ? ORDER BY pa.applied_at DESC";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, placementId);
            rs = stmt.executeQuery();

            while (rs.next()) {
                PlacementApplication app = new PlacementApplication();
                app.setId(rs.getLong("id"));
                app.setPlacementId(rs.getLong("placement_id"));
                app.setUserId(rs.getLong("user_id"));
                app.setStatus(rs.getString("status"));
                app.setAppliedAt(rs.getTimestamp("applied_at"));
                app.setResumeLink(rs.getString("resume_link"));
                app.setNotes(rs.getString("notes"));
                app.setUpdatedAt(rs.getTimestamp("updated_at"));
                app.setCompanyName(rs.getString("company_name"));
                app.setJobRole(rs.getString("job_role"));
                app.setStudentEmail(rs.getString("student_email"));
                app.setStudentName(rs.getString("student_name"));
                app.setStudentUsn(rs.getString("student_usn"));
                app.setStudentCollege(rs.getString("student_college"));
                app.setStudentBranch(rs.getString("student_branch"));
                list.add(app);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public boolean updateApplicationStatus(Long applicationId, String status) throws SQLException {
        String sql = "UPDATE placement_applications SET status = ? WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, status);
            stmt.setLong(2, applicationId);
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public int countTotalPlacements() throws SQLException {
        String sql = "SELECT COUNT(*) FROM placements WHERE status = 'OPEN'";
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

    private Placement mapRow(ResultSet rs) throws SQLException {
        Placement p = new Placement();
        p.setId(rs.getLong("id"));
        p.setCompanyName(rs.getString("company_name"));
        p.setJobRole(rs.getString("job_role"));
        p.setDescription(rs.getString("description"));
        p.setLocation(rs.getString("location"));
        p.setCtc(rs.getString("ctc"));
        p.setEligibility(rs.getString("eligibility"));
        p.setRequiredSkills(rs.getString("required_skills"));
        p.setBatch(rs.getString("batch"));
        p.setApplicationLink(rs.getString("application_link"));
        p.setLastDate(rs.getDate("last_date"));
        p.setStatus(rs.getString("status"));
        p.setCreatedAt(rs.getTimestamp("created_at"));
        p.setUpdatedAt(rs.getTimestamp("updated_at"));
        p.setApplicantCount(rs.getInt("applicant_count"));

        String userStatus = rs.getString("user_app_status");
        if (userStatus != null) {
            p.setHasApplied(true);
            p.setUserApplicationStatus(userStatus);
        } else {
            p.setHasApplied(false);
        }
        return p;
    }
}
