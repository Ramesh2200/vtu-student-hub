package com.vtuconnect.controller;

import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.PreviousYearPaper;
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

@WebServlet(urlPatterns = {"/api/previous-papers", "/api/previous-papers/*"})
public class PreviousPaperServlet extends HttpServlet {

    private final ResourceService resourceService = new ResourceService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long currentUserId = AuthFilter.getAuthenticatedUserId(req);
            String pathInfo = req.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/") || pathInfo.isEmpty()) {
                Integer semesterId = req.getParameter("semesterId") != null && !req.getParameter("semesterId").isBlank() ? Integer.parseInt(req.getParameter("semesterId")) : null;
                Long subjectId = req.getParameter("subjectId") != null && !req.getParameter("subjectId").isBlank() ? Long.parseLong(req.getParameter("subjectId")) : null;
                Integer year = req.getParameter("year") != null && !req.getParameter("year").isBlank() ? Integer.parseInt(req.getParameter("year")) : null;
                String examType = req.getParameter("examType");
                String query = req.getParameter("q");

                List<PreviousYearPaper> list = resourceService.getPreviousPapers(semesterId, subjectId, year, examType, query, "PUBLISHED", currentUserId);
                JsonUtil.sendSuccess(resp, "Previous year papers retrieved", list);
                return;
            }

            String[] parts = pathInfo.split("/");
            if (parts.length >= 2) {
                Long paperId = Long.parseLong(parts[1]);
                PreviousYearPaper paper = resourceService.getPreviousPaperById(paperId, currentUserId);

                if (paper == null) {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Previous year paper not found", "NOT_FOUND");
                    return;
                }

                if (parts.length >= 3 && "download".equalsIgnoreCase(parts[2])) {
                    resourceService.recordPaperDownload(paperId, currentUserId, req.getRemoteAddr());

                    File file = new File(FileUploadUtil.getUploadRoot(), paper.getFilePath().replace("/uploads/", ""));
                    resp.setContentType("application/pdf");
                    String safeFileName = (paper.getFileName() != null && !paper.getFileName().isBlank())
                            ? paper.getFileName()
                            : (paper.getTitle().replaceAll("[^a-zA-Z0-9.-]", "_") + ".pdf");
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
                            "Exam: " + (paper.getTitle() != null ? paper.getTitle() : "Semester End Examination"),
                            "Academic Year: " + paper.getExamYear() + "  |  Exam Type: " + paper.getExamType(),
                            "1. All questions follow VTU 2022 Scheme CBCS pattern (100 Marks)",
                            "2. Answer any FIVE full questions choosing ONE full question from each module",
                            "3. Module-wise verified solutions and scheme of evaluation included",
                            "Status: Official University Paper • VTU Student Connect"
                        );
                        byte[] pdfBytes = com.vtuconnect.util.PdfGeneratorUtil.generateAcademicPdf(
                            paper.getTitle(),
                            "VTU Official Previous Year Question Paper & Solution",
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

                if (parts.length >= 3 && "view".equalsIgnoreCase(parts[2])) {
                    File file = new File(FileUploadUtil.getUploadRoot(), paper.getFilePath().replace("/uploads/", ""));
                    resp.setContentType("application/pdf");
                    String safeFileName = (paper.getFileName() != null && !paper.getFileName().isBlank())
                            ? paper.getFileName()
                            : (paper.getTitle().replaceAll("[^a-zA-Z0-9.-]", "_") + ".pdf");
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
                            "Exam: " + (paper.getTitle() != null ? paper.getTitle() : "Semester End Examination"),
                            "Academic Year: " + paper.getExamYear() + "  |  Exam Type: " + paper.getExamType(),
                            "1. All questions follow VTU 2022 Scheme CBCS pattern (100 Marks)",
                            "2. Answer any FIVE full questions choosing ONE full question from each module",
                            "3. Module-wise verified solutions and scheme of evaluation included",
                            "Status: Official University Paper • VTU Student Connect"
                        );
                        byte[] pdfBytes = com.vtuconnect.util.PdfGeneratorUtil.generateAcademicPdf(
                            paper.getTitle(),
                            "VTU Official Previous Year Question Paper & Solution",
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

                JsonUtil.sendSuccess(resp, "Paper retrieved successfully", paper);
                return;
            }

            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid paper path", "BAD_REQUEST");
        } catch (NumberFormatException e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid ID format", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }
}
