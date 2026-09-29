package com.vtuconnect.controller;

import com.google.gson.JsonObject;
import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.PreviousYearPaper;
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

@WebServlet(urlPatterns = {"/api/admin/previous-papers", "/api/admin/previous-papers/*"})
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024,
        maxFileSize = 25 * 1024 * 1024,
        maxRequestSize = 30 * 1024 * 1024
)
public class AdminPreviousPaperServlet extends HttpServlet {

    private final AdminService adminService = new AdminService();
    private final ResourceService resourceService = new ResourceService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long adminId = AuthFilter.getAuthenticatedUserId(req);
            Integer semId = req.getParameter("semesterId") != null && !req.getParameter("semesterId").isBlank() ? Integer.parseInt(req.getParameter("semesterId")) : null;
            Long subId = req.getParameter("subjectId") != null && !req.getParameter("subjectId").isBlank() ? Long.parseLong(req.getParameter("subjectId")) : null;
            Integer year = req.getParameter("year") != null && !req.getParameter("year").isBlank() ? Integer.parseInt(req.getParameter("year")) : null;
            String q = req.getParameter("q");

            List<PreviousYearPaper> list = resourceService.getPreviousPapers(semId, subId, year, null, q, "ALL", adminId);
            JsonUtil.sendSuccess(resp, "Previous papers retrieved", list);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        try {
            Long adminId = AuthFilter.getAuthenticatedUserId(req);
            String ip = req.getRemoteAddr();
            String pathInfo = req.getPathInfo();

            String contentType = req.getContentType();
            if (contentType != null && contentType.toLowerCase().startsWith("multipart/form-data")) {
                // Check for replace action: /api/admin/previous-papers/{id}/replace
                if (pathInfo != null) {
                    String[] parts = pathInfo.split("/");
                    if (parts.length >= 3 && "replace".equalsIgnoreCase(parts[2])) {
                        Long paperId = Long.parseLong(parts[1]);
                        Part filePart = req.getPart("file");
                        if (filePart == null || filePart.getSize() == 0) {
                            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "No PDF file provided", "MISSING_FILE");
                            return;
                        }
                        FileUploadUtil.UploadResult res = FileUploadUtil.savePdf(filePart, "papers");
                        adminService.replacePaperFile(paperId, res.getOriginalFileName(), res.getRelativeFilePath(), res.getFileSize(), adminId, ip);
                        JsonUtil.sendSuccess(resp, "Question paper PDF replaced", res);
                        return;
                    }
                }

                // Multipart PDF upload
                Part filePart = req.getPart("file");
                if (filePart == null || filePart.getSize() == 0) {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "PDF file is required", "MISSING_FILE");
                    return;
                }

                String title = req.getParameter("title");
                String semIdStr = req.getParameter("semesterId");
                String subIdStr = req.getParameter("subjectId");
                String yearStr = req.getParameter("examYear");
                String examType = req.getParameter("examType");

                FileUploadUtil.UploadResult res = FileUploadUtil.savePdf(filePart, "papers");

                PreviousYearPaper paper = new PreviousYearPaper();
                paper.setTitle(title != null && !title.isBlank() ? title.trim() : "VTU Question Paper");
                paper.setSemesterId(semIdStr != null && !semIdStr.isBlank() ? Integer.parseInt(semIdStr) : 1);
                paper.setSubjectId(subIdStr != null && !subIdStr.isBlank() ? Long.parseLong(subIdStr) : 1L);
                paper.setExamYear(yearStr != null && !yearStr.isBlank() ? Integer.parseInt(yearStr) : 2024);
                paper.setExamType(examType != null && !examType.isBlank() ? examType : "SEE Regular");
                paper.setFileName(res.getOriginalFileName());
                paper.setFilePath(res.getRelativeFilePath());
                paper.setFileSize(res.getFileSize());
                paper.setStatus("PUBLISHED");

                PreviousYearPaper created = adminService.createPaper(paper, adminId, ip);
                JsonUtil.sendCreated(resp, "Question paper uploaded successfully", created);
                return;
            }

            // JSON body - flexible field name parsing
            JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
            if (json == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Request body is required", "BAD_REQUEST");
                return;
            }

            PreviousYearPaper p = new PreviousYearPaper();

            // Title
            String title = json.has("title") && !json.get("title").isJsonNull() ? json.get("title").getAsString() : "VTU Question Paper";
            p.setTitle(title.trim());

            // Subject ID
            long subjectId = json.has("subjectId") && !json.get("subjectId").isJsonNull() ? json.get("subjectId").getAsLong() : 1L;
            p.setSubjectId(subjectId);

            // Semester ID (may be missing; default to 1)
            int semesterId = 1;
            if (json.has("semesterId") && !json.get("semesterId").isJsonNull()) {
                semesterId = json.get("semesterId").getAsInt();
            }
            p.setSemesterId(semesterId);

            // Exam Year (supports both examYear and year)
            int examYear = 2024;
            if (json.has("examYear") && !json.get("examYear").isJsonNull()) {
                examYear = json.get("examYear").getAsInt();
            } else if (json.has("year") && !json.get("year").isJsonNull()) {
                examYear = json.get("year").getAsInt();
            }
            p.setExamYear(examYear);

            // Exam Type - normalize to match DB ENUM('SEE Regular', 'SEE Supplementary', 'Make-up Exam')
            String examType = json.has("examType") && !json.get("examType").isJsonNull()
                    ? json.get("examType").getAsString() : "SEE Regular";
            examType = normalizeExamType(examType);
            p.setExamType(examType);

            // Status
            String status = json.has("status") && !json.get("status").isJsonNull()
                    ? json.get("status").getAsString() : "PUBLISHED";
            p.setStatus(status);

            // File fields - use placeholder for JSON-only records (no actual PDF)
            String fileName = json.has("fileName") && !json.get("fileName").isJsonNull()
                    ? json.get("fileName").getAsString() : "pending_upload.pdf";
            String filePath = json.has("filePath") && !json.get("filePath").isJsonNull()
                    ? json.get("filePath").getAsString() : "/uploads/papers/pending_upload.pdf";
            p.setFileName(fileName);
            p.setFilePath(filePath);
            p.setFileSize(0L);

            PreviousYearPaper created = adminService.createPaper(p, adminId, ip);
            JsonUtil.sendCreated(resp, "Paper recorded", created);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Upload error: " + e.getMessage(), e.getMessage());
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
                    JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
                    PreviousYearPaper p = JsonUtil.fromJson(json.toString(), PreviousYearPaper.class);
                    p.setId(id);

                    boolean ok = adminService.updatePaper(p, adminId, ip);
                    JsonUtil.sendSuccess(resp, "Paper updated successfully", ok);
                    return;
                }
            }
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Paper ID required", "BAD_REQUEST");
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
                    boolean ok = adminService.deletePaper(id, adminId, ip);
                    JsonUtil.sendSuccess(resp, "Paper deleted successfully", ok);
                    return;
                }
            }
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Paper ID required", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Delete error: " + e.getMessage(), e.getMessage());
        }
    }

    /**
     * Normalize examType to DB ENUM values: 'SEE Regular', 'SEE Supplementary', 'Make-up Exam'
     */
    private String normalizeExamType(String input) {
        if (input == null) return "SEE Regular";
        String upper = input.toUpperCase().trim();
        if (upper.equals("REGULAR") || upper.contains("REGULAR")) return "SEE Regular";
        if (upper.equals("SUPPLEMENTARY") || upper.contains("SUPPLEMENT")) return "SEE Supplementary";
        if (upper.equals("SPECIAL") || upper.contains("MAKE") || upper.contains("MAKEUP")) return "Make-up Exam";
        // Check if already a valid value
        if (input.equals("SEE Regular") || input.equals("SEE Supplementary") || input.equals("Make-up Exam")) {
            return input;
        }
        return "SEE Regular"; // Safe default
    }
}
