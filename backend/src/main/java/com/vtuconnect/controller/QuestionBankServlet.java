package com.vtuconnect.controller;

import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.QuestionBank;
import com.vtuconnect.service.ResourceService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
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
