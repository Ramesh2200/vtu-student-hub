package com.vtuconnect.controller;

import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.QuestionBank;
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

@WebServlet(urlPatterns = {"/api/question-banks", "/api/question-banks/*"})
public class QuestionBankServlet extends HttpServlet {

    private final ResourceService resourceService = new ResourceService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long currentUserId = AuthFilter.getAuthenticatedUserId(req);
            String pathInfo = req.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/") || pathInfo.isEmpty()) {
                Integer semesterId = req.getParameter("semesterId") != null && !req.getParameter("semesterId").isBlank() ? Integer.parseInt(req.getParameter("semesterId")) : null;
                Long subjectId = req.getParameter("subjectId") != null && !req.getParameter("subjectId").isBlank() ? Long.parseLong(req.getParameter("subjectId")) : null;
                Integer unit = req.getParameter("unit") != null && !req.getParameter("unit").isBlank() ? Integer.parseInt(req.getParameter("unit")) : null;
                String category = req.getParameter("category");
                String difficulty = req.getParameter("difficulty");
                String query = req.getParameter("q");

                List<QuestionBank> list = resourceService.getQuestionBanks(semesterId, subjectId, unit, category, difficulty, query, "PUBLISHED", currentUserId);
                JsonUtil.sendSuccess(resp, "Question banks retrieved successfully", list);
                return;
            }

            String[] parts = pathInfo.split("/");
            if (parts.length >= 2) {
                Long id = Long.parseLong(parts[1]);
                QuestionBank item = resourceService.getQuestionBankById(id, currentUserId);
                if (item == null) {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Question bank item not found", "NOT_FOUND");
                    return;
                }

                // Check for /api/question-banks/{id}/download
                if (parts.length >= 3 && "download".equalsIgnoreCase(parts[2])) {
                    resp.setContentType("application/pdf");
                    String safeFileName = (item.getFileName() != null && !item.getFileName().isBlank())
                            ? item.getFileName()
                            : ((item.getQuestionText() != null ? item.getQuestionText().replaceAll("[^a-zA-Z0-9.-]", "_") : "VTU_Question_Bank") + ".pdf");
                    resp.setHeader("Content-Disposition", "attachment; filename=\"" + safeFileName + "\"");

                    if (item.getFilePath() != null && !item.getFilePath().isBlank()) {
                        File file = new File(FileUploadUtil.getUploadRoot(), item.getFilePath().replace("/uploads/", ""));
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
                            return;
                        }
                    }

                    // Fallback generated PDF with question details
                    List<String> contentLines = List.of(
                        "--- VISVESVARAYA TECHNOLOGICAL UNIVERSITY BELAGAVI ---",
                        "Subject: " + (item.getSubjectName() != null ? item.getSubjectName() : "Core Subject") + " (" + (item.getSubjectCode() != null ? item.getSubjectCode() : "VTU") + ")",
                        "Category: " + item.getCategory() + "  |  Difficulty: " + item.getDifficulty() + "  |  Unit: " + item.getUnit(),
                        "Question:",
                        item.getQuestionText() != null ? item.getQuestionText() : "Question Bank Material",
                        "",
                        "Model Solution Guide & Key Points:",
                        item.getAnswerText() != null && !item.getAnswerText().isBlank() ? item.getAnswerText() : "Refer to standard prescribed VTU textbooks and verified faculty solutions.",
                        "Status: Verified Academic Repository • VTU Student Connect"
                    );
                    byte[] pdfBytes = com.vtuconnect.util.PdfGeneratorUtil.generateAcademicPdf(
                        item.getQuestionText() != null ? item.getQuestionText() : "VTU Question Bank",
                        "VTU Official Question Bank & Solution Guide",
                        contentLines
                    );
                    resp.setContentLength(pdfBytes.length);
                    try (OutputStream out = resp.getOutputStream()) {
                        out.write(pdfBytes);
                        out.flush();
                    }
                    return;
                }

                // Check for /api/question-banks/{id}/view
                if (parts.length >= 3 && "view".equalsIgnoreCase(parts[2])) {
                    resp.setContentType("application/pdf");
                    String safeFileName = (item.getFileName() != null && !item.getFileName().isBlank())
                            ? item.getFileName()
                            : ((item.getQuestionText() != null ? item.getQuestionText().replaceAll("[^a-zA-Z0-9.-]", "_") : "VTU_Question_Bank") + ".pdf");
                    resp.setHeader("Content-Disposition", "inline; filename=\"" + safeFileName + "\"");

                    if (item.getFilePath() != null && !item.getFilePath().isBlank()) {
                        File file = new File(FileUploadUtil.getUploadRoot(), item.getFilePath().replace("/uploads/", ""));
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
                            return;
                        }
                    }

                    List<String> contentLines = List.of(
                        "--- VISVESVARAYA TECHNOLOGICAL UNIVERSITY BELAGAVI ---",
                        "Subject: " + (item.getSubjectName() != null ? item.getSubjectName() : "Core Subject") + " (" + (item.getSubjectCode() != null ? item.getSubjectCode() : "VTU") + ")",
                        "Category: " + item.getCategory() + "  |  Difficulty: " + item.getDifficulty() + "  |  Unit: " + item.getUnit(),
                        "Question:",
                        item.getQuestionText() != null ? item.getQuestionText() : "Question Bank Material",
                        "",
                        "Model Solution Guide & Key Points:",
                        item.getAnswerText() != null && !item.getAnswerText().isBlank() ? item.getAnswerText() : "Refer to standard prescribed VTU textbooks and verified faculty solutions.",
                        "Status: Verified Academic Repository • VTU Student Connect"
                    );
                    byte[] pdfBytes = com.vtuconnect.util.PdfGeneratorUtil.generateAcademicPdf(
                        item.getQuestionText() != null ? item.getQuestionText() : "VTU Question Bank",
                        "VTU Official Question Bank & Solution Guide",
                        contentLines
                    );
                    resp.setContentLength(pdfBytes.length);
                    try (OutputStream out = resp.getOutputStream()) {
                        out.write(pdfBytes);
                        out.flush();
                    }
                    return;
                }

                JsonUtil.sendSuccess(resp, "Question bank item retrieved", item);
                return;
            }

            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid question bank path", "BAD_REQUEST");
        } catch (NumberFormatException e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid ID format", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }
}
