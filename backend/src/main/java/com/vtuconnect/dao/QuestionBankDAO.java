package com.vtuconnect.dao;

import com.vtuconnect.model.QuestionBank;
import com.vtuconnect.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class QuestionBankDAO {

    public List<QuestionBank> findFiltered(Integer semesterId, Long subjectId, Integer unit, String category, String difficulty, String searchQuery, String status, Long currentUserId) throws SQLException {
        List<QuestionBank> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
                "SELECT qb.id, qb.subject_id, qb.semester_id, qb.unit, qb.category, qb.difficulty, " +
                "qb.question_text, qb.answer_text, qb.file_name, qb.file_path, qb.status, qb.created_at, qb.updated_at, " +
                "s.subject_code, s.subject_name, sem.semester_number "
        );

        if (currentUserId != null) {
            sql.append(", (SELECT COUNT(*) > 0 FROM bookmarks b WHERE b.user_id = ? AND b.resource_type = 'QUESTION_BANK' AND b.resource_id = qb.id) as is_bookmarked ");
        } else {
            sql.append(", FALSE as is_bookmarked ");
        }

        sql.append("FROM question_banks qb " +
                "JOIN subjects s ON qb.subject_id = s.id " +
                "JOIN semesters sem ON qb.semester_id = sem.id " +
                "WHERE 1=1 ");

        List<Object> params = new ArrayList<>();
        if (currentUserId != null) {
            params.add(currentUserId);
        }

        if (semesterId != null && semesterId > 0) {
            sql.append("AND qb.semester_id = ? ");
            params.add(semesterId);
        }
        if (subjectId != null && subjectId > 0) {
            sql.append("AND qb.subject_id = ? ");
            params.add(subjectId);
        }
        if (unit != null && unit > 0) {
            sql.append("AND qb.unit = ? ");
            params.add(unit);
        }
        if (category != null && !category.isBlank()) {
            sql.append("AND qb.category = ? ");
            params.add(category);
        }
        if (difficulty != null && !difficulty.isBlank()) {
            sql.append("AND qb.difficulty = ? ");
            params.add(difficulty);
        }
        if (status != null && !status.isBlank()) {
            sql.append("AND qb.status = ? ");
            params.add(status);
        } else {
            sql.append("AND qb.status = 'PUBLISHED' ");
        }
        if (searchQuery != null && !searchQuery.isBlank()) {
            sql.append("AND (LOWER(qb.question_text) LIKE ? OR LOWER(qb.answer_text) LIKE ? OR LOWER(s.subject_name) LIKE ?) ");
            String q = "%" + searchQuery.trim().toLowerCase() + "%";
            params.add(q);
            params.add(q);
            params.add(q);
        }

        sql.append("ORDER BY qb.semester_id ASC, qb.subject_id ASC, qb.unit ASC, qb.id DESC");

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
                QuestionBank qb = mapRow(rs);
                list.add(qb);
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public QuestionBank findById(Long id, Long currentUserId) throws SQLException {
        StringBuilder sql = new StringBuilder(
                "SELECT qb.id, qb.subject_id, qb.semester_id, qb.unit, qb.category, qb.difficulty, " +
                "qb.question_text, qb.answer_text, qb.file_name, qb.file_path, qb.status, qb.created_at, qb.updated_at, " +
                "s.subject_code, s.subject_name, sem.semester_number "
        );

        if (currentUserId != null) {
            sql.append(", (SELECT COUNT(*) > 0 FROM bookmarks b WHERE b.user_id = ? AND b.resource_type = 'QUESTION_BANK' AND b.resource_id = qb.id) as is_bookmarked ");
        } else {
            sql.append(", FALSE as is_bookmarked ");
        }

        sql.append("FROM question_banks qb " +
                "JOIN subjects s ON qb.subject_id = s.id " +
                "JOIN semesters sem ON qb.semester_id = sem.id " +
                "WHERE qb.id = ? LIMIT 1");

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

    public QuestionBank create(QuestionBank qb) throws SQLException {
        String sql = "INSERT INTO question_banks (subject_id, semester_id, unit, category, difficulty, question_text, answer_text, file_name, file_path, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setLong(1, qb.getSubjectId());
            stmt.setInt(2, qb.getSemesterId());
            stmt.setInt(3, qb.getUnit());
            stmt.setString(4, qb.getCategory());
            stmt.setString(5, qb.getDifficulty() != null ? qb.getDifficulty() : "MEDIUM");
            stmt.setString(6, qb.getQuestionText().trim());
            stmt.setString(7, qb.getAnswerText());
            stmt.setString(8, qb.getFileName());
            stmt.setString(9, qb.getFilePath());
            stmt.setString(10, qb.getStatus() != null ? qb.getStatus() : "PUBLISHED");

            stmt.executeUpdate();
            rs = stmt.getGeneratedKeys();
            if (rs.next()) qb.setId(rs.getLong(1));
            return qb;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public boolean update(QuestionBank qb) throws SQLException {
        String sql = "UPDATE question_banks SET subject_id = ?, semester_id = ?, unit = ?, category = ?, difficulty = ?, question_text = ?, answer_text = ?, status = ? " +
                "WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setLong(1, qb.getSubjectId());
            stmt.setInt(2, qb.getSemesterId());
            stmt.setInt(3, qb.getUnit());
            stmt.setString(4, qb.getCategory());
            stmt.setString(5, qb.getDifficulty());
            stmt.setString(6, qb.getQuestionText().trim());
            stmt.setString(7, qb.getAnswerText());
            stmt.setString(8, qb.getStatus());
            stmt.setLong(9, qb.getId());
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public boolean delete(Long id) throws SQLException {
        String sql = "DELETE FROM question_banks WHERE id = ?";
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

    public int countTotalQuestionBanks() throws SQLException {
        String sql = "SELECT COUNT(*) FROM question_banks WHERE status = 'PUBLISHED'";
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

    private QuestionBank mapRow(ResultSet rs) throws SQLException {
        QuestionBank qb = new QuestionBank();
        qb.setId(rs.getLong("id"));
        qb.setSubjectId(rs.getLong("subject_id"));
        qb.setSemesterId(rs.getInt("semester_id"));
        qb.setUnit(rs.getInt("unit"));
        qb.setCategory(rs.getString("category"));
        qb.setDifficulty(rs.getString("difficulty"));
        qb.setQuestionText(rs.getString("question_text"));
        qb.setAnswerText(rs.getString("answer_text"));
        qb.setFileName(rs.getString("file_name"));
        qb.setFilePath(rs.getString("file_path"));
        qb.setStatus(rs.getString("status"));
        qb.setCreatedAt(rs.getTimestamp("created_at"));
        qb.setUpdatedAt(rs.getTimestamp("updated_at"));

        qb.setSubjectCode(rs.getString("subject_code"));
        qb.setSubjectName(rs.getString("subject_name"));
        qb.setSemesterNumber(rs.getInt("semester_number"));
        qb.setBookmarked(rs.getBoolean("is_bookmarked"));
        return qb;
    }
}
