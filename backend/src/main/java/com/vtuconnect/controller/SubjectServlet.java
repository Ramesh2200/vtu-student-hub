package com.vtuconnect.controller;

import com.vtuconnect.model.Subject;
import com.vtuconnect.service.ResourceService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/subjects", "/api/subjects/*"})
public class SubjectServlet extends HttpServlet {

    private final ResourceService resourceService = new ResourceService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            String pathInfo = req.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/") || pathInfo.isEmpty()) {
                String semParam = req.getParameter("semesterId");
                List<Subject> list;
                if (semParam != null && !semParam.isBlank()) {
                    list = resourceService.getSubjectsBySemester(Integer.parseInt(semParam));
                } else {
                    list = resourceService.getAllSubjects();
                }
                JsonUtil.sendSuccess(resp, "Subjects retrieved", list);
                return;
            }

            String[] parts = pathInfo.split("/");
            if (parts.length >= 2) {
                Long subjectId = Long.parseLong(parts[1]);
                Subject subject = resourceService.getSubjectById(subjectId);
                if (subject == null) {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Subject not found", "NOT_FOUND");
                    return;
                }
                JsonUtil.sendSuccess(resp, "Subject details retrieved", subject);
                return;
            }

            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid subject path", "BAD_REQUEST");
        } catch (NumberFormatException e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid subject ID format", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error retrieving subjects: " + e.getMessage(), e.getMessage());
        }
    }
}
