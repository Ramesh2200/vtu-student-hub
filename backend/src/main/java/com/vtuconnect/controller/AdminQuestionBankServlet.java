package com.vtuconnect.controller;

import com.google.gson.JsonObject;
import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.QuestionBank;
import com.vtuconnect.service.AdminService;
import com.vtuconnect.service.ResourceService;
import com.vtuconnect.util.FileUploadUtil;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/admin/question-banks", "/api/admin/question-banks/*"})
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024,
        maxFileSize = 25 * 1024 * 1024,
        maxRequestSize = 30 * 1024 * 1024
)
public class AdminQuestionBankServlet extends HttpServlet {

    private final AdminService adminService = new AdminService();
    private final ResourceService resourceService = new ResourceService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long adminId = AuthFilter.getAuthenticatedUserId(req);
            String pathInfo = req.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/") || pathInfo.isEmpty()) {
                Integer semId = req.getParameter("semesterId") != null && !req.getParameter("semesterId").isBlank() ? Integer.parseInt(req.getParameter("semesterId")) : null;
                Long subId = req.getParameter("subjectId") != null && !req.getParameter("subjectId").isBlank() ? Long.parseLong(req.getParameter("subjectId")) : null;
                String cat = req.getParameter("category");
                String q = req.getParameter("q");

                List<QuestionBank> list = resourceService.getQuestionBanks(semId, subId, null, cat, null, q, "ALL", adminId);
                JsonUtil.sendSuccess(resp, "Question bank items retrieved", list);
                return;
            }

            String[] parts = pathInfo.split("/");
            if (parts.length >= 2) {
                Long id = Long.parseLong(parts[1]);
                QuestionBank qb = resourceService.getQuestionBankById(id, adminId);
                JsonUtil.sendSuccess(resp, "Question bank item retrieved", qb);
                return;
            }

            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid path", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        try {
            Long adminId = AuthFilter.getAuthenticatedUserId(req);
            String ip = req.getRemoteAddr();
            String contentType = req.getContentType();

            // Multipart Form-Data (PDF file upload)
            if (contentType != null && contentType.toLowerCase().startsWith("multipart/form-data")) {
                Part filePart = null;
                try {
                    filePart = req.getPart("file");
                } catch (Exception ignored) {}

                String title = req.getParameter("title");
                String questionText = req.getParameter("questionText");
                String effectiveTitle = (title != null && !title.isBlank()) ? title.trim()
                        : ((questionText != null && !questionText.isBlank()) ? questionText.trim() : "VTU Question Bank Document");

                String semIdStr = req.getParameter("semesterId");
                String subIdStr = req.getParameter("subjectId");
                String unitStr = req.getParameter("unit");
                String category = req.getParameter("category");
                String difficulty = req.getParameter("difficulty");
                String answerText = req.getParameter("answerText");

                QuestionBank qb = new QuestionBank();
                qb.setSubjectId(subIdStr != null && !subIdStr.isBlank() ? Long.parseLong(subIdStr) : 1L);
                qb.setSemesterId(semIdStr != null && !semIdStr.isBlank() ? Integer.parseInt(semIdStr) : 1);
                qb.setUnit(unitStr != null && !unitStr.isBlank() ? Integer.parseInt(unitStr) : 1);
                qb.setCategory(category != null && !category.isBlank() ? category : "Important");
                qb.setDifficulty(difficulty != null && !difficulty.isBlank() ? difficulty : "MEDIUM");
                qb.setQuestionText(effectiveTitle);
                qb.setAnswerText(answerText != null ? answerText.trim() : null);
                qb.setStatus("PUBLISHED");

                if (filePart != null && filePart.getSize() > 0) {
                    FileUploadUtil.UploadResult res = FileUploadUtil.savePdf(filePart, "question-banks");
                    qb.setFileName(res.getOriginalFileName());
                    qb.setFilePath(res.getRelativeFilePath());
                }

                QuestionBank created = adminService.createQuestionBank(qb, adminId, ip);
                JsonUtil.sendCreated(resp, "Question bank item uploaded successfully", created);
                return;
            }

            // JSON request body
            JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
            if (json == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Question details required", "BAD_REQUEST");
                return;
            }

            QuestionBank qb = new QuestionBank();
            String title = json.has("title") && !json.get("title").isJsonNull() ? json.get("title").getAsString() : null;
            String qText = json.has("questionText") && !json.get("questionText").isJsonNull() ? json.get("questionText").getAsString() : null;
            String effective = (title != null && !title.isBlank()) ? title : qText;
            if (effective == null || effective.isBlank()) {
                effective = "VTU Question Bank";
            }
            qb.setQuestionText(effective.trim());

            if (json.has("subjectId") && !json.get("subjectId").isJsonNull()) {
                qb.setSubjectId(json.get("subjectId").getAsLong());
            } else {
                qb.setSubjectId(1L);
            }

            if (json.has("semesterId") && !json.get("semesterId").isJsonNull()) {
                qb.setSemesterId(json.get("semesterId").getAsInt());
            } else {
                qb.setSemesterId(1);
            }

            if (json.has("unit") && !json.get("unit").isJsonNull()) {
                qb.setUnit(json.get("unit").getAsInt());
            } else {
                qb.setUnit(1);
            }

            if (json.has("category") && !json.get("category").isJsonNull()) {
                qb.setCategory(json.get("category").getAsString());
            } else {
                qb.setCategory("Important");
            }

            if (json.has("difficulty") && !json.get("difficulty").isJsonNull()) {
                qb.setDifficulty(json.get("difficulty").getAsString());
            } else {
                qb.setDifficulty("MEDIUM");
            }

            if (json.has("answerText") && !json.get("answerText").isJsonNull()) {
                qb.setAnswerText(json.get("answerText").getAsString());
            } else if (json.has("solutionGuide") && !json.get("solutionGuide").isJsonNull()) {
                qb.setAnswerText(json.get("solutionGuide").getAsString());
            }

            if (json.has("fileName") && !json.get("fileName").isJsonNull()) {
                qb.setFileName(json.get("fileName").getAsString());
            }
            if (json.has("filePath") && !json.get("filePath").isJsonNull()) {
                qb.setFilePath(json.get("filePath").getAsString());
            }

            qb.setStatus("PUBLISHED");

            QuestionBank created = adminService.createQuestionBank(qb, adminId, ip);
            JsonUtil.sendCreated(resp, "Question bank item added successfully", created);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Creation error: " + e.getMessage(), e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long adminId = AuthFilter.getAuthenticatedUserId(req);
            String ip = req.getRemoteAddr();
            String pathInfo = req.getPathInfo();

            if (pathInfo != null) {
                String[] parts = pathInfo.split("/");
                if (parts.length >= 2) {
                    Long id = Long.parseLong(parts[1]);
                    QuestionBank qb = JsonUtil.parseRequestBody(req, QuestionBank.class);
                    qb.setId(id);

                    boolean ok = adminService.updateQuestionBank(qb, adminId, ip);
                    JsonUtil.sendSuccess(resp, "Question bank item updated successfully", ok);
                    return;
                }
            }
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Question ID required", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Update error: " + e.getMessage(), e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long adminId = AuthFilter.getAuthenticatedUserId(req);
            String ip = req.getRemoteAddr();
            String pathInfo = req.getPathInfo();

            if (pathInfo != null) {
                String[] parts = pathInfo.split("/");
                if (parts.length >= 2) {
                    Long id = Long.parseLong(parts[1]);
                    boolean ok = adminService.deleteQuestionBank(id, adminId, ip);
                    JsonUtil.sendSuccess(resp, "Question bank item deleted successfully", ok);
                    return;
                }
            }
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Question ID required", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Delete error: " + e.getMessage(), e.getMessage());
        }
    }
}
