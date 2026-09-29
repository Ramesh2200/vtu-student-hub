package com.vtuconnect.controller;

import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.service.ResourceService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

@WebServlet(urlPatterns = {"/api/search"})
public class GlobalSearchServlet extends HttpServlet {

    private final ResourceService resourceService = new ResourceService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long currentUserId = AuthFilter.getAuthenticatedUserId(req);
            String query = req.getParameter("q");

            if (query == null || query.trim().isEmpty()) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Query parameter 'q' is required", "MISSING_QUERY");
                return;
            }

            Map<String, Object> results = resourceService.globalSearch(query.trim(), currentUserId);
            JsonUtil.sendSuccess(resp, "Search results retrieved", results);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Search failed: " + e.getMessage(), e.getMessage());
        }
    }
}
