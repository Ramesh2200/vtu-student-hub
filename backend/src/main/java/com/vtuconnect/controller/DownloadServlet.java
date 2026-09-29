package com.vtuconnect.controller;

import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.Download;
import com.vtuconnect.service.ResourceService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/downloads", "/api/downloads/*"})
public class DownloadServlet extends HttpServlet {

    private final ResourceService resourceService = new ResourceService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long userId = AuthFilter.getAuthenticatedUserId(req);
            if (userId == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated", "UNAUTHORIZED");
                return;
            }

            List<Download> list = resourceService.getUserDownloads(userId);
            JsonUtil.sendSuccess(resp, "Download history retrieved", list);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }
}
