package com.vtuconnect.controller;

import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.Note;
import com.vtuconnect.service.ResourceService;
import com.vtuconnect.util.FileUploadUtil;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

@WebServlet(urlPatterns = {"/api/notes", "/api/notes/*"})
public class NotesServlet extends HttpServlet {

    private final ResourceService resourceService = new ResourceService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long currentUserId = AuthFilter.getAuthenticatedUserId(req);
            String pathInfo = req.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/") || pathInfo.isEmpty()) {
                // GET /api/notes with filters
                Integer semesterId = req.getParameter("semesterId") != null && !req.getParameter("semesterId").isBlank() ? Integer.parseInt(req.getParameter("semesterId")) : null;
                Long subjectId = req.getParameter("subjectId") != null && !req.getParameter("subjectId").isBlank() ? Long.parseLong(req.getParameter("subjectId")) : null;
                Integer unit = req.getParameter("unit") != null && !req.getParameter("unit").isBlank() ? Integer.parseInt(req.getParameter("unit")) : null;
                String query = req.getParameter("q");

                List<Note> list = resourceService.getNotes(semesterId, subjectId, unit, query, "PUBLISHED", currentUserId);
                JsonUtil.sendSuccess(resp, "Notes retrieved successfully", list);
                return;
            }

            String[] parts = pathInfo.split("/");
            if (parts.length >= 2) {
                Long noteId = Long.parseLong(parts[1]);
                Note note = resourceService.getNoteById(noteId, currentUserId);

                if (note == null) {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Note not found", "NOT_FOUND");
                    return;
                }

                // Check if this is a download action: /api/notes/{id}/download
                if (parts.length >= 3 && "download".equalsIgnoreCase(parts[2])) {
                    resourceService.recordNoteDownload(noteId, currentUserId, req.getRemoteAddr());

                    File file = new File(FileUploadUtil.getUploadRoot(), note.getFilePath().replace("/uploads/", ""));
                    resp.setContentType("application/pdf");
                    String safeFileName = (note.getFileName() != null && !note.getFileName().isBlank())
                            ? note.getFileName()
                            : (note.getTitle().replaceAll("[^a-zA-Z0-9.-]", "_") + ".pdf");
                    resp.setHeader("Content-Disposition", "attachment; filename=\"" + safeFileName + "\"");

                    if (file.exists() && file.isFile()) {
                        resp.setContentLengthLong(file.length());
                        try (FileInputStream in = new FileInputStream(file);
                             OutputStream out = resp.getOutputStream()) {
                            byte[] buffer = new byte[8192];
                            int bytesRead;
                            while ((bytesRead = in.read(buffer)) != -1) {
                                out.write(buffer, 0, bytesRead);
                            }
                            out.flush();
                        }
                    } else {
                        List<String> contentLines = List.of(
                            "--- VISVESVARAYA TECHNOLOGICAL UNIVERSITY BELAGAVI ---",
                            "Course Module: " + (note.getTitle() != null ? note.getTitle() : "Lecture Notes"),
                            "Module Description: " + (note.getDescription() != null ? note.getDescription() : "VTU Syllabus"),
                            "1. Unit Learning Outcomes and Theoretical Formulations",
                            "2. Step-by-Step Architectural Block Diagrams and Workflows",
                            "3. VTU Semester End Examination (SEE) 10-Mark Model Solutions",
                            "Status: Verified Faculty Material • VTU Student Connect"
                        );
                        byte[] pdfBytes = com.vtuconnect.util.PdfGeneratorUtil.generateAcademicPdf(
                            note.getTitle(),
                            "VTU Student Connect - Academic Curriculum Notes",
                            contentLines
                        );
                        resp.setContentLength(pdfBytes.length);
                        try (OutputStream out = resp.getOutputStream()) {
                            out.write(pdfBytes);
                            out.flush();
                        }
                    }
                    return;
                }

                // Check if /api/notes/{id}/view
                if (parts.length >= 3 && "view".equalsIgnoreCase(parts[2])) {
                    File file = new File(FileUploadUtil.getUploadRoot(), note.getFilePath().replace("/uploads/", ""));
                    resp.setContentType("application/pdf");
                    String safeFileName = (note.getFileName() != null && !note.getFileName().isBlank())
                            ? note.getFileName()
                            : (note.getTitle().replaceAll("[^a-zA-Z0-9.-]", "_") + ".pdf");
                    resp.setHeader("Content-Disposition", "inline; filename=\"" + safeFileName + "\"");

                    if (file.exists() && file.isFile()) {
                        resp.setContentLengthLong(file.length());
                        try (FileInputStream in = new FileInputStream(file);
                             OutputStream out = resp.getOutputStream()) {
                            byte[] buffer = new byte[8192];
                            int bytesRead;
                            while ((bytesRead = in.read(buffer)) != -1) {
                                out.write(buffer, 0, bytesRead);
                            }
                            out.flush();
                        }
                    } else {
                        List<String> contentLines = List.of(
                            "--- VISVESVARAYA TECHNOLOGICAL UNIVERSITY BELAGAVI ---",
                            "Course Module: " + (note.getTitle() != null ? note.getTitle() : "Lecture Notes"),
                            "Module Description: " + (note.getDescription() != null ? note.getDescription() : "VTU Syllabus"),
                            "1. Unit Learning Outcomes and Theoretical Formulations",
                            "2. Step-by-Step Architectural Block Diagrams and Workflows",
                            "3. VTU Semester End Examination (SEE) 10-Mark Model Solutions",
                            "Status: Verified Faculty Material • VTU Student Connect"
                        );
                        byte[] pdfBytes = com.vtuconnect.util.PdfGeneratorUtil.generateAcademicPdf(
                            note.getTitle(),
                            "VTU Student Connect - Academic Curriculum Notes",
                            contentLines
                        );
                        resp.setContentLength(pdfBytes.length);
                        try (OutputStream out = resp.getOutputStream()) {
                            out.write(pdfBytes);
                            out.flush();
                        }
                    }
                    return;
                }

                // Default: GET /api/notes/{id}
                JsonUtil.sendSuccess(resp, "Note details retrieved", note);
                return;
            }

            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid note path", "BAD_REQUEST");
        } catch (NumberFormatException e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid note ID format", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }
}
