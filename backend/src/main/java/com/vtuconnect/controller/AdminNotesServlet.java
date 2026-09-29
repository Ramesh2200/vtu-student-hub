package com.vtuconnect.controller;

import com.google.gson.JsonObject;
import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.Note;
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

@WebServlet(urlPatterns = {"/api/admin/notes", "/api/admin/notes/*"})
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024,      // 1 MB
        maxFileSize = 25 * 1024 * 1024,       // 25 MB
        maxRequestSize = 30 * 1024 * 1024     // 30 MB
)
public class AdminNotesServlet extends HttpServlet {

    private final AdminService adminService = new AdminService();
    private final ResourceService resourceService = new ResourceService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long adminId = AuthFilter.getAuthenticatedUserId(req);
            String pathInfo = req.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/") || pathInfo.isEmpty()) {
                // Admin can view all notes including DRAFT and UNPUBLISHED
                String status = req.getParameter("status"); // null means all
                Integer semId = req.getParameter("semesterId") != null && !req.getParameter("semesterId").isBlank() ? Integer.parseInt(req.getParameter("semesterId")) : null;
                Long subId = req.getParameter("subjectId") != null && !req.getParameter("subjectId").isBlank() ? Long.parseLong(req.getParameter("subjectId")) : null;
                String q = req.getParameter("q");

                List<Note> list = resourceService.getNotes(semId, subId, null, q, status != null ? status : "ALL", adminId);
                JsonUtil.sendSuccess(resp, "Admin notes retrieved", list);
                return;
            }

            String[] parts = pathInfo.split("/");
            if (parts.length >= 2) {
                Long noteId = Long.parseLong(parts[1]);
                Note note = resourceService.getNoteById(noteId, adminId);
                if (note == null) {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Note not found", "NOT_FOUND");
                    return;
                }
                JsonUtil.sendSuccess(resp, "Note retrieved", note);
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
            String pathInfo = req.getPathInfo();

            // Check if multipart upload
            String contentType = req.getContentType();
            if (contentType != null && contentType.toLowerCase().startsWith("multipart/form-data")) {

                // Check if this is a replace action: /api/admin/notes/{id}/replace
                if (pathInfo != null) {
                    String[] parts = pathInfo.split("/");
                    if (parts.length >= 3 && "replace".equalsIgnoreCase(parts[2])) {
                        Long noteId = Long.parseLong(parts[1]);
                        Part filePart = req.getPart("file");
                        if (filePart == null || filePart.getSize() == 0) {
                            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "No PDF file provided for replacement", "MISSING_FILE");
                            return;
                        }

                        FileUploadUtil.UploadResult res = FileUploadUtil.savePdf(filePart, "notes");
                        adminService.replaceNoteFile(noteId, res.getOriginalFileName(), res.getRelativeFilePath(), res.getFileSize(), adminId, ip);
                        JsonUtil.sendSuccess(resp, "PDF replaced successfully", res);
                        return;
                    }
                }

                // Normal upload: POST /api/admin/notes/upload or POST /api/admin/notes
                Part filePart = req.getPart("file");
                if (filePart == null || filePart.getSize() == 0) {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "PDF file is required", "MISSING_FILE");
                    return;
                }

                String title = req.getParameter("title");
                String description = req.getParameter("description");
                String semIdStr = req.getParameter("semesterId");
                String subIdStr = req.getParameter("subjectId");
                String unitStr = req.getParameter("unit");
                String status = req.getParameter("status");

                if (title == null || title.isBlank() || semIdStr == null || subIdStr == null) {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Title, semester, and subject are required", "MISSING_FIELDS");
                    return;
                }

                FileUploadUtil.UploadResult res = FileUploadUtil.savePdf(filePart, "notes");

                Note note = new Note();
                note.setTitle(title.trim());
                note.setDescription(description);
                note.setSemesterId(Integer.parseInt(semIdStr));
                note.setSubjectId(Long.parseLong(subIdStr));
                note.setUnit(unitStr != null && !unitStr.isBlank() ? Integer.parseInt(unitStr) : 1);
                note.setFileName(res.getOriginalFileName());
                note.setFilePath(res.getRelativeFilePath());
                note.setFileSize(res.getFileSize());
                note.setUploadedBy(adminId);
                note.setStatus(status != null && !status.isBlank() ? status : "PUBLISHED");

                Note created = adminService.createNote(note, adminId, ip);
                JsonUtil.sendCreated(resp, "Note PDF uploaded and published successfully", created);
                return;
            }

            // JSON-based metadata creation or update
            JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
            if (json == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Request body is empty", "BAD_REQUEST");
                return;
            }

            Note note = JsonUtil.fromJson(json.toString(), Note.class);
            note.setUploadedBy(adminId);
            if (note.getStatus() == null) note.setStatus("PUBLISHED");

            Note created = adminService.createNote(note, adminId, ip);
            JsonUtil.sendCreated(resp, "Note record created successfully", created);
        } catch (IllegalArgumentException e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage(), "VALIDATION_ERROR");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Note creation error: " + e.getMessage(), e.getMessage());
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
                    Long noteId = Long.parseLong(parts[1]);

                    // Check for status toggle: /api/admin/notes/{id}/status
                    if (parts.length >= 3 && "status".equalsIgnoreCase(parts[2])) {
                        JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
                        String newStatus = json.get("status").getAsString();
                        adminService.toggleNoteStatus(noteId, newStatus, adminId, ip);
                        JsonUtil.sendSuccess(resp, "Note status updated to " + newStatus, null);
                        return;
                    }

                    // Metadata update
                    JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
                    Note note = JsonUtil.fromJson(json.toString(), Note.class);
                    note.setId(noteId);

                    boolean ok = adminService.updateNote(note, adminId, ip);
                    JsonUtil.sendSuccess(resp, "Note metadata updated successfully", ok);
                    return;
                }
            }

            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Note ID required for update", "BAD_REQUEST");
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
                    Long noteId = Long.parseLong(parts[1]);
                    boolean ok = adminService.deleteNote(noteId, adminId, ip);
                    JsonUtil.sendSuccess(resp, "Note deleted successfully", ok);
                    return;
                }
            }

            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Note ID required for deletion", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Delete error: " + e.getMessage(), e.getMessage());
        }
    }
}
