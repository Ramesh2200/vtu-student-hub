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
                if (pathInfo != null) {
                    String[] parts = pathInfo.split("/");
                    if (parts.length >= 3 && "replace".equalsIgnoreCase(parts[2])) {
                        Long paperId = Long.parseLong(parts[1]);
                        Part filePart = req.getPart("file");
                        FileUploadUtil.UploadResult res = FileUploadUtil.savePdf(filePart, "papers");
                        adminService.replaceNoteFile(paperId, res.getOriginalFileName(), res.getRelativeFilePath(), res.getFileSize(), adminId, ip);
                        JsonUtil.sendSuccess(resp, "Question paper PDF replaced", res);
                        return;
                    }
                }

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
                paper.setTitle(title.trim());
                paper.setSemesterId(Integer.parseInt(semIdStr));
                paper.setSubjectId(Long.parseLong(subIdStr));
                paper.setExamYear(Integer.parseInt(yearStr));
                paper.setExamType(examType != null ? examType : "SEE Regular");
                paper.setFileName(res.getOriginalFileName());
                paper.setFilePath(res.getRelativeFilePath());
                paper.setFileSize(res.getFileSize());
                paper.setStatus("PUBLISHED");

                PreviousYearPaper created = adminService.createPaper(paper, adminId, ip);
                JsonUtil.sendCreated(resp, "Question paper uploaded successfully", created);
                return;
            }

            // JSON body
            JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
            PreviousYearPaper p = JsonUtil.fromJson(json.toString(), PreviousYearPaper.class);
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
}
