package com.vtuconnect.controller;

import com.vtuconnect.model.Semester;
import com.vtuconnect.model.Subject;
import com.vtuconnect.service.ResourceService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/semesters", "/api/semesters/*"})
public class SemesterServlet extends HttpServlet {

    private final ResourceService resourceService = new ResourceService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            String pathInfo = req.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/") || pathInfo.isEmpty()) {
                // GET /api/semesters
                List<Semester> list = resourceService.getAllSemesters();
                JsonUtil.sendSuccess(resp, "Semesters retrieved", list);
                return;
            }

            // Path patterns: /{id} or /{id}/subjects
            String[] parts = pathInfo.split("/");
            if (parts.length >= 2) {
                int semId = Integer.parseInt(parts[1]);

                if (parts.length >= 3 && "subjects".equalsIgnoreCase(parts[2])) {
                    // GET /api/semesters/{id}/subjects
                    List<Subject> subjects = resourceService.getSubjectsBySemester(semId);
                    JsonUtil.sendSuccess(resp, "Subjects for semester " + semId + " retrieved", subjects);
                    return;
                }

                // GET /api/semesters/{id}
                Semester sem = resourceService.getSemesterById(semId);
                if (sem == null) {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Semester not found", "NOT_FOUND");
                    return;
                }
                sem.setSubjects(resourceService.getSubjectsBySemester(semId));
                JsonUtil.sendSuccess(resp, "Semester retrieved", sem);
                return;
            }

            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid path", "BAD_REQUEST");
        } catch (NumberFormatException e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid semester ID format", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error retrieving semesters: " + e.getMessage(), e.getMessage());
        }
    }
}
